// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//schedule
router.use('/', require('./controller/scheduler/scheduler'));

//적중곡 스케쥴러
router.use('/', require('./controller/scheduler/hitsScheduler'));

//평가 대기곡 스케출러
router.use('/', require('./controller/scheduler/rateReadyscheduler'));

//평가 곡 상태 업데이트 스케쥴러
router.use('/', require('./controller/scheduler/rateStatusScheduler'));

//스케줄러 routes 필요

//playlists
router.use('/playlists', require('./controller/playlists/playlists_routes'));

//song
router.use('/', require('./controller/songs/songs_routes'));

//user
router.use('/', require('./controller/user/user_routes'));

//search
router.use('/', require('./controller/search/search_routes'));

module.exports = router;