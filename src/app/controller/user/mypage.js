const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt');
const playlistModules = require('../../module/playlistModules');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

router.get('/', async(req, res, next) => {
    const ID = await jwt.verify(req.headers.authorization);
    console.log(ID);

    if(ID > 0) { //회원일 경우

        const selectUserQuery = 'SELECT * FROM user WHERE userIdx = ?';
        const selectUserResult = await pool.queryParam_Arr(selectUserQuery, [ID]);
        const userInfo = selectUserResult[0]; // user의 모든 정보
        const userIsArtist = userInfo.isArtist; // user의 isArtist 정보
        const selectUserGenreQuery = 'SELECT * FROM user_genre WHERE userIdx = ?';
        const selectUserGenreResult = await pool.queryParam_Arr(selectUserGenreQuery, [ID]);
        const userGenre = selectUserGenreResult; // user의 선호 장르 정보
        
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
        console.log(result);

        console.log(userInfo);
        console.log(userIsArtist);
        console.log(userGenre);

        if (userIsArtist == 0){ // user가 일반 유저일 때 

        } else{ // user가 artist일 때

        }

    }else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }
});

router.post('/', async(req, res, next) => {

});

module.exports = router;