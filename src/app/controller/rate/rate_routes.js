// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//곡 평가
router.use('/songs/:songIdx/rate', require('./songRate'));

//사용자 평가한 곡 개수
router.use('/rateCount', require('./getUserRateCount'));

//내 포인트 내역 조회
router.use('/point-history', require('./getPointHistory'));

//평가한 곡 플레이리스트 조회
router.use('/test1', require('./getRatedPlaylist'));

//평가 대기곡 플레이리스트 조회
router.use('/test2', require('./getRateReadyPlaylist'));

module.exports = router;