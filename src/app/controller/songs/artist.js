const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const pool = require('../../module/pool');

/*
아티스트 프로필 조회
METHOD       : GET
URL          : /songs/artist/:userIdx
PARAMETER : userIdx = 아티스트의 userIdx
*/
/*router.get('/', async (req, res) => {
    const artistUserIdx = req.params.userIdx;

    if(!artistUserIdx) {
       res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        const artistSelectQuery = 'SELECT userIdx, nickname, profileImg, backImg, rateSongCount, comment, uploadPassCount FROM user WHERE userIdx = (?)';
        const artistSelectResult = await pool.queryParam_Arr(artistSelectQuery, artistUserIdx);

        if(!artistSelectResult) {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ARTIST_SELECT_FAIL));
        }
        else {

            const data = {
                artistInfo : artistSelectResult
            }

            res.status(200).send(resUtil.successFalse(resCode.OK, resMessage.ARTIST_SELECT_SUCCESS, artistSelectResult));
        }
    }
})*/

module.exports = router;