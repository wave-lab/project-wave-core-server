const express = require('express');
const router = express.Router({ mergeParams: true })
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt');
const playlistModules = require('../../module/playlistModules');
const upload = require('../../../config/multer');
const song = require('../../model/schema/song');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const history = require('../../model/schema/history');

//아티스트 페이지 조회
router.get('/', async (req, res, next) => {
    const userIdx = req.params.userIdx;

    const selectUserQuery = 'SELECT comment, nickname, profileImg, backImg FROM user WHERE userIdx = ?';
    const selectUserResult = await pool.queryParam_Arr(selectUserQuery, userIdx);

    if(selectUserResult.length != 0) {
        const userInfo = selectUserResult[0]; // user의 모든 정보
    
        const allSong = await song.find({ userIdx: userIdx });
        let count = 0;
    
        for (i = 0; i < allSong.length; i++) {
            if (allSong[i].songStatus == 1) {
                count += allSong[i].likeCount;
            }
        }
    
        userInfo.allSongLikeCount = count;
    
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.MYPAGE_SUCCESS, userInfo));
    }else {
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, "사용자를 찾을수 없습니다."));
    }
});

module.exports = router;