const express = require('express');
const router = express.Router({mergeParams: true});

// signup
router.use('/user/signup', require('./signup'));

// signin
router.use('/user/signin', require('./signin'));

// kakao signin
router.use('/user/kakao-login', require('./kakao-login'));

// email 유효성 , 중복 확인
router.use('/user/email-check', require('./email-check'));

// nickname 중복 확인
router.use('/user/nickname-check', require('./nickname-check'));

// originArtist 추가
router.use('/user/add-originArtist', require('./add-originArtist'));

//사용자 평가한 곡 개수
router.use('/rate-count', require('./getUserRateCount'));

//내 포인트 내역 조회
router.use('/point-history', require('./getPointHistory'));

// // 평가곡 개수
// router.use('/rate-count', require('./rate-count'));

// //적중곡 개수
// router.use('/hit-count', require('./hit-count'));

// //프로필 수정
// router.use('/edit-profile', require('/edit-profile'));

module.exports = router;