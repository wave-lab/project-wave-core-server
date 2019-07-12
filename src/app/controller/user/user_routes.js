const express = require('express');
const router = express.Router({mergeParams: true});

// email 유효성 , 중복 확인
router.use('/users/emailCheck', require('./emailCheck'));

// nickname 중복 확인
router.use('/users/nicknameCheck', require('./nicknameCheck'));

// signup
router.use('/user/signup', require('./signup'));

// signin
router.use('/user/signin', require('./signin'));

//originAritst
router.use('/originArtist', require('./getOriginArtist'));

// kakao signin
// router.use('/user/kakaoSignin', require('./kakaoSignin'));

module.exports = router;