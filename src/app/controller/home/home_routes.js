const express = require('express');
const router = express.Router({mergeParams: true});

// 마이페이지 조회, 수정
router.use('/home/homeUserInfo', require('./homeUserInfo'));

router.use('/home/homePlaylist', require('./homePlaylist'));

router.use('/home/top10', require('./top10List'));

module.exports = router;