const express = require('express');
const router = express.Router({mergeParams: true})

/*
기본history 곡 추가
METHOD       : GET
URL          : /songs/:songIdx/user/:userIdx
PARAMETER    : songIdx = song의 인덱스
               userIdx = user의 인덱스
*/
router.get('/', async (req, res) => {
    const inputSongIdx = req.params.songIdx
    const inputUserIdx = req.params.userIdx
    console.log(inputSongIdx);
    //정욱오빠 모듈 갖다쓰기
    inputPlaylistIdx = result.history
    if(!inputPlaylistIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.NULL_VALUE));
    } else {
        song.find({songIdx : inputSongIdx}, async function(err, songResult) {
            if(err) {
                console.log(err);
            }
            else {
                //console.log(result);
                await playlist.find({_id : inputPlaylistIdx}, async function(err, playlistResult) {
                    if(err) {
                        console.log(err);
                    } else {
                        //console.log(playlistResult);
                        await playlistResult.push({songList : songResult}, async function(err, playlistPush) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log(playlistPush);
                            }
                        })
                        //console.log(docs);
                    }
                })
                //console.log(result);
            }
         })
        }
 })

module.exports = router;