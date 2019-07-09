// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//곡 재생
//router.use('/songs/:songIdx/user/:userIdx', require('./play'));

// /songs/{songIdx}/like

//곡 좋아요 취소
router.use('/songs/:songIdx/likes/user/:userIdx', require('./likes'));

//곡 좋아요
router.use('/songs/likes', require('./likes'));

//곡 조회수
router.use('/songs/streaming', require('./streaming'));

//곡 업로드
// /songs
router.use('/songs/upload', require('./songUpload'));

//아티스트 프로필 조회
// /users/{userIdx}
router.use('/artist/:userIdx', require('./artist'));

//추천곡 조회
// playlist로
router.use('/songs/recommend/:userIdx', require('./recommend'));

//곡 평가
router.use('/songs/:songIdx/rate', require('./songRate'));

module.exports = router;