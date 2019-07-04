const express = require('express');
const router = express.Router({mergeParams: true})

//signup
router.use('/signup', require('./signup'));

// signin
router.use('/signin', require('./signin'));

// //email 인증
// router.use('/email-verify', require('./email-verify'));

// // 평가곡 개수
// router.use('/rate-count', require('./rate-count'));

// //적중곡 개수
// router.use('/hit-count', require('./hit-count'));

// //프로필 수정
// router.use('/edit-profile', require('/edit-profile'));

module.exports = router;