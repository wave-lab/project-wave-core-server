const express = require('express');
const router = express.Router({mergeParams: true});

// playlist의 곡 조회/추가/삭제
router.use('/custom/songs', require('./playlist'));

// playlist 자체를 추가/삭제
router.use('/custom/manage', require('./playlistManage'));

// playlist 삭제
router.use('/manage/:playlistIdx/user/:userIdx', require('./playlistManage'));

// 보관함의 플레이리스트 탭 클릭시 history+custom 플레이리스트 조회 
router.use('/custom/myPlaylist', require('./myPlaylist'));

module.exports = router;