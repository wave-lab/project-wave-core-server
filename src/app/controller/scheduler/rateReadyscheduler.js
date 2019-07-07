const express = require('express');
const router = express.Router({ mergeParams: true });
const schedule = require('node-schedule');
const moment = require('moment');

const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const playlist = require('../../model/schema/playlist');//이렇게 해야 접근 가능
const top10 = require('../../model/schema/top10');

const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');

//12시 마다

/**
 * 평가 대기곡 스케줄러
 * 해당 사용자가 업로드한 곡은 제외
 * 사용자가 선호하는 아티스트, 장르 기반
 * 1. 사용자가 좋아하는 아티스트의 노래를 커버한 곡
 * 2. 사용자가 좋아하는 장르
 * 3. 곡들을 사용자 rateReady 플레이리스트에 삽입
 * songStatus 0유보 1 통과 2 실패
 */

var twelveHour = schedule.scheduleJob('30 * * * * *', async () => {
    let mNow = new Date();
    console.log("현재시간 : " + mNow);
    console.log('스케쥴러 실행');

    const QUERY1 = 'SELECT userIdx FROM user';
    const result1 = await pool.queryParam_None(QUERY1);

    for(i = 0; i < result1.length; i++) {
        
    }

    console.log(result1);
})

module.exports = router;