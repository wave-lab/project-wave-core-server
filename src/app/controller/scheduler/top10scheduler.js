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
const genre = require('../../module/genre');
const mood = require('../../module/mood');

//1시간마다 해야할 일 : TOP10
var everyHour = schedule.scheduleJob('0 0 * * * *', async function() {
    console.log('스케줄러 실행');

    const genreArray = [genre.g1, genre.g2, genre.g3, genre.g4, genre.g5, genre.g6, genre.g7, genre.g8];
    for(let i = 0; i<genreArray.length; i++) {
        await song.find({genreName : genreArray[i]}, async function(err, songResult) {
            if(err) {
                console.log(err);
            }
            else {
                await playlist.create({
                    playlistName : genreArray[i],
                    playlistComment : `TOP30_${genreArray[i]}`,
                    songList : songResult,
                }, async function(err, playlistResult) {
                    if(err) {
                        console.log(err);
                    } else {
                        await top10.create({
                            top10Name : playlistResult.playlistName,
                            checkTime : timeFormat,
                            playlistIdx : playlistResult._id
                        })
                    }
                })
            }
         }).sort({streamCount : -1}).limit(10);
    }

    const moodArray = [mood.m1, mood.m2, mood.m3, mood.m4, mood.m5, mood.m6, mood.m7, mood.m8];
    for(let j = 0; j<moodArray.length; j++) {
        await song.find({moodName : moodArray[j]}, async function(err, songResult) {
            if(err) {
                console.log(err);
            }
            else {
                await playlist.create({
                    playlistName : moodArray[j],
                    playlistComment : `TOP30_${moodArray[j]}`,
                    songList : songResult,
                }, async function(err, playlistResult) {
                    if(err) {
                        console.log(err);
                    } else {
                        await top10.create({
                            top10Name : playlistResult.playlistName,
                            checkTime : timeFormat,
                            playlistIdx : playlistResult._id
                        })
                    }
                })
            }
         }).sort({streamCount : -1}).limit(10);
    }
})

module.exports = router;