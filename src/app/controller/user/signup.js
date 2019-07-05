const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const hash = require('../../module/hash');
const upload = require('../../../config/multer');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

const playlist = require('../../model/schema/playlist');
const myPlaylist = require('../../model/schema/myPlaylist');

//회원가입
router.post('/', upload.single('profileImg'), async (req, res, next) => {
    if(req.body.genre == null){ //장르 값 입력이 없을 때
        console.log('장르 값 입력 없음');
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.NULL_VALUE));
    } else {
        if(req.body.originArtistIdx == null){ // 장르 값은 입력이 있고 아티스트는 입력이 없을 때
            console.log('선호 아티스트 입력 없음');
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.NULL_VALUE));
        }else{ // 장르값, 아티스트 모두 입력이 있을 때
            const hashedPw = hash.encoding(req.body.password);
            const profileImg = req.file.location;

            const signupQuery = 'INSERT INTO user (email, password, nickname, profileImg, comment) VALUES (?, ?, ?, ?, ?)';
            const signupResult = await pool.queryParam_Arr(signupQuery, [req.body.email, hashedPw.toString('base64'), req.body.nickname, profileImg, req.body.comment]);
    
            if (!signupResult) { // 기본정보 저장 실패
                res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.SIGNUP_FAIL));
            } else { //쿼리문이 성공했을 때
                const genrelen = req.body.genre.length; //선택된 장르의 갯수 구함
                console.log(genrelen);

                const selectUserIdxQuery = 'SELECT userIdx FROM user WHERE (email = ?)';
                const selectUserIdxResult = await pool.queryParam_Arr(selectUserIdxQuery, [req.body.email]);
                const selectedUserIdx = selectUserIdxResult[0].userIdx;
    
                if(selectUserIdxResult[0]==null){
                    console.log('해당 유저 정보 없음');
                    res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.NULL_VALUE));
                }else{ //장르 삽입
                    for (i=0; i<genrelen; i++){
                        const userGenreQuery = 'INSERT INTO user_genre (userIdx, genreIdx) VALUES (?,?)';
                        const userGenreResult = await pool.queryParam_Arr(userGenreQuery, [selectedUserIdx, req.body.genre[i]]);
                        if(!userGenreResult){
                            console.log('장르 삽입 실패');
                            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.GENRE_FAIL));
                        }else{ // 장르 삽입 성공
                            console.log('장르 삽입 성공');
                        }
                    }
                    //선호 아티스트 선택 삽입
                    const userArtistQuery = 'INSERT INTO user_originArtist (userIdx, originArtistIdx) VALUES (?,?)';
                    const userArtistResult = await pool.queryParam_Arr(userArtistQuery, [selectedUserIdx, req.body.originArtistIdx]);
                    if(!userArtistResult){
                        console.log('아티스트 삽입 실패');
                        res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.ARTIST_FAIL));
                    }else{
                        console.log('아티스트 삽입 성공');
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
            }
        }
    }
});

module.exports = router;
