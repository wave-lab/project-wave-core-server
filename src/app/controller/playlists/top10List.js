const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')
const playlistModules = require('../../module/playlistModules') //플레이리스트 조회 모듈

const pool = require('../../module/pool');
const top10 = require('../../model/schema/top10');

/*
TOP30플레이리스트 조회
METHOD       : GET
URL          : /playlists/top10?genre = {genreName} or /playlist/top30?mood = {modeName}
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
                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.TOP10LIST_SELECT_FAIL));
                } else { 
                    //console.log(top10listResult[0]);
                    //console.log(top10listResult[0].playlistIdx);
                    inputPlaylistIdx = top10listResult[0].playlistIdx;
                    if(!inputPlaylistIdx) {
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
                    }
                    else {
                        const listSelectResult = await playlistModules.getSongList(top10listResult[0].playlistIdx)//플레이리스트 조회 모듈 사용

                        if(!listSelectResult) {
                            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.PLAYLIST_SELECT_FAIL));
                        } else {
                            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_SELECT_SUCCESS, listSelectResult));                        
                        }

                    }
                }
            }).sort({checkTime : -1}).limit(1);
        }
        else if(!inputGenreName) {
            top10.find({top10Name : inputMoodName}, async function(err, top10listResult) {
                if(err) {
                    console.log(err);
                    res.status(200).send(resUtil.successTrue(resCode.BAD_REQUEST, resMessage.TOP10_SELECT_SUCCESS, listSelectResult));
                } else { 
                    //console.log(top10listResult[0]);
                    //console.log(top10listResult[0].playlistIdx);
                    inputPlaylistIdx = top10List10listResult[0].playlistIdx;
                    if(!inputPlaylistIdx) {
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
                    }
                    else {
                        const listSelectResult = await playlistModules.getSongList(top10listResult[0].playlistIdx)  ;

                        if(!listSelectResult) {
                            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.PLAYLIST_SELECT_FAIL));
                        } else {
                            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_SELECT_SUCCESS, listSelectResult));                        
                        }

                    }
                }
            }).sort({checkTime : -1}).limit(1);
        }
        else {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
        }
    }
})

module.exports = router;