// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//곡 재생
router.use('/songs/:songIdx', require('./getSong'));

// /songs/{songIdx}/like

//곡 좋아요 취소
router.use('/songs/:songIdx/like/user/:userIdx', require('./like'));

//곡 좋아요
router.use('/songs/like', require('./like'));

//곡 업로드
router.use('/songs', require('./songUpload'));

//곡 평가
router.use('/songs/:songIdx/rate', require('./songRate'));

module.exports = router;