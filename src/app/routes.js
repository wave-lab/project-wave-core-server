// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

//user
router.use('/', require('./controller/user/user_routes'));

//mypage
router.use('/', require('./controller/myPage/myPage_routes'));

//song
router.use('/', require('./controller/songs/songs_routes'));

//search
router.use('/', require('./controller/search/search_routes'));

//health-check
router.use('/health-check', require('./controller/health'))

module.exports = router;