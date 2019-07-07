const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const playlistModules = require('../../module/playlistModules');

router.get('/', async (req, res) => {
    var checkHits = schedule.scheduleJob('0/5 * * * * *', async function() {
        console.log('적중곡 판별 스케쥴러 실행');
        const ID = await jwt.verify(req.headers.authorization);
        const myPlaylistIdx = await playlistModules.searchMyPlaylist(ID);
        console.log(myPlaylistIdx);
        const ratedSongs = await playlistModules.getSongList(myPlaylistIdx.ratedPlaylist);
        console.log(ratedSongs);
    })
    const ID = await jwt.verify(req.headers.authorization);
    console.log(ID);
    //const userIdx = req.params.userIdx;
    //회원일 경우
    if (ID > 0) {
        const myPlaylistData = await playlistModules.searchMyPlaylist(ID);
        console.log(myPlaylistData);
        const hitsPlaylistIdx = myPlaylistData.hitsPlaylist;
        const hitsSongList = await playlistModules.getSongList(hitsPlaylistIdx);
        console.log(hitsSongList);
        if(!hitsPlaylistIdx) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.GET_HITS_LIST_FAIL));
        }
        else {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.GET_HITS_LIST_SUCCESS, hitsSongList ));
        }
        
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.NO_AUTHORIZATION));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }

})

module.exports = router;