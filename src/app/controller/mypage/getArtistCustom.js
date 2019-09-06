const express = require('express');
const router = express.Router({ mergeParams: true });

const returnCode = require('../../model/returnCode');
const responseUtil = require('../../module/responseUtil');
const playlist = require('../../model/schema/playlist');
const myPlaylist = require('../../model/schema/myPlaylist');
const playlistModules = require('../../module/playlistModules');

//아티스트가 좋아요 한 곡 조회
//해당 유저의 업로드 곡 조회 중에 pass한 곡, songStatus = 1
router.get('/', async (req, res, next) => {

    const userIdx = req.params.userIdx;
    const myPlaylist = await playlistModules.searchMyPlaylist(userIdx);
   
    if (myPlaylist != undefined) {
        const customArray = myPlaylist.customPlaylist;
        let result = new Array();
    
        for (let i = 0; i < customArray.length; i++) {
            let result1 = (await playlist.find({ _id: customArray[i] }))[0];
            let songList = await playlistModules.getSongList(customArray[i]);
            let thumbnail = new Array();
    
            for (j = 0; j < songList.length; j++) {
                thumbnail.push(songList[j].artwork);
            }
            let data = {
                _id: result1._id,
                playlistName: result1.playlistName,
                playlistComment: result1.playlistComment,
                userIdx: result1.userIdx,
                thumbnail: thumbnail
            }
            result.push(data);
        }
        res.status(200).send(responseUtil.successTrue(returnCode.OK, "플레이리스트 조회", result));
    } else {
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }

});

module.exports = router;