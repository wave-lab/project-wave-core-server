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
const rand = Math.floor(Math.random() * 1000000) + 100000;

//유효한 email인지 확인
router.get('/', async (req, res, next) => {
    const selectEmailQuery = 'SELECT email FROM user WHERE email = ?';
    const selectEmailResult = await pool.queryParam_Arr(selectEmailQuery, [req.query.email]);
    if (selectEmailResult[0] == null) {
        
        const from = 'WAVE';
        const to = req.query.email;
        const subject = 'WAVE 회원가입 인증 메일입니다';
        const html = '<p>인증번호는 ' + rand + ' 입니다.\n 인증번호 창에 입력해주세요.';

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
                res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.SEND_EMAIL_FAIL));
            } else {
                res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SEND_EMAIL));
            }
            transporter.close();
        });
    } else {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.DUPLICATED_EMAIL_FAIL));
    }
});

module.exports = router;