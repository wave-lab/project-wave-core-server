const express = require('express');
const router = express.Router({mergeParams: true});

//기본 history에 곡 추가
router.use('/default/history', require('./historyPlaylist')); 
//기본 history에서 곡 조회
router.use('/default/history/user/:userIdx', require('./historyPlaylist'));

//평가한 곡 플레이리스트 조회
router.use('/default/rated', require('./ratedPlaylist'));

//평가 대기곡 플레이리스트 조회
router.use('/default/rateReady', require('./rateReadyPlaylist'));

//좋아요한 곡 플레이리스트 조회
router.use('/default/like/user/:userIdx', require('./likePlaylist'));

//추천곡 조회
router.use('/default/recommend/:userIdx', require('./recommendPlaylist'));

module.exports = router;