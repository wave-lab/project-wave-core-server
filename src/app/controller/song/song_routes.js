// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//곡 재생
router.use('/songs/:songIdx', require('./play'));

//곡 좋아요/좋아요 취소
router.use('/songs/:songIdx/likes', require('./likes'));

//곡 업로드
router.use('/songUpload', require('./songUpload'));

module.exports = router;