const express = require('express');
const router = express.Router({mergeParams: true})
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt');
const playlistModules = require('../../module/playlistModules');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

// 일반유저가 아티스트 프로필 조회
router.get('/', async(req, res, next) => {
    const ID = await jwt.verify(req.headers.authorization);
    console.log(ID);

    if(ID > 0) { //회원일 경우
        const coverArtistIdx = req.body.userIdx; //req에 들어오는 해당 곡 커버 아티스트의 userIdx
        const selectCoverArtistQuery = 'SELECT * FROM user WHERE userIdx = ?';
        const selectCoverArtistResult = await pool.queryParam_Arr(selectCoverArtistQuery, [coverArtistIdx]);
        
        if(!selectCoverArtistResult) {
            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.NOT_EXIST_USER));
        } else {
            const coverArtistInfo = selectCoverArtistResult[0]; // 커버 아티스트의 모든 정보
            console.log(coverArtistInfo);
            const coverArtistPlaylist = await playlistModules.searchMyPlaylist(coverArtistIdx); // 사용자의 플레이리스트 모두 가져옴
            console.log(coverArtistPlaylist);
    
            const uploadPlaylistSongs = await playlistModules.getSongList(coverArtistPlaylist.uploadPlaylist); // 업로드곡 리스트의 노래들
            const passSongList = new Array();
            for(var i = 0 ; i < uploadPlaylistSongs.length ; i++) {
                if(uploadPlaylistSongs[i].songStatus == 1) { // 패스 상태의 곡들
                    passSongList.push(uploadPlaylistSongs[i]);
                }
            }
    
            const playlistResult = {
                "likeSong" : (await playlistModules.getSongList(coverArtistPlaylist.likePlaylist)), // 적중곡 리스트의 노래들
                "passSong" : passSongList,
                "customPlaylist" : coverArtistPlaylist.customPlaylist
            }
            console.log(playlistResult);
    
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.MYPAGE_SUCCESS, {
                "user 정보" : coverArtistInfo,
                "playlist 결과": playlistResult}));
        }
    }else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }
});

module.exports = router;