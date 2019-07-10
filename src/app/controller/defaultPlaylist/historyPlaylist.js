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
기본 history에 곡 추가
METHOD       : POST
URL          : /playlists/default/history
BODY         : songIdx = song의 인덱스
               userIdx = user의 인덱스
*/

router.post('/', async (req, res) => {
    const inputSongIdx = req.body.songIdx
    const inputUserIdx = req.body.userIdx
    //let mNow = new Date();

    console.log(inputSongIdx);
    if(!inputSongIdx || !inputUserIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        const songResult = await song.find({_id: inputSongIdx});
        if(songResult.length == 0) {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.SONG_SELECT_FAIL));
        } else {
            const historyResult = await history.find({$and : [{"userIdx" : inputUserIdx}, {"songIdx" : inputSongIdx}]});
            if(historyResult.length == 0) {
                await history.create({
                    userIdx : inputUserIdx,
                    songIdx : inputSongIdx,
                    songInfo : songResult,
                    playCount : 1,
                    playTime : timeFormat
                }, async function(err, insertResult) {
                    if(err) {
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.HISTORY_INSERT_FAIL));
                    } else {
                        res.status(200).send(resUtil.successTrue(resCode.BAD_REQUEST, resMessage.HISTORY_INSERT_SUCCESS, insertResult));
                    }
                })
            } else {    
                await history.updateOne({$and : [{"userIdx" : inputUserIdx}, {"songIdx" : inputSongIdx}]}, {$set : {"playCount" : historyResult[0].playCount + 1}});
                await history.updateOne({$and : [{"userIdx" : inputUserIdx}, {"songIdx" : inputSongIdx}]}, {$set : {"playTime" : timeFormat}});
                
                res.status(200).send(resUtil.successTrue(resCode.CREATED, resMessage.CUSTOM_CREATE_SUCCESS));
            }
            
        }
    }
})

/*
history 조회
METHOD       : GET
URL          : /playlists/default/history/user/:userIdx
PARAMETER    : userIdx = user의 인덱스
*/
router.get('/', async (req, res) => {
    const inputUserIdx = req.params.userIdx

    if(!inputUserIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        const historySelect = await history.find({userIdx : inputUserIdx}).sort({playTime : -1}).limit(100);
        console.log(historySelect[0]);
        res.status(200).send(resUtil.successTrue(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE, historySelect));
    }
})

module.exports = router;