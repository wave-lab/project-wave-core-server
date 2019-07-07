const express = require('express');
const router = express.Router({mergeParams: true});
const schedule = require('node-schedule');
const moment = require('moment');
const jwt = require('../../module/jwt');
const song = require('../../model/schema/song');
const playlist = require('../../model/schema/playlist');//이렇게 해야 접근 가능
const top10 = require('../../model/schema/top10');
const playlistModules = require('../../module/playlistModules');
const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');



//1시간마다 해야할 일 : TOP10
var everyHour = schedule.scheduleJob('30/5 * * * *', function() {
    //let mNow  = new Date();
    //console.log(mNow);
    console.log('스케쥴러 실행');
    console.log(timeFormat);
    song.find({genreName : ' 힙합'}, async function(err, songResult) {
        if(err) {
            console.log(err);
        }
        else {
            //console.log(result);
            await playlist.create({
                playlistName : "힙합",
                playlistComment : "TOP30_힙합장르",
                songList : songResult,
            }, async function(err, playlistResult) {
                if(err) {
                    console.log(err);
                } else {
                    console.log(playlistResult);
                    await top10.create({
                        top10Name : playlistResult.playlistName,
                        checkTime : timeFormat,
                        playlistIdx : playlistResult._id
                    }, async function(err, top10listResult) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log(top10listResult);
                        }
                    })
                    //console.log(docs);
                }
            })
            //console.log(result);
        }
     }).sort({streamCount : -1}).limit(10);

    
})
console.log(timeFormat)
// var checkHits = schedule.scheduleJob('* * * * * *', function() {
//     //console.log('적중곡 판별 스케쥴러 실행');
//     // const ID = await jwt.verify(req.headers.authorization);
//     // const myPlaylistIdx = await playlistModules.searchMyPlaylist(ID);
//     // console.log(myPlaylistIdx);
//     // const ratedSongs = await playlistModules.getSongList(myPlaylistIdx.ratedPlaylist);
//     // console.log(ratedSongs);
// })

module.exports = router;