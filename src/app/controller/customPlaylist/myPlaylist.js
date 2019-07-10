const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const playlistModules = require('../../module/playlistModules');
const pool = require('../../module/pool');
const playlist = require('../../model/schema/playlist');
//myPlaylist 조회
router.get('/', async (req, res) => {
    const ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        const myPlaylist = await playlistModules.searchMyPlaylist(ID);
        const customArray = myPlaylist.customPlaylist;
        const customArtworksArray = new Array();
        let songList = new Array();
        for(var i = 0; i < customArray.length ; i++) {
            songList[i] = await playlistModules.getSongList(customArray[i]);
            customArtworksArray[i] = new Array();
            for(var j = 0; j < 4 ; j++) {
                customArtworksArray[i][j] =(songList[i][j]).artwork;
            }
        }
        
        const result = {
            "custom": {
                customArray : customArray,
                thumbnail : customArtworksArray
            }
        }
        res.status(200).send(responseUtil.successTrue(returnCode.OK, "myPlaylist 조회 성공", result))
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, "NO AUTHORIZATION"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})


module.exports = router;