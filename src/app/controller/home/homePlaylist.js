const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

const playlistModules = require('../../module/playlistModules');
const song = require('../../model/schema/song');
const top10 = require('../../model/schema/top10');

router.get('/', async(req, res, next) => {
    const ID = await jwt.verify(req.headers.authorization);
    console.log(ID);

    if(ID > 0) { //회원일 경우

        // 플레이리스트 리스트
        const myPlaylist = await playlistModules.searchMyPlaylist(ID); // 사용자의 플레이리스트 모두 가져옴
        
        const uploadSongs = await playlistModules.getSongList(myPlaylist.uploadPlaylist); // 업로드곡 리스트의 노래들
        //console.log(uploadSongs);
        const waitSongs = new Array(); // 업로드 곡 중 유보중인 곡
        for(var i = 0 ; i < uploadSongs.length ; i++) { // 곡의 상태를 판별하여 곡정보를 담은 배열을 보내줌
            if(uploadSongs[i].songStatus == 0) { // 유보 상태의 곡들
                waitSongs.push(uploadSongs[i]);
            }
        }
        // 평가 대기곡
        const rateReadySongs = await playlistModules.getSongList(myPlaylist.rateReadyPlaylist);
        // 적중 성공곡
        const hitsSongs = await playlistModules.getSongList(myPlaylist.hitsPlaylist);
        //추천곡 
        var recommendSongs = new Array();
        const artistSelectQuery = 'SELECT originArtistIdx FROM user_originArtist WHERE userIdx = ?';
        const artistSelectResult = await pool.queryParam_Arr(artistSelectQuery, [ID]);

        if(!artistSelectResult) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.FAIL));
        } else {
            console.log(artistSelectResult);
            console.log(artistSelectResult[0].originArtistIdx);
            for(let i = 0; i < artistSelectResult.length; i++) {
                await song.find({originArtistIdx : artistSelectResult[i].originArtistIdx}, async function(err, songResult) {
                    if(err) {
                        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnCode.FAIL));
                    } else {
                        console.log(songResult);
                        recommendSongs[i] = songResult;
                    }
                }).sort({streamCount : -1}).limit(30);;
            }
            if(!recommendSongs) {
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL));
            }
        }
        // TOP 10 
        const userGenreQuery = 'SELECT * FROM user_genre WHERE userIdx = ?';
        const userGenreResult = await pool.queryParam_Arr(userGenreQuery, [ID]);
        const userMoodQuery = 'SELECT * FROM user_mood WHERE userIdx = ?';
        const userMoodResult = await pool.queryParam_Arr(userMoodQuery, [ID]);
        
        const top10Playlist = (await top10.find());

        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SUCCESS, {
            'userInfo' : userInfoResult,
            'rate-ready' : rateReadySongs,
            'hits' : hitsSongs,
            'recommend' : recommendSongs,
            'top10' : top10Playlist,
            'user-genre-info' : userGenreResult,
            'user-mood-info' : userMoodResult
        }));

    }else if(ID == -1) { //비회원일 경우
        const rateReadySongs = (await song.find({ songStatus: 0 }).limit(10));
        const top10Playlist = (await top10.find());
        
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SUCCESS, {
            'rate-ready' : rateReadySongs,
            'top10' : top10Playlist
        }));
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }
});

module.exports = router;