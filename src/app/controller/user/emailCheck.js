const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const emailConfig = require('../../../config/emailConfig');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

//유효한 email인지 확인
router.post('/', async (req, res, next) => {
    const selectEmailQuery = 'SELECT email FROM user WHERE email = ?';
    const selectEmailResult = await pool.queryParam_Arr(selectEmailQuery, [req.body.email]);

    //인증번호 값
    let rand = Math.floor(Math.random() * 1000000) + 100000;
    if (selectEmailResult[0] == null) {
        
        const from = 'WAVE';
        const to = req.body.email;
        const subject = 'WAVE 회원가입 인증 메일입니다';
        const html = '<head><title>mail</title><style>*{font-family: sans-serif;}.body{margin: 5% 0 10% 0;text-align: center;}.title_text{font-size: 26px;}.subtitle_text{font-size: 20px; margin-top: 30px;}.underline{text-decoration: underline;}.body_sub{text-align: left;}.helptext{font-size: 10px; padding: 15px;}.last_text{font-size: 10px; margin-top: -15px;}</style></head><body><div class="body"><div class="body_sub"><br><h1 class="title_text">[WAVE] 회원가입을 진심으로 환영합니다!</h1><img style="width:700px" class="thumbnail" src="https://cmail.daum.net/v2/mails/000000000000680/attachments/MjoxLjI6MTMzMDo1MjA4MjppbWFnZS9wbmc6YmFzZTY0OlprbjluY1FNV0c4RVZZTkJuejV3SFE/raw/thumbnail_1.png" alt="thumbnail"/><h2 class="subtitle_text">안녕하세요!<br>본 메일은 커버뮤직 스트리밍 서비스 WAVE 회원가입을 위한 인증 메일입니다.</h2><h2 class="subtitle_text underline">회원님의 인증번호는 '+ rand +' 입니다.</h2><h2 class="subtitle_text">5분 안에 인증번호를 입력하여 회원가입을 계속 진행해주세요:) </h2><p class="last_text">만약 인증 메일을 요청하신 적이 없다면 본 메일을 삭제해주시기 바랍니다.</p><h5 class="">이제 WAVE와 함께 다양한 커버 뮤직을 만나보세요! 감사합니다  : )--></h5></div></div></body>';

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
                console.log(err);
                res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.SEND_EMAIL_FAIL));
            } else {
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SEND_EMAIL, rand));
            }
            transporter.close();
        });
    } else {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.DUPLICATED_EMAIL_FAIL));
    }
});

module.exports = router;
