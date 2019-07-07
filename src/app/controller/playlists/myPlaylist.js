const express = require('express');
const router = express.Router();
const moment = require('moment');

const jwt = require('../../module/jwt');
const upload = require('../../../config/multer');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const playlistModules = require('../../module/playlistModules');

/*
myPlaylist 조회 (= 아티스트의 플레이리스트 조회)
METHOD       : GET
URL          : /playlist/:userIdx
PARAMETER : userIdx = user Index(특정 사용자의 idx)
*/
router.get('/', async (req, res) => {
    const ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if(ID > 0) {
        const myPlaylist = await playlistModules.searchMyPlaylist(ID);
        console.log(myPlaylist)
        const customIdx = myPlaylist.customPlaylist;
        console.log(customIdx);
        console.log((await playlistModules.getSongList(customIdx)))
        const result = {
            "custom" : (await playlistModules.getSongList(myPlaylist.customPlaylist)),
            "history" : (await playlistModules.getSongList(myPlaylist.historyPlaylist)),
            "like" : (await playlistModules.getSongList(myPlaylist.likePlaylist))
        }
    }
    //비회원일 경우
    else if(ID == -1) {

    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

module.exports = router;