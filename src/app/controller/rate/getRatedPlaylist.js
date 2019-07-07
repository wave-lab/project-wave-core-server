const express = require('express');
const router = express.Router({ mergeParams: true })

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const playlistModules = require('../../module/playlistModules');

/**
 * 내가 평가한 곡 리스트 조회
 */

router.get('/', async (req, res) => {

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        const result1 = await playlistModules.getPlayList(ID, "rated");
        res.status(200).send(responseUtil.successTrue(returnCode.CREATED, "내가 평가한 곡 플레이리스트", result1));
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "로그인을 해 주세요"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

module.exports = router;