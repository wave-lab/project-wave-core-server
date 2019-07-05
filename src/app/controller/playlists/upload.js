const express = require('express');
const router = express.Router();
const moment = require('moment');

const jwt = require('../../module/jwt');
const upload = require('../../../config/multer');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');
const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');
const song = require('../../model/schema/song');
const playlist = require('../../model/schema/playlist');
const playlistModules = require('../../module/playlistModules');

router.get('/:userIdx', async (req, res) => {
    //ID = userIdx
    //const ID = jwt.verify(req.headers.authorization);
    const userIdx = req.params.userIdx;
    //회원일 경우
    // if (ID > 0) {
        const myPlaylistData = await playlistModules.searchMyPlaylist(userIdx);
        console.log(myPlaylistData);
        const uploadPlaylistIdx = myPlaylistData.uploadPlaylist;
        console.log(uploadPlaylistIdx);
        const uploadSongLists = await playlistModules.getSongList(uploadPlaylistIdx);
        console.log(uploadSongLists);

        
    // }
    // //비회원일 경우
    // else if (ID == -1) {

    // }
    // //토큰 검증 실패
    // else {
    //     res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    // }

})

module.exports = router;