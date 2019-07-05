const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');
const hash = require('../../module/hash');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

router.post('/', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const selectUserQuery = 'SELECT * FROM user WHERE email=?'
    const selectUserResult = await pool.queryParam_Arr(selectUserQuery, email);
    console.log(selectUserResult);

    if (selectUserResult[0] == null) {//id가 존재하지 않으면
        console.log("id가 존재하지 않음");
        res.status(200).send(responseUtil.successFalse(statusCode.DB_ERROR, resMessage.NOT_CORRECT_USERINFO));
    } else { //db에 입력받은 id가 존재
        if (password == hash.decoding(selectUserResult[0].password)){ //password 일치
            const token = jwt.sign(selectUserResult[0].user_idx);
            console.log('비밀번호 일치', token);
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SIGNIN_SUCCESS, token));
        } else { // password 불일치
            console.log('비밀번호 불일치');
            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.NOT_CORRECT_USERINFO));
        }
    }
});

module.exports = router;