const express = require('express');
const router = express.Router({ mergeParams: true })

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');

/**
 * 페이지네이션 X
 */

router.get('/', async (req, res) => {

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);
    ID = 57;

    //회원일 경우
    if (ID > 0) {
        const QUERY1 = 'SELECT * FROM point_history WHERE userIdx = ?';
        let result1 = await pool.queryParam_Arr(QUERY1, ID);

        for(i = 0; i < result1.length; i++) {
            if(result1[i].songIdx != 1) {
                let result2 = await song.find({ _id : result1[i].songIdx });
                result1[i].song = result2;
            }   
        }

        res.status(200).send(responseUtil.successTrue(returnCode.OK, "포인트 내역 조회", result1));
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