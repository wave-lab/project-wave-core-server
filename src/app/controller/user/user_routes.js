const express = require('express');
const router = express.Router({mergeParams: true})

//signup
router.use('/user/signup', require('./signup'));

// signin
router.use('/user/signin', require('./signin'));

// email 유효성 , 중복 확인
router.use('/user/email-verify', require('./email-check'));

// nickname 중복 확인
router.use('/user/nickname-check', require('./nickname-check'));

// // 평가곡 개수
// router.use('/rate-count', require('./rate-count'));

// //적중곡 개수
// router.use('/hit-count', require('./hit-count'));

// //프로필 수정
// router.use('/edit-profile', require('/edit-profile'));

module.exports = router;