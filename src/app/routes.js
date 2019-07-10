// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//user
router.use('/', require('./controller/user/user_routes'));

//mypage
router.use('/', require('./controller/myPage/myPage_routes'));

//home
router.use('/', require('./controller/home/home_routes'));

//schedule
router.use('/', require('./controller/scheduler/scheduler_routes'));

//default playlist
router.use('/', require('./controller/defaultPlaylist/defaultPlaylist_routes'));

//custom playlist
router.use('/', require('./controller/customPlaylist/customPlaylist_routes'));

//song
router.use('/', require('./controller/songs/songs_routes'));

//search
router.use('/', require('./controller/search/search_routes'));

//health-chekc
router.use('/', require('./controller/health'))

module.exports = router;