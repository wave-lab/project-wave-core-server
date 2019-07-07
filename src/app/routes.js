// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//playlists
router.use('/playlists', require('./controller/playlists/playlists_routes'));

//schedule
router.use('/', require('./controller/scheduler/scheduler'));

router.use('/', require('./controller/scheduler/rateReadyscheduler'));

//평가 대기곡 스케출러
router.use('/', require('./controller/scheduler/rateReadyscheduler'));

//song
router.use('/', require('./controller/songs/songs_routes'));

//user
router.use('/', require('./controller/user/user_routes'));

//search
router.use('/', require('./controller/search/search_routes'));

router.use('/test', require('./controller/default/default'));

router.use('/', require('./controller/rate/rate_routes'));

module.exports = router;