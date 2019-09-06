// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//곡 재생
//router.use('/songs/:songIdx/user/:userIdx', require('./play'));

// /songs/{songIdx}/like

//곡 좋아요 /좋아요 취소
router.use('/songs/:songIdx/like', require('./like'));

//곡 조회수
router.use('/songs/:songIdx/streaming', require('./streaming'));

//곡 업로드
router.use('/songs', require('./songUpload'));

//곡 평가
router.use('/songs/:songIdx/rate', require('./songRate'));

router.use('/songs/:songIdx', require('./getSong'));

module.exports = router;