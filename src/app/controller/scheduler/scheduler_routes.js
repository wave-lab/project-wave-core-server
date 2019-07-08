const express = require('express');
const router = express.Router({mergeParams: true})

//top10 schedule
router.use('/', require('./top10scheduler'));

//적중곡 스케쥴러
router.use('/', require('./hitsScheduler'));

//평가 대기곡 스케출러
router.use('/', require('./rateReadyscheduler'));

//평가 곡 상태 업데이트 스케쥴러
router.use('/', require('./rateStatusScheduler'));

module.exports = router;