const express = require('express');
const router = express.Router({mergeParams: true});

// 마이페이지 조회, 수정
router.use('/myPage', require('./myPage'));

// 아티스트 페이지 조회
router.use('/myPage/artistPage', require('./artistPage'));

// 포인트 히스토리
router.use('/myPage/pointHistory', require('./pointHistory'));

module.exports = router;