const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt');
const upload = require('../../../config/multer');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const playlistModules = require('../../module/playlistModules');

router.get('/:userIdx', async (req, res) => {
    //ID = userIdx
    //const ID = jwt.verify(req.headers.authorization);
    const userIdx = req.params.userIdx;
    //회원일 경우
    // if (ID > 0) {
        const myPlaylistData = await playlistModules.searchMyPlaylist(userIdx);
        const uploadPlaylistIdx = myPlaylistData.uploadPlaylist;
        const uploadSongLists = await playlistModules.getSongList(uploadPlaylistIdx);
        if(!myPlaylistData || !uploadSongLists) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.GET_UPLOAD_LIST_FAIL));
        }
        else {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.GET_UPLOAD_LIST_SUCCESS, uploadSongLists));
        }
        
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