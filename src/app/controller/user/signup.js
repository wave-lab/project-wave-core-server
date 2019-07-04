const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const hash = require('../../../config/hashKey');
//var smtpTransport = require('nodemailer-smtp-transport');

const crypto = require('crypto-promise');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

//인증번호 값
const rand = Math.floor(Math.random() * 1000000)+100000;
//salt 값
const hashKey = hash.key;

//회원가입 
router.post('/', async (req, res, next) => {

    const QUERY = 'insert into USER set ?';
    let newUser = signup.new(req.body);
    let inserted = await db.execute2(QUERY, newUser);

    if (inserted == undefined) {
        res.status(405).send({
            message: 'please check email'
        });
    } else {
        await myIntro.create({
            user_idx: inserted.insertId,
            intro_contents: "",
            intro_img_url: []
        });
        res.status(201).send({
            message: "success"
        });
    }
});

//회원가입
router.post('/', async (req, res, next) => {
    const selectEmailQuery = 'SELECT nickname FROM user WHERE nickname = ?'
    const selectEmailResult = await db.queryParam_Arr(selectEmailQuery, req.body.nickname);
    const signupQuery = 'INSERT INTO user (email, password, nickname, profileImg, comment) VALUES (?, ?, ?, ?, ?)';

    if (selectEmailResult[0] == null) { // 해당 이메일로 가입한 유저가 없을 시
        console.log("일치 없음");
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        const hashedPw = await crypto.pbkdf2(req.body.user_pw.toString(), salt, 1000, 32, 'SHA512');

        const signupResult = await db.queryParam_Arr(signupQuery, [req.body.user_id, req.body.user_name, hashedPw.toString('base64'), salt]);
        if (!signupResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.SIGNUP_FAIL));
        } else { //쿼리문이 성공했을 때
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
        }
    } else {// 이미 존재
        console.log("이미 존재");
        res.status(200).send(responseUtil.successFalse(returnCode.OK, returnMessage.DUPLICATED_ID_FAIL));
    }

});

//유효한 email인지 확인
router.get('/email-verify', async (req, res, next) => {

    const selectEmailQuery = 'SELECT email FROM user WHERE email = ?';
    const selectEmailResult = await db.queryParam_Arr(selectEmailQuery, req.body.email);
    
    if(selectEmailResult[0] == null){
        console.log('이메일 일치 없음');
        //const hashedPw = await crypto.pbkdf2(req.body.password.toString(), salt, 1000, 32, 'SHA512');
        const config = {
            mailer: {
                service: 'Gmail',
                host: 'localhost',
                port: '465',
                user: 'jinee071732@gmail.com',
                password: 'k1207417',
            }
        };
        
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
    
        transporter.sendMail(mailOptions, (err, res) => {
            if (err) {
                console.log('failed... => ', err);
            } else {
                console.log('succeed... => ', res, rand);
            }
            transporter.close();
        });
    }else{
        console.log('중복 이메일 존재');
        res.status(200).send(defaultRes.successFalse(returnCode.DB_ERROR, resMessage.SIGNUP_FAIL));
    }
});

//인증번호 확인
router.get('/authentication', async(req, res, next) =>{
    const user_rand = String(req.body.authentication);
    if(user_rand == rand){
        console.log('인증 성공');
    }else{
        console.log('인증 실패');
    }
});

module.exports = router;
