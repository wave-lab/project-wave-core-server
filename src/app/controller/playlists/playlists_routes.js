const express = require('express');
const router = express.Router({mergeParams: true})

//기본history에 곡 추가
router.use('/default/history', require('./history')); 

//기본 history 조회
router.use('/default/history/user/:userIdx', require('./history'));

// playlist 추가/삭제
router.use('/manage', require('./playlistManage'));

// playlist 삭제
router.use('/manage/:playlistIdx/user/:userIdx', require('./playlistManage'));

// 곡 상태별 조회
router.use('/rated', require('./rated'));

//업로드 한 목록 조희
router.use('/upload', require('./upload'));

// //custom 플레이리스트
// router.use('/custom', require('./custom'));

// //top 10 목록 조회
router.use('/top10', require('./top10List'));

// myPlaylist 조회
router.use('/myPlaylist', require('./myPlaylist'));

//playlist에 담긴 song 추가, 삭제
// router.use('/:playlist_idx/songs/:songIdx', require('./managePlaylistSongs'));

// playlist의 곡 조회/추가/삭제
router.use('/songs', require('./playlist'));


//적중곡 조회
router.use('/hits', require('./hits'));

module.exports = router;