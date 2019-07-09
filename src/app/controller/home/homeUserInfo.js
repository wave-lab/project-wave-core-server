const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

const playlist = require('../../model/schema/playlist');
const myPlaylist = require('../../model/schema/myPlaylist');
const playlistModules = require('../../module/playlistModules');
const song = require('../../model/schema/song');
const top10 = require('../../model/schema/top10');

router.get('/', async(req, res, next) => {
    const ID = await jwt.verify(req.headers.authorization);
    console.log(ID);

    if(ID > 0) { //회원일 경우
        // 홈 상단 사용자 정보
        userInfoQuery = 'SELECT nickname, hitSongCount, rateSongCount, totalPoint FROM user WHERE userIdx = ?';
        userInfoResult = await pool.queryParam_Arr(userInfoQuery, [ID]);
        console.log(userInfoResult[0]);
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SUCCESS, userInfoResult));
    }else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }
});

module.exports = router;