// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const playlistModules = require('../../module/playlistModules') //playlist 통합 모듈

const jwt = require('../../module/jwt');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const playlist = require('../../model/schema/playlist');
const myPlaylist = require('../../model/schema/myPlaylist');


/*
곡 좋아요 => 좋아요 플레이리스트에 곡 추가하기
METHOD       : POST
URL          : /songs/:songIdx/like
PARAMETER    : songIdx = song의 인덱스
*/
router.post('/', async(req, res) => {
    const inputSongIdx = req.params.songIdx;

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);


    //회원일 경우
    if (ID > 0) {
        // 곡이 유효한 곡인지 판별
        if(!inputSongIdx) {
            res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
        } else {
            await song.find({_id : inputSongIdx}, async function(err, songSelectResult) {
                if(err) {
                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.SONG_SELECT_FAIL));
                } else { 
                    const likeCheckQuery = 'SELECT * FROM likes WHERE userIdx = ? AND songIdx = ?';
                    const likeCheckResult = await pool.queryParam_Arr(likeCheckQuery, [ID, inputSongIdx]);

                    if(likeCheckResult.length != 0) { //이미 좋아요 된 상태
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_LIKE_SONGS));
                    } else {
                        const likeInsertQuery = 'INSERT INTO likes(userIdx, songIdx) VALUES (?,?)';
                        const likeInsertResult = await pool.queryParam_Arr(likeInsertQuery, [ID, inputSongIdx]);
        
                        if(!likeInsertResult) { //좋아요 실패
                            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_LIKE_SONGS));
                        } else {
                            const songInfo = await song.find({"_id" : inputSongIdx});
                            await song.updateOne({"_id" : inputSongIdx}, {$set : {"likeCount" : songInfo[0].likeCount + 1}});

                            const result = (await myPlaylist.find({ userIdx: ID }))[0];
                            const myLikedList = (await playlist.find({ _id: result.likePlaylist }))[0];


                            //const myLikedList = (await playlistModules.getPlayList(ID, 'like'))[0];
                            const songList = myLikedList.songList
                            const addSong = (await song.find({ _id: inputSongIdx }))[0];

                            await songList.push(addSong);

                            await playlist.updateOne({ _id: myLikedList._id }, { $set: { songList: songList } }, async function(err, updateResult){
                                if(err) {
                                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_LIKE_SONGS));
                                } else {
                                    res.status(200).send(resUtil.successTrue(resCode.NO_CONTENT, resMessage.LIKE_SONGS));
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(resUtil.successFalse(resCode.FORBIDDEN, "로그인을 해 주세요"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(resUtil.successFalse(resCode.FORBIDDEN, "access denied"));
    }    
})


/*
곡 좋아요 취소 => 좋아요 플레이리스트에 곡 삭제하기
METHOD       : DELETE
URL          : /songs/:songIdx/like
PARAMETER    : songIdx = song의 인덱스
*/
router.delete('/', async(req, res) => {
    const inputSongIdx = req.params.songIdx;

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        // 곡이 유효한 곡인지 판별
        if(!inputSongIdx) {
            res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
        } else {
            await song.find({_id : inputSongIdx}, async function(err, songSelectResult) {
                if(err) {
                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.SONG_SELECT_FAIL));
                } else { 
                    const likeCheckQuery = 'SELECT * FROM likes WHERE userIdx = ? AND songIdx = ?';
                    const likeCheckResult = await pool.queryParam_Arr(likeCheckQuery, [ID, inputSongIdx]);
        
                    if(likeCheckResult.length == 0) { //이미 좋아요 취소 된 상태
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_UNLIKE_SONGS));
                    } else {
                        const likeDeleteQuery = 'DELETE FROM likes WHERE userIdx = ? AND songIdx = ?';
                        const likeDeleteResult = await pool.queryParam_Arr(likeDeleteQuery, [ID, inputSongIdx]);
        
                        if(!likeDeleteResult) { 
                            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_LIKE_SONGS));
                        } else { 
                            const songInfo = await song.find({"_id" : inputSongIdx});
                            await song.updateOne({"_id" : inputSongIdx}, {$set : {"likeCount" : songInfo[0].likeCount - 1}});

                            const result = (await myPlaylist.find({ userIdx: ID }))[0];
                            const myLikedList = (await playlist.find({ _id: result.likePlaylist }))[0]
                            inputPlaylistIdx = myLikedList._id
                            
                            const songList = (await playlist.find({ _id: inputPlaylistIdx }))[0].songList;
                            for (var i in songList) {
                                if (songList[i]._id == inputSongIdx) {
                                    await songList.splice(i, 1);
                                }
                            }
                            await playlist.updateOne({ _id: inputPlaylistIdx }, { $set: { songList: songList } }, async function(err, deleteSongResult){
                                if(err) {
                                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_UNLIKE_SONGS));
                                } else {
                                    res.status(200).send(resUtil.successTrue(resCode.NO_CONTENT, resMessage.UNLIKE_SONGS));
                                }
                            });
                            //const deleteSongResult = await playlistModules.deleteSongFromPlaylist(inputPlaylistIdx, inputSongIdx);
                            //console.log(deleteSongResult);//삭제는 제대로 되는데 deleteSongResult가 undefined뜸
                        }
                    }
                }
            });
        }
    }

    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(resUtil.successFalse(resCode.FORBIDDEN, "로그인을 해 주세요"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(resUtil.successFalse(resCode.FORBIDDEN, "access denied"));
    }
})
module.exports = router;