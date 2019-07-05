// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//곡 평가
router.use('/songs/:songIdx/rate', require('./songRate'));

//사용자 평가한 곡 개수
router.use('/rateCount', require('./getUserRateCount'));

module.exports = router;