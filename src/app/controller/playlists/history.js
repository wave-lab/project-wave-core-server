const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const playlistModules = require('../../module/playlistModules') //myPlaylist 조회 모듈

const pool = require('../../module/pool');

const song = require('../../model/schema/song');

//history 생성 후 테스트 해보기
/*
기본 history에 곡 추가
METHOD       : GET
URL          : /playlists/default/history/user/:userIdx/songs?songIdx={songIdx}
PARAMETER    : songIdx = song의 인덱스
userIdx = user의 인덱스
*/

router.get('/', async (req, res) => {
    const inputSongIdx = req.query.songIdx
    const inputUserIdx = req.params.userIdx
    console.log(inputSongIdx);
    //정욱오빠 모듈 갖다쓰기
    if(!inputSongIdx || !inputUserIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        const myPlaylist = await playlistModules.searchMyPlaylist(inputUserIdx);
        const inputPlaylistIdx = myPlaylist.history;

        const addHistory = await playlistModules.addSongToPlaylist(inputPlaylistIdx, inputSongIdx);

        if(!addHistory) {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.HISTORY_INSERT_FAIL));
        } else {
            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.HISTORY_INSERT_SUCCESS, addHistory));
        }
    }
})

module.exports = router;