// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//기본history에 곡 추가
router.use('default/history/user/:userIdx/songs?=songIdx{:songIdx}', require('./history'));

module.exports = router;