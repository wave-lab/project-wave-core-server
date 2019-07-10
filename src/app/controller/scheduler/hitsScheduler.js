const express = require('express');
const router = express.Router({ mergeParams: true });
const schedule = require('node-schedule');
const moment = require('moment');
const playlistModules = require('../../module/playlistModules');
const pool = require('../../module/pool');
'0 0 0 1/1 * ? *'
schedule.scheduleJob('*/10 * * * * *', async function () { //매일 자정
    console.log('적중곡 판별 스케쥴러 실행');
    const getAllUserDataQuery = 'SELECT userIdx, hitSongCount, rateSongCount, totalPoint FROM user'
    const getUserRateScoreQuery = 'SELECT ratePoint, songIdx FROM rate_history WHERE userIdx = ?'
    const updateHitSongCountQuery = 'UPDATE user SET hitSongCount=? WHERE userIdx = ?'
    const addHitPointQuery = 'INSERT INTO point_history(userIdx, songIdx, getPoint) VALUES(?, ?, ?)';
    const updateTotalPointQuery = 'UPDATE user SET totalPoint=? WHERE userIdx = ?';
    const getPointHistoryQuery = 'SELECT songIdx FROM point_history WHERE userIdx = ?'
    const getAllUserDataResult = await pool.queryParam_None(getAllUserDataQuery);
    let pointVerify=0;
    for (var i = 0; i < getAllUserDataResult.length; i++) {
        if (getAllUserDataResult[i].rateSongCount == 0) { //평가한 곡 없으면 넘어가고
            continue;
        }
        else {
            let userIdx = getAllUserDataResult[i].userIdx;
            const ratedPlaylistIdx = (await playlistModules.getPlayList(userIdx, 'rated'))._id;
            console.log(ratedPlaylistIdx);
            const hitsPlaylistIdx = (await playlistModules.getPlayList(userIdx, 'hits'))._id;
            const ratedSongList = await playlistModules.getSongList(ratedPlaylistIdx);
            const getUserRateScoreResult = await pool.queryParam_Arr(getUserRateScoreQuery, [userIdx]);
            const getPointHistoryResult = await pool.queryParam_Arr(getPointHistoryQuery, [userIdx]);
            console.log(getPointHistoryResult);
            for (var j = 0; j < ratedSongList.length; j++) {
                for (var k = 0; k < getUserRateScoreResult.length; k++) {
                    let songIdx = ratedSongList[j]._id;
                    console.log('점수받은 목록 수 : ' + getPointHistoryResult.length);
                    console.log('비교할 곡 : ' + songIdx);
                    
                    for (var l = 0; l < getPointHistoryResult.length; l++) {
                        if (songIdx == getPointHistoryResult[l].songIdx) {
                            console.log('내가 평가한 곡 : ' + getPointHistoryResult[l].songIdx);
                            console.log('====================이미 점수 받음====================');
                            pointVerify = 0;
                            break;
                        }
                    }
                    if (songIdx == getUserRateScoreResult[k].songIdx && pointVerify !== 0) { //평가한 노래 리스트에 평가대기곡 리스트의 노래가 있을 때
                        if (ratedSongList[j].songStatus == 1 || ratedSongList[j].songStatus == 2) { //유보상태가 아니면
                            let average = (parseFloat(ratedSongList[j].rateScore / ratedSongList[j].rateUserCount).toFixed(1));
                            if (Math.abs(average - getUserRateScoreResult[k].ratePoint) <= 0.3) { // 평균 점수-내점수 절댓값 0.3 이하
                                console.log(userIdx + '번 유저가' + ratedSongList[j]._id + ' 번 노래를 적중!');
                                await playlistModules.addSongToPlaylist(hitsPlaylistIdx, ratedSongList[j]); //적중곡 목록에 추가
                                let newCount = (getAllUserDataResult[i].hitSongCount + 1);
                                await pool.queryParam_Arr(updateHitSongCountQuery, [newCount, userIdx]); // 적중곡수 수정
                                await pool.queryParam_Arr(addHitPointQuery, [userIdx, songIdx.toString(), 400]); //포인트 내역 추가
                                let newPoint = (getAllUserDataResult[i].totalPoint + 400);
                                await pool.queryParam_Arr(updateTotalPointQuery, [newPoint, userIdx]); //총 포인트 수정
                            }
                        }
                    }
                }
            }

        }
    }
})

module.exports = router;