// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//곡 재생
//router.use('/songs/:songIdx/user/:userIdx', require('./play'));

//곡 좋아요/좋아요 취소
router.use('/songs/:songIdx/likes', require('./likes'));

//곡 업로드
router.use('/songUpload', require('./songUpload'));

//아티스트 프로필 조회
router.use('/artist/:userIdx', require('./artist'));

//추천곡 조회
router.use('/songs/recommend/:userIdx', require('./recommend'));

module.exports = router;