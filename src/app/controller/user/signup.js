const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const hash = require('../../../config/hashKey').key;
const crypto = require('crypto-promise');
const upload = require('../../../config/multer');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

const playlist = require('../../model/schema/playlist');
const myPlaylist = require('../../model/schema/myPlaylist');

//회원가입
router.post('/', upload.single('profileImg'), async (req, res, next) => {
    const hashedPw = await crypto.pbkdf2(req.body.password.toString('utf8'), hash, 1000, 32, 'SHA512');
    const profileImg = req.file.location;

    const signupQuery = 'INSERT INTO user (email, password, nickname, profileImg, comment) VALUES (?, ?, ?, ?, ?)';
    const signupResult = await pool.queryParam_Arr(signupQuery, [req.body.email, hashedPw.toString('base64'), req.body.nickname, profileImg, req.body.comment]);
    
    if (!signupResult) {
        res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.SIGNUP_FAIL));
    } else { //쿼리문이 성공했을 때

        const bodylen = req.body.genre.length;
        console.log(bodylen);
        
        const selectUserIdxQuery = 'SELECT userIdx FROM user WHERE (email = ?)';
        const selectUserIdxResult = await pool.queryParam_Arr(selectUserIdxQuery, [req.body.email]);
        console.log(selectUserIdxResult[0]);
        const selectedUserIdx = selectUserIdxResult[0].userIdx;

        if(selectUserIdxResult[0]==null){
            console.log('해당 유저 정보 없음');
            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.NULL_VALUE));
        }else{ //장르 삽입
            for (i=0; i<bodylen; i++){
                const userGenreQuery = 'INSERT INTO user_genre (userIdx, genreIdx) VALUES (?,?)';
                const userGenreResult = await pool.queryParam_Arr(userGenreQuery, [selectedUserIdx, req.body.genre[i]]);
                if(!userGenreResult){
                    console.log('장르 삽입 실패');
                    res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.GENRE_FAIL));
                }else{
                    console.log('장르 삽입 성공');
                }
            }
            //선호 아티스트 선택 삽입
            const userArtistQuery = 'INSERT INTO user_originArtist (userIdx, originArtistIdx) VALUES (?,?)';
            const userArtistResult = await pool.queryParam_Arr(userArtistQuery, [selectedUserIdx, req.body.originArtistIdx]);

            const defaultPlaylistName = ['history','like','rateReady','rated','upload','hits'];
            const defaultPlaylistComment = ["최근 재생곡","좋아요","평가 대기곡","평가한 곡","업로드한 곡","적중 곡"];
            const defaultPlaylistIdx = new Array();
            
            for (var i = 0; i < 6; i++) {
                await playlist.create({
                playlistName: defaultPlaylistName[i],
                playlistComment: defaultPlaylistComment[i],
                userIdx: selectedUserIdx
                })
            }
            console.log('플레이리스트 목록 생성 완료');
            for(var i = 0 ; i < 6; i++) {
                defaultPlaylistIdx[i] = (await playlist.find({"userIdx" : selectedUserIdx}))[i]._id;
            }
            console.log('플레이리스트 블록 2 완료');

            await myPlaylist.create({
                userIdx : selectedUserIdx,
                historyPlaylist : defaultPlaylistIdx[0],
                likePlaylist : defaultPlaylistIdx[1],
                rateReadyPlaylist : defaultPlaylistIdx[2],
                ratedPlaylist : defaultPlaylistIdx[3],
                uploadPlaylist : defaultPlaylistIdx[4],
                hitsPlaylist : defaultPlaylistIdx[5]
            })
            console.log('플레이리스트 블록 3 완료');
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SIGNUP_SUCCESS));
        }
    }
});

module.exports = router;
