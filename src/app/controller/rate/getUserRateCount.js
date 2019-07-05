const express = require('express');
const router = express.Router({ mergeParams: true })

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');


router.get('/', async (req, res) => {

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);
    ID = 1;

    //회원일 경우
    if (ID > 0) {
        const QUERY1 = 'SELECT rateSongCount FROM user WHERE userIdx = ?';
        let result1 = await pool.queryParam_Arr(QUERY1, ID);
        res.status(200).send(responseUtil.successTrue(returnCode.CREATED, "평가 곡 조회 성공", result1[0].rateSongCount));
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