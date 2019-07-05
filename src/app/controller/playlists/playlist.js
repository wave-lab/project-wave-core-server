const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const db = require('../../module/pool');
const playlistSelect = require('../../module/playlistSelect')

const playlist = require('../../model/schema/playlist');//이렇게 해야 접근 가능

/*
playlist 조회
METHOD       : GET
URL          : /playlist/:playlistIdx
PARAMETER : playlistIdx = playlist테이블의 _id(idx)값
*/
router.get('/', async (req, res) => {
    const inputPlaylistIdx = req.params.playlistIdx;

    if(!inputPlaylistIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        const listSelectResult = await playlistSelect.listSelect(inputPlaylistIdx);

        if(!listSelectResult) {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.PLAYLIST_SELECT_FAIL));
        } else {
            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_SELECT_SUCCESS, listSelectResult));                        
        }

    }
})

module.exports = router;