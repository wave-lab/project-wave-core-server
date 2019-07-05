const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const pool = require('../../module/pool');

/*
플레이리스트 추가
METHOD       : POST
URL          : /playlist/manage/:playlistIdx
BODY         : {
    "playlistName" : "플레이리스트 이름",
    "playlistComment" : "플레이스트 설명",
    "userIdx" : "소유자 고유 ID",
}
*/
router.post('/', async (req, res) => {
    const inputName = req.body.playlistName;
    const inputComment = req.body.playlistComment;
    const inputUserIdx = req.body.userIdx;

    if(!inputName || !inputUserIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        await playlist.create({
            playlistName : inputName,
            playlistComment : inputComment,
            userIdx : inputUserIdx
        }, async function(err, createResult) {
            if(err) {
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.PLAYLIST_CREATE_FAIL));
                console.log(err);
            } else {
                //나의플레이리스트조회 모듈 사용해서 myplaylist의 custom배열에 추가한 playlist _id push해주기
                
               res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_CREATE_SUCCESS, createResult));
                //console.log(docs);
            }
        })
    }
})

/*
플레이리스트 삭제
METHOD       : DELETE
URL          : /playlist/manage/:playlistIdx
PARAMETER    : playlistIdx = 삭제 요청한 플레이리스트의 인덱스
*/
router.delete('/', async (req, res) => {
    const inputPlaylistIdx = req.params.playlistIdx;

    if(!inputPlaylistIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        await myPlaylist.remove({playlistIdx : inputPlaylistIdx}, async function(err, removeResult) {
            if(err) {
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.PLAYLIST_CREATE_FAIL));
                console.log(err);
            } else {
               res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_CREATE_SUCCESS, removeResult));
                //console.log(docs);
            }
        })
    }
})

module.exports = router;