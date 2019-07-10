const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const pool = require('../../module/pool');

const song = require('../../model/schema/song');

/*
추천곡 조회
METHOD       : GET
URL          : /songs/recommend/:userIdx
PARAMETER    : userIdx = user의 인덱스
*/
router.get('/', async (req, res) => {
    const inputUserIdx = req.params.userIdx;
    var result = new Array();

    if(!inputUserIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        const artistSelectQuery = 'SELECT originArtistIdx FROM user_originArtist WHERE userIdx = (?)';
        const artistSelectResult = await pool.queryParam_Arr(artistSelectQuery, inputUserIdx);

        //console.log(1);
        //console.log(artistSelectResult);

        if(!artistSelectResult) {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ARTIST_SELECT_FAIL));
        }
        else {
            //console.log(artistSelectResult);
            //console.log(artistSelectResult[0].originArtistIdx);
            for(let i = 0; i < artistSelectResult.length; i++) {
                await song.find({originArtistIdx : artistSelectResult[i].originArtistIdx}, async function(err, songResult) {
                    if(err) {
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.RECOMMEND_SELECT_FAIL));
                    } else {
                        //console.log(songResult)
                        result[i] = songResult;
                    }
                }).sort({streamCount : -1}).limit(30);;
            }

            if(!result) {
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.RECOMMEND_SELECT_FAIL));
            } else {
                res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.RECOMMEND_SELECT_SUCCESS, result));
            }
        }
    }
})

module.exports = router;