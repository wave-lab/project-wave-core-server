const express = require('express');
const router = express.Router({mergeParams: true});
const moment = require('moment');

const timeFormat = moment().add(9, 'hours').format('YYYY-MM-DD HH:mm:ss');
const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const playlistModules = require('../../module/playlistModules') //myPlaylist 조회 모듈

const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const history = require('../../model/schema/history');


/*
like플레이리스트 조회
METHOD       : GET
URL          : /playlists/default/likes/user/:userIdx
PARAMETER    : userIdx = user의 인덱스 => 토큰으로 바꾸기
*/
router.get('/', async (req, res) => {
    const inputUserIdx = req.params.userIdx

    if(!inputUserIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.LIKE_PLAYLIST_SELECT_FAIL));
    }
    else {
        const likeSelect = await playlistModules.getPlayList(inputUserIdx, 'like');
        res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.LIKE_PLAYLIST_SELECT_SUCCESS, likeSelect));
    }
})

module.exports = router;