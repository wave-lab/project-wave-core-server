// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const playlistModules = require('../../module/playlistModules') //playlist 통합 모듈

const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const playlist = require('../../model/schema/playlist');

/*
곡 좋아요 => 좋아요 플레이리스트에 곡 추가하기
METHOD       : POST
URL          : /songs/likes
BODY         : songIdx = song의 인덱스
               userIdx = user의 인덱스
*/
router.post('/', async(req, res) => {
    const inputUserIdx = req.body.userIdx;
    const inputSongIdx = req.body.songIdx;
    // default.js -> 회원인지 아닌지 판별

    // 곡이 유효한 곡인지 판별
    if(!inputUserIdx || !inputSongIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        song.find({_id : inputSongIdx}, async function(err, songSelectResult) {
            if(err) {
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.SONG_SELECT_FAIL));
            } else { 
                const likeCheckQuery = 'SELECT * FROM likes WHERE userIdx = ? AND songIdx = ?';
                const likeCheckResult = await pool.queryParam_Arr(likeCheckQuery, [inputUserIdx, inputSongIdx]);

                if(likeCheckResult.length != 0) { //이미 좋아요 된 상태
                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_LIKE_SONGS));
                } else {
                    const likeInsertQuery = 'INSERT INTO likes(userIdx, songIdx) VALUES (?,?)';
                    const likeInsertResult = await pool.queryParam_Arr(likeInsertQuery, [inputUserIdx, inputSongIdx]);
    
                    if(!likeInsertResult) { //좋아요 실패
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_LIKE_SONGS));
                    } else {
                        const songInfo = await song.find({"_id" : inputSongIdx});
                        await song.updateOne({"_id" : inputSongIdx}, {$set : {"likeCount" : songInfo[0].likeCount + 1}});

                        const myLikedList = (await playlistModules.getPlayList(inputUserIdx, 'like'))[0];
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
})

/*
곡 좋아요 취소 => 좋아요 플레이리스트에 곡 삭제하기
METHOD       : DELETE
URL          : /songs/:songIdx/likes/user/:userIdx
PARAMETER    : songIdx = song의 인덱스
               userIdx = user의 인덱스
*/

router.delete('/', async(req, res) => {
    const inputUserIdx = req.params.userIdx;
    const inputSongIdx = req.params.songIdx;
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
                const likeCheckQuery = 'SELECT * FROM likes WHERE userIdx = ? AND songIdx = ?';
                const likeCheckResult = await pool.queryParam_Arr(likeCheckQuery, [inputUserIdx, inputSongIdx]);
    
                if(likeCheckResult.length == 0) { //이미 좋아요 취소 된 상태
                    res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_UNLIKE_SONGS));
                } else {
                    const likeDeleteQuery = 'DELETE FROM likes WHERE userIdx = ? AND songIdx = ?';
                    const likeDeleteResult = await pool.queryParam_Arr(likeDeleteQuery, [inputUserIdx, inputSongIdx]);
    
                    if(!likeDeleteResult) { 
                        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_LIKE_SONGS));
                    } else { 
                        const songInfo = await song.find({"_id" : inputSongIdx});
                        await song.updateOne({"_id" : inputSongIdx}, {$set : {"likeCount" : songInfo[0].likeCount - 1}});

                        const myLikedList = (await playlistModules.getPlayList(inputUserIdx, 'like'))[0];
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
})
module.exports = router;