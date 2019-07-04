const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
//const myIntro = require('../../model/schema/myIntro');

// 이메일 중복 체크

router.get('/check', async (req, res, next) => {
    const email = req.query.email;
    const QUERY = 'select * from USER where email = ?';

    let checkResult = await db.execute2(QUERY, email);

    if (checkResult) {
        if (checkResult.length === 1) {
            res.status(405).send({
                message: "Already Exists"
            });
        } else {
            res.status(200).send({
                message: "success"
            });
        }
    }
});

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

module.exports = router;
