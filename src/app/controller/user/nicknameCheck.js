const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

//nickname 중복 체크
router.get('/', async (req, res, next) => {
    const selectNicknameQuery = 'SELECT nickname FROM user WHERE nickname = ?';
    const selectNicknameResult = await pool.queryParam_Arr(selectNicknameQuery, [req.query.nickname]);
    
    if(selectNicknameResult[0] == null){ // 닉네임 중복이 없을 때
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.NICKNAME_CHECK_SUCCESS));
    }else{ // 닉네임이 중복될 때
        res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.DUPLICATED_NICKNAME_FAIL));
    }
});

module.exports = router;