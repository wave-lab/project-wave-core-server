const express = require('express');
const router = express.Router({ mergeParams: true })

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const playlistModules = require('../../module/playlistModules');

/**
 * 내가 평가한 곡 리스트 조회
 */

router.get('/', async (req, res) => {

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        // const result1 = await playlistModules.getPlayList(ID, "rated");
        //res.status(200).send(responseUtil.successTrue(returnCode.OK, "내가 평가한 곡 플레이리스트", result1));
        
        const myPlaylist = await playlistModules.searchMyPlaylist(ID); // 사용자의 플레이리스트 모두 가져옴
        console.log(myPlaylist);

        const uploadSongs = await playlistModules.getSongList(myPlaylist.uploadPlaylist); // 업로드곡 리스트의 노래들
        const waitSongList = new Array();
        const passSongList = new Array();
        const failSongList = new Array();
        for(var i = 0 ; i < uploadSongs.length ; i++) { // 곡의 상태를 판별하여 곡정보를 담은 배열을 보내줌
            if(uploadSongs[i].songStatus == 0) { // 유보 상태의 곡들
                waitSongList.push(uploadSongs[i]);
            }
            else if(uploadSongs[i].songStatus == 1) { // 패스 상태의 곡들
                passSongList.push(uploadSongs[i]);
            }
            else { // 실패 상태의 곡들
                failSongList.push(uploadSongs[i]);
            }
        }
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SUCCESS, {
            "passSongList" : passSongList,
            "waitSongList" : waitSongList,
            "failSongList" : failSongList
        }));
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "로그인을 해 주세요"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

module.exports = router;