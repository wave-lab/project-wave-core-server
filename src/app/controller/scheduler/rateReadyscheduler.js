const express = require('express');
const router = express.Router({ mergeParams: true });
const schedule = require('node-schedule');
const moment = require('moment');

const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const playlist = require('../../model/schema/playlist');//이렇게 해야 접근 가능
const top10 = require('../../model/schema/top10');
const playlistModules = require('../../module/playlistModules');
const myPlaylist = require('../../model/schema/myPlaylist');

const genre = require('../../module/genre');

const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');

//낮 12시 마다

/**
 * 평가 대기곡 스케줄러
 * 해당 사용자가 업로드한 곡은 제외
 * 사용자가 선호하는 아티스트, 장르 기반
 * 1. 사용자가 좋아하는 아티스트의 노래를 커버한 곡
 * 2. 사용자가 좋아하는 장르
 * 3. 곡들을 사용자 rateReady 플레이리스트에 삽입
 * songStatus 0유보 1 통과 2 실패
 */

var twelveHour = schedule.scheduleJob('0 0 12 1/1 * ? *', async () => {
    console.log("현재시간 : " + new Date() + " 평가 대기곡 스케줄러 실행");

    const QUERY1 = 'SELECT userIdx FROM user';
    const QUERY2 = 'SELECT * FROM user_originArtist WHERE userIdx = ?'
    const QUERY3 = 'SELECT * FROM user_genre WHERE userIdx = ?'

    const result1 = await pool.queryParam_None(QUERY1);

    let songList = [];

    for (i = 0; i < result1.length; i++) {

        //사용자가 좋아하는 아티스트 조회
        const result2 = await pool.queryParam_Arr(QUERY2, result1[i].userIdx);
        if (result2.length != 0) {
            //console.log("사용자가 좋아하는 아티스트 : " + result2[0].originArtistIdx);

            //해당 사용자가 올린 곡은 아니면서
            //songStatus == 0
            const songlist = await song.find(
                { userIdx: result2[0].originArtistIdx },
                { songStatus: 0 }
            );
            songList.push(songlist);
        }

        //사용자가 좋아하는 장르
        const result3 = await pool.queryParam_Arr(QUERY3, result1[i].userIdx);
        if (result3.length != 0) {
            //console.log("선호하는 장르 : " + genre[result3[0].genreIdx]);
            //해당 사용자가 올린 곡은 아니면서
            //songStatus == 0
            const songlist = await song.find(
                { genreName: result3[0].genreIdx },
                { songStatus: 0 }
            );
            songList.push(songlist);
        }

        const result4 = (await myPlaylist.find({ userIdx: result1[i].userIdx }))[0];
        await playlist.updateOne({ _id: result4.rateReadyPlaylist }, { $set: { songList: songList } });
    }
    console.log("현재시간 : " + new Date() + " 평가 대기곡 스케줄러 실행 끝");
})

module.exports = router;