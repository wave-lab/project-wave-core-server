const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const pool = require('../../module/pool')

const song = require('../../model/schema/song')

/*
곡 스트리밍 수
METHOD       : POST
URL          : /songs/streaming/:songIdx
PARAMETER    : songIdx = song의 _id
*/
router.post('/', async (req, res) => {
    const inputSongIdx = req.body.songIdx;

    const songInfo = await song.find({"_id" : inputSongIdx});
    await song.updateOne({"_id" : inputSongIdx}, {$set : {"streamCount" : songInfo[0].streamCount + 1}}, async function(err, streamResult) {
        if(err) {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.STREAM_COUNT_UPDATE_FAIL));
        } else {
            res.status(200).send(resUtil.successTrue(resCode.NO_CONTENT, resMessage.STREAM_COUNT_UPDATE_SUCCESS));
        }
    });
})

module.exports = router;