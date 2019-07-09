const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const emailConfig = require('../../../config/emailConfig');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

//인증번호 값
const rand = Math.floor(Math.random() * 1000000)+100000;

//유효한 email인지 확인
router.post('/', async (req, res, next) => {
    const selectEmailQuery = 'SELECT email FROM user WHERE email = ?';
    const selectEmailResult = await pool.queryParam_Arr(selectEmailQuery, req.body.email);
    
    if(selectEmailResult[0] == null){
        console.log('이메일 일치 없음');
        
        const from = 'WAVE';
        const to = req.body.email;
        const subject = 'WAVE 회원가입 인증 메일입니다';
        const html = '<p>인증번호는 '+ rand + ' 입니다.\n 인증번호 창에 입력해주세요.';
    
        const mailOptions = {
            from,
            to,
            subject,
            html
        };
        
        const config = emailConfig.emailConfig;
        const transporter = nodemailer.createTransport(smtpPool({
            service: config.mailer.service,
            host: config.mailer.host,
            port: config.mailer.port,
            auth: {
                user: config.mailer.user,
                pass: config.mailer.password,
            },
            tls: {
                rejectUnauthorize: false,
            },
            maxConnections: 5,
            maxMessages: 10,
        }));
    
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                console.log('메일 전송 실패', err);
                res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.SEND_EMAIL_FAIL));
            } else {
                console.log('메일 전송 성공');
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SEND_EMAIL));
            }
            transporter.close();
        });
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.EMAIL_CHECK_SUCCESS));
    }else{
        console.log('중복 이메일 존재');
        res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.DUPLICATED_EMAIL_FAIL));
    }
});

//인증번호 확인
router.post('/authentication', async(req, res, next) =>{
    const user_rand = String(req.body.code);
    if(user_rand == rand){
        console.log('인증 성공');
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.AUTHENTICATION_SAME));
    }else{
        console.log('인증 실패');
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.AUTHENTICATION_FALSE));
    }
});

module.exports = router;