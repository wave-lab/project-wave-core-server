const express = require('express');
const router = express.Router({ mergeParams: true });
const schedule = require('node-schedule');
const moment = require('moment', 'ddd DD MMM YYYY HH:mm:ss ZZ');
const song = require('../../model/schema/song')

schedule.scheduleJob('0 0 12 1/1 * ? *', async function () { //매일 정오
    console.log('심사곡 상태 판별 스케쥴러 실행');
    const allSongs = await song.find();
    for (var i = 0; i < allSongs.length; i++) {
        if (allSongs[i].songStatus == 1) {
            continue;
        }
        else if (allSongs[i].songStatus == 0) {
            const deleteTime = allSongs[i].deleteTime;
            const duration = moment().diff(deleteTime, 'seconds');
            if (duration > 0) { // 7일 지났을 때
                if (allSongs[i].rateUserCount < 10) {
                    console.log('songId : ' + allSongs[i]._id + '==> 마감했고 평가 유저수도 부족. 탈락!');
                    await song.updateOne({ _id: allSongs[i]._id }, { $set: { "songStatus": 2 } })
                }
                else {
                    let average = (parseFloat(allSongs[i].rateScore / allSongs[i].rateUserCount).toFixed(1));
                    console.log('songId : ' + allSongs[i]._id + ' ==> 7일 만료. 점수 검사');
                    console.log('songId : ' + allSongs[i]._id + ' ==> 점수는 : ' + average);
                    if (average >= 3.0) {

                        console.log('songId : ' + allSongs[i]._id + '==>합격!');
                        await song.updateMany({ _id: allSongs[i]._id }, { $set: { "songStatus": 1, "enrollTime": moment() } })
                    }
                    else {
                        console.log('songId : ' + allSongs[i]._id + '==> 마감했고 평가 유저수는 넘었지만 점수가 미달. 탈락!');
                        await song.updateOne({ _id: allSongs[i]._id }, { $set: { "songStatus": 2 } })

                    }
                }
            }
            else {
                if (allSongs[i].rateUserCount >= 10) {
                    let average = (parseFloat(allSongs[i].rateScore / allSongs[i].rateUserCount).toFixed(1));
                    console.log('songId : ' + allSongs[i]._id + '==>점수 검사');
                    console.log('songId : ' + allSongs[i]._id + ' ==> 점수는 : ' + average + ' 유보입니다.');
                    if (average >= 3) {
                        console.log('songId : ' + allSongs[i]._id + ' ==> 합격');
                        await song.updateMany({ _id: allSongs[i]._id }, { $set: { "songStatus": 1, "enrollTime": moment() } })
                    }
                }
                else {
                    continue;
                }
            }
        }
        else {

        }
    }
})

module.exports = router;


/*
    1. fail : 7일이상 됐고 평가자 10명 미만
    2. fail : 7일 이내에 10명이 평가했지만 3점 미만일때
    3. pass : 7일 이내 10명 평가 3점이상 -> rated로 가기, rateReady 에서 삭제,


*/