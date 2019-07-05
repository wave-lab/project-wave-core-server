const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');
const hash = require('../../module/hash.js').key;

router.post('/', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const fcm_token = req.body.fcm_token;
    
    const getUserQuery = 'select * from user where email = ?';
    let data = await pool.queryParam_Arr(getUserQuery, email);

    const updateFcm = 'update user set fcm_token = ? where email = ?';
    let fcm = await pool.queryParam_Arr(updateFcm,[fcm_token,email]);

    //아이디가 존재하지 않을 경우
    if (data.length == 0) {
        res.status(401).send({
            message: 'wrong email'
        });
    }
    
    //비밀번호가 틀릴 경우
    else if (password != hash.decoding(data[0].password)) {
        res.status(401).send({
            message: 'wrong password'
        });
    } else {
        const token = jwt.sign(data[0].user_idx);

        res.status(200).send({
            message: 'login success',
            token: token
        });
    }
});

module.exports = router;