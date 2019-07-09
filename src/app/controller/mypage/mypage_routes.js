const express = require('express');
const router = express.Router({mergeParams: true});

// 마이페이지 조회, 수정
router.use('/mypage', require('./mypage'));

// 아티스트 페이지 조회
router.use('/mypage/artistpage', require('./artistpage'));

module.exports = router;