const express = require('express');
const router = express.Router({mergeParams: true})
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt');
const playlistModules = require('../../module/playlistModules');
const upload = require('../../../config/multer');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

// 마이 페이지 조회
router.get('/', async(req, res, next) => { // 마이페이지 조회
    const ID = await jwt.verify(req.headers.authorization);
    console.log(ID);
    
    if(ID > 0) { //회원일 경우
        const selectUserQuery = 'SELECT * FROM user WHERE userIdx = ?';
        const selectUserResult = await pool.queryParam_Arr(selectUserQuery, [ID]);
        const userInfo = selectUserResult[0]; // user의 모든 정보

        // const selectUserGenreQuery = 'SELECT * FROM user_genre WHERE userIdx = ?';
        // const selectUserGenreResult = await pool.queryParam_Arr(selectUserGenreQuery, [ID]);
        // const userGenre = selectUserGenreResult; // user의 선호 장르 정보
        
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
        const playlistResult = {
            "hitsSong" : (await playlistModules.getSongList(myPlaylist.hitsPlaylist)), // 적중곡 리스트의 노래들
            "waitSong" : waitSongList,
            "passSong" : passSongList,
            "failSong" : failSongList
        }
        const selectScoreQuery = 'SELECT songIdx, ratePoint FROM rate_history WHERE userIdx = ?';
        const selectScoreResult = await pool.queryParam_Arr(selectScoreQuery, [ID]);
        const userScoreInfo = selectScoreResult;
        console.log(userScoreInfo);

        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.MYPAGE_SUCCESS, {
            "user 정보" : userInfo, 
            "playlist 결과": playlistResult,
            "user가 준 점수" : userScoreInfo}));

    }else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }
});

// 마이페이지 수정
router.put('/', upload.fields([{name:'profileImg', maxCount:1}, {name:'backImg', maxCount:1}]), async(req, res, next) => { //마이페이지 수정
    const ID = await jwt.verify(req.headers.authorization);
    console.log(ID);

    if(ID > 0) { //회원일 경우

        //회원 기본정보 수정
        const profileImg = req.files.profileImg[0].location;
        const backImg = req.files.backImg[0].location;
        const updateUserQuery = 'UPDATE user SET nickname = ?, profileImg = ?, backImg = ?, comment = ? WHERE userIdx = ?';
        const updateUserResult = await pool.queryParam_Arr(updateUserQuery, [req.body.nickname, profileImg, backImg, req.body.comment, ID]);
        
        if (!updateUserResult) {
            console.log('기본 정보 수정 실패');
            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.MYPAGE_EDIT_FAIL))
        }

        //선호 장르 수정
        const genreLen = req.body.genre.length; //선택된 장르의 갯수 구함
        const deleteUserGenreQuery = 'DELETE FROM user_genre WHERE userIdx = ?';
        const deleteUserGenreResult = await pool.queryParam_Arr(deleteUserGenreQuery, [ID]);

        for (i = 0; i < genreLen; i++) {
            const insertUserGenreQuery = 'INSERT INTO user_genre (userIdx, genreIdx) VALUES (?,?)';
            const insertUserGenreResult = await pool.queryParam_Arr(insertUserGenreQuery, [ID, req.body.genre[i]]);
            if (!insertUserGenreResult) {
                console.log('장르 수정 실패');
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.MYPAGE_EDIT_FAIL));
            }
        }

        //선호 장르 수정
        const moodLen = req.body.mood.length; //선택된 장르의 갯수 구함
        const deleteUserMoodQuery = 'DELETE FROM user_mood WHERE userIdx = ?';
        const deleteUserMoodResult = await pool.queryParam_Arr(deleteUserMoodQuery, [ID]);

        for (i = 0; i < moodLen; i++) {
            const insertUserMoodQuery = 'INSERT INTO user_mood (userIdx, moodIdx) VALUES (?,?)';
            const insertUserMoodResult = await pool.queryParam_Arr(insertUserMoodQuery, [ID, req.body.mood[i]]);
            if (!insertUserMoodResult) {
                console.log('무드 수정 실패');
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.MYPAGE_EDIT_FAIL));
            }
        }

        //선호 아티스트 수정
        const artistLen = req.body.originArtist.length;
        const deleteUserArtistQuery = 'DELETE FROM user_originArtist WHERE userIdx = ?';
        const deleteUserArtistResult = await pool.queryParam_Arr(deleteUserArtistQuery, [ID]);

        for (i = 0; i < artistLen; i++){
            const insertUserArtistQuery = 'INSERT INTO user_originArtist (userIdx, originArtistIdx) VALUES (?,?)';
            const insertUserArtistResult = await pool.queryParam_Arr(insertUserArtistQuery, [ID, req.body.originArtist[i]]);
            if (!insertUserArtistResult) {
                console.log('선호 아티스트 수정 실패');
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.MYPAGE_EDIT_FAIL));
            }
        }
        console.log('마이 페이지 수정 완료');
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.MYPAGE_EDIT_SUCCESS));
    
    }else if(ID == -1) { //비회원일 경우
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, returnMessage.NOT_CORRECT_TOKEN_USER));
    }
    else { //토큰 검증 실패
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, returnMessage.EMPTY_TOKEN));
    }

});

module.exports = router;