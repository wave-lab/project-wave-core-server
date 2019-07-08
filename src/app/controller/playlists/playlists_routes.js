const express = require('express');
const router = express.Router({mergeParams: true})

// playlist 추가/삭제
router.use('/manage', require('./playlistManage'));

// playlist 삭제
router.use('/manage/:playlistIdx/user/:userIdx', require('./playlistManage'));

// //top 10 목록 조회
router.use('/top10', require('./top10List'));

// myPlaylist 조회
router.use('/myPlaylist', require('./myPlaylist'));

// playlist의 곡 조회/추가/삭제
router.use('/songs', require('./playlist'));


module.exports = router;