const express = require('express');
const router = express.Router({mergeParams: true});

// signup
router.use('/user/signup', require('./signup'));

// email 유효성 , 중복 확인
router.use('/user/emailCheck', require('./emailCheck'));

// nickname 중복 확인
router.use('/user/nicknameCheck', require('./nicknameCheck'));

// signin
router.use('/user/signin', require('./signin'));

// kakao signin
router.use('/user/kakaoSignin', require('./kakaoSignin'));

module.exports = router;