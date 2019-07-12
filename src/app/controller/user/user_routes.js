const express = require('express');
const router = express.Router({mergeParams: true});

// email 유효성 , 중복 확인
router.use('/users/emailCheck', require('./emailCheck'));

// nickname 중복 확인
router.use('/users/nicknameCheck', require('./nicknameCheck'));

// signup
router.use('/signup', require('./signup'));

// signin
router.use('/signin', require('./signin'));

//originAritst
router.use('/originArtist', require('./getOriginArtist'));

module.exports = router;