const express = require('express');
const router = express.Router();

const responseUtil = require('../../module/responseUtil')
const returnCode = require('../../model/returnCode')
const returnMessage = require('../../../config/returnMessage')
const playlistModules = require('../../module/playlistModules');

/*
playlist 조회
METHOD       : GET
URL          : /playlists?playlistIdx={playlistIdx}
QUERYSTRING : playlistIdx = playlist테이블의 _id(idx)값
*/
router.get('/', async (req, res) => {
    const inputPlaylistIdx = req.query.playlistIdx;
    console.log(inputPlaylistIdx);
    if(!inputPlaylistIdx) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.OUT_OF_VALUE));
    }
    else {
        const getSongListResult = await playlistModules.getSongList(inputPlaylistIdx);
        if(getSongListResult == undefined) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.PLAYLIST_SELECT_FAIL));
        } else {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.PLAYLIST_SELECT_SUCCESS, getSongListResult));                        
        }
    }
})

/*
playlist 에 노래 추가
METHOD       : POST
URL          : /playlists/songs
BODY         : playlistIdx, songIdx
*/
router.post('/', async(req,res)=>{
    const songIdx = req.body.songIdx;
    const playlistIdx = req.body.playlistIdx;   
    if(!songIdx || !playlistIdx) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.ADD_SONGS_TO_PLAYLIST_FAIL))
    }
    else {
        await playlistModules.addSongToPlaylist(playlistIdx, songIdx)
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.ADD_SONGS_TO_PLAYLIST_SUCCESS));
    }
})

/*
playlist 에서 노래 삭제
METHOD       : DELETE
URL          : /playlists/songs
BODY         : playlistIdx, songIdx
*/

router.delete('/', async (req,res)=>{
    const songIdx = req.body.songIdx;
    const playlistIdx = req.body.playlistIdx;
        
    if(!songIdx || !playlistIdx) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.DELETE_SONGS_FROM_PLAYLIST_FAIL))
    }
    else {
        await playlistModules.deleteSongFromPlaylist(playlistIdx,songIdx);
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.DELETE_SONGS_FROM_PLAYLIST_SUCCESS));
    }
})

module.exports = router;