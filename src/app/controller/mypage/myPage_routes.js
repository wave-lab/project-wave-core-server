const express = require('express');
const router = express.Router({mergeParams: true});

// 마이페이지 조회, 수정
router.use('/users', require('./myPage'));

// 아티스트 페이지 조회
router.use('/users/:userIdx', require('./getArtist'));

//아티스트가 업로드 한 곡 조회
router.use('/users/:userIdx/pl/upload', require('./getArtistUpload'));

//아티스트가 좋아요 한 곡 조회
router.use('/users/:userIdx/pl/likes', require('./getArtistLikes'));

//아티스트의 커스텀 플레이리스트 조회
router.use('/users/:userIdx/pl/custom', require('./getArtistCustom'));

// 아티스트 페이지 조회
//router.use('/myPage/artistPage', require('./artistPage'));

// 포인트 히스토리
router.use('/myPage/pointHistory', require('./pointHistory'));

module.exports = router;
