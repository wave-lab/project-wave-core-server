const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const playlistModules = require('../../module/playlistModules') //myPlaylist 조회 모듈
const pool = require('../../module/pool');

const playlist = require('../../model/schema/playlist');
const myPlaylist = require('../../model/schema/myPlaylist');
/*
플레이리스트 추가
METHOD       : POST
URL          : /playlists/manage
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

    const playlistSelect = await playlist.find({$and : [{"userIdx" : inputUserIdx}, {"playlistName" : inputName}]});
    if(playlistSelect.length != 0) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_CUSTOM_PLAYLIST));
    } else {
        await playlist.create({
            playlistName : inputName,
            playlistComment : inputComment,
            userIdx : inputUserIdx
        }, async function(err, playlistResult){
            if(err) {
                console.log(err);
            }
            else {    
                const myListResult = (await myPlaylist.find({"userIdx" : inputUserIdx}))[0];
                const myCustom = myListResult.customPlaylist
                const addPlaylist = playlistResult._id;
    
                await myCustom.push(addPlaylist);
                await myPlaylist.updateOne({"_id" : myListResult._id}, {$set : {"customPlaylist" : myCustom}});
    
                const addCustomResult = (await myPlaylist.find({"userIdx" : inputUserIdx}));
                res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.CUSTOM_CREATE_SUCCESS, addCustomResult[0]));
            }
        })
    }
});


/*
플레이리스트 삭제
METHOD       : DELETE
URL          : /playlists/manage/:playlistIdx/user/:userIdx
PARAMETER    : playlistIdx = 삭제 요청한 플레이리스트의 인덱스
*/
router.delete('/', async (req, res) => {
    const inputPlaylistIdx = req.params.playlistIdx;
    const inputUserIdx = req.params.userIdx;
    console.log(inputPlaylistIdx);

    if(!inputPlaylistIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        const playlistSelect = await playlist.find({$and : [{"userIdx" : inputUserIdx}, {"_id" : inputPlaylistIdx}]});
        if(playlistSelect.length == 0) {
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.NOT_EXIST_CUSTOM_PLAYLIST));
        }
        else {
            const getMyPlaylist = (await myPlaylist.find({"userIdx" : inputUserIdx}))[0];
            console.log(getMyPlaylist);
            const myCustom = getMyPlaylist.customPlaylist

            await myCustom.pull(inputPlaylistIdx);
            await myPlaylist.updateOne({"_id" : getMyPlaylist._id}, {$set : {"customPlaylist" : myCustom}});

            await playlist.deleteOne({"_id" : inputPlaylistIdx});

            const deleteCustomResult = (await myPlaylist.find({"userIdx" : inputUserIdx}))[0];
            console.log(deleteCustomResult);
            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.PLAYLIST_DELETE_SUCCESS, deleteCustomResult));
        }
    }
});

module.exports = router;