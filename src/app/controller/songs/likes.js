// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const playlistModules = require('../../module/playlistModules') //playlist 통합 모듈

const pool = require('../../module/pool');

const song = require('../../model/schema/song');


//좋아요 플레이리스트 생성 후 테스트 해보기

/*
곡 좋아요 => 좋아요 플레이리스트에 곡 추가하기
METHOD       : POST
URL          : /likes/user/:userIdx/songs?songIdx={songIdx}
PARAMETER    : songIdx = song의 인덱스
               userIdx = user의 인덱스
*/
router.post('/', async(req, res) => {
    const inputUserIdx = req.params.userIdx;
    const inputSongIdx = req.query.songIdx;
    // default.js -> 회원인지 아닌지 판별

    // 곡이 유효한 곡인지 판별
    if(!inputUserIdx || !inputSongIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        song.find({_id : inputSongIdx}, async function(err, songSelectResult) {
            if(err) {
                console.log(err);
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.SONG_SELECT_FAIL));
            } else { 
                //console.log(top10listResult[0]);
                //console.log(top10listResult[0].playlistIdx);
                const likeCheckQuery = 'SELECT * FROM likes WHERE userIdx = (?) and songIdx = (?)';
                const likeCheckResult = await pool.queryParam_Arr(likeCheckQuery, inputUserIdx, inputSongIdx);
    
                if(likeCheckResult) { //이미 좋아요 된 상태
                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_LIKE_SONGS));
                } else {
                    const likeInsertQuery = 'INSERT INTO likes(userIdx, songIdx) VALUES (?,?)';
                    const likeInsertResult = await pool.queryParam_Arr(likeInsertQuery, inputUserIdx, inputSongIdx);
    
                    if(!likeInsertResult) { //좋아요 실패
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_LIKE_SONGS));
                    } else { //좋아요 성공 => 좋아요 리스트에 추가
                        res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.LIKE_SONGS, likeInsertResult));

                        const myPlayList = await playlistModules.searchMyPlaylist(inputUserIdx);
                        
                        const inputPlaylistIdx = myPlaylist.likePlaylist;

                        const addLikeList = await playlistModules.addSongToPlaylist(inputPlaylistIdx, inputSongIdx);

                        if(!addLikeList) {
                            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.LIKE_PLAYLIST_INSERT_FAIL));
                        } else {
                            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.LIKE_PLAYLIST_INSERT_SUCCESS, addLikeList));
                        }
                    }
                }
            }
        });
    }
})

/*
곡 좋아요 취소 => 좋아요 플레이리스트에 곡 삭제하기
METHOD       : DELETE
URL          : /likes/user/:userIdx/songs?songIdx={songIdx}
PARAMETER    : songIdx = song의 인덱스
               userIdx = user의 인덱스
*/

router.delete('/', async (req, res) => {
    const inputUserIdx = req.params.userIdx;
    const inputSongIdx = req.query.songIdx;
    // default.js -> 회원인지 아닌지 판별

    // 곡이 유효한 곡인지 판별
    if(!inputUserIdx || !inputSongIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        song.find({_id : inputSongIdx}, async function(err, songSelectResult) {
            if(err) {
                console.log(err);
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.SONG_SELECT_FAIL));
            } else { 
                //console.log(top10listResult[0]);
                //console.log(top10listResult[0].playlistIdx);
                const likeCheckQuery = 'SELECT * FROM likes WHERE userIdx = (?) and songIdx = (?)';
                const likeCheckResult = await pool.queryParam_Arr(likeCheckQuery, inputUserIdx, inputSongIdx);
    
                if(!likeCheckResult) { //이미 좋아요 취소 된 상태
                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_UNLIKE_SONGS));
                } else {
                    const likeDeleteQuery = 'DELETE FROM likes WHERE userIdx = (?) and songIdx= (?)';
                    const likeDeleteResult = await pool.queryParam_Arr(likeDeleteQuery, inputUserIdx, inputSongIdx);
    
                    if(!likeDeleteResult) { //좋아요 실패
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_UNLIKE_SONGS));
                    } else { //좋아요 취소 => 좋아요 리스트에서 곡 삭제
                        res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.UNLIKE_SONGS, likeDeleteResult));

                        const myPlayList = await playlistModules.searchMyPlaylist(inputUserIdx);
                        const inputPlaylistIdx = myPlaylist.likePlaylist;

                        const deleteLikeList = await playlistModules.deleteSongFromPlaylist(inputPlaylistIdx, inputSongIdx);

                        if(!deleteLikeList) {
                            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.LIKE_PLAYLIST_DELETE_FAIL));
                        } else {
                            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.LIKE_PLAYLIST_DELETE_SUCCESS, deleteLikeList));
                        }
                    }
                }
            }
        });
    }
})
module.exports = router;