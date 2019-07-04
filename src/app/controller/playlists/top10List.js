const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const playlist = require('../../model/schema/playlist');//이렇게 해야 접근 가능
const top10 = require('../../model/schema/top10');

/*
TOP30플레이리스트 조회
METHOD       : GET
URL          : /playlist/top10?genre = {genreName} or /playlist/top30?mood = {modeName}
*/
router.get('/', async (req, res) => {
    const inputGenreName = req.query.genre;
    const inputMoodName = req.query.mood;

    if(!inputGenreName && !inputMoodName) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        if(!inputMoodName) {
            top10.find({top10Name : inputGenreName}, async function(err, top10listResult) {
                if(err) {
                    console.log(err);
                    //res.status(200).send(resUtil.successFalse(resCode.NOT_FOUND, resMessage.))
                } else { 
                    console.log(top10listResult[0]);
                    console.log(top10listResult[0].playlistIdx);
                    playlist.find({_id : top10listResult[0].playlistIdx}, async function(err, listSelectResult) {
                        if(err) {
                            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.TOP10_SELECT_FAIL));
                            //console.log(err);
                        } else {
                            console.log(listSelectResult);
                            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.TOP10_SELECT_SUCCESS, listSelectResult));
                        }
                    })
                }
            }).sort({checkTime : -1}).limit(1);
        }
        else if(!inputGenreName) {
            top10.find({top10Name : inputMoodName}, async function(err, top10listResult) {
                if(err) {
                    console.log(err);
                } else { 
                    console.log(top10listResult[0]);
                    console.log(top10listResult[0].playlistIdx);
                    playlist.find({_id : top10listResult[0].playlistIdx}, async function(err, listSelectResult) {
                        if(err) {
                            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.TOP10_SELECT_FAIL));
                            //console.log(err);
                        } else {
                            console.log(listSelectResult);
                            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.TOP10_SELECT_SUCCESS, listSelectResult));
                        }
                    })
                }
            }).sort({checkTime : -1}).limit(1);
        }
    }
})

module.exports = router;