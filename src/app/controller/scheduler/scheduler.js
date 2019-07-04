const express = require('express');
const router = express.Router({mergeParams: true});
const schedule = require('node-schedule');
const moment = require('moment');

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')
const pool = require('../../module/pool');


const song = require('../../model/schema/song');
const playlist = require('../../model/schema/playlist');//이렇게 해야 접근 가능
const top10 = require('../../model/schema/top10');

const timeFormat = moment().add(9, 'hours').format('YYYY-MM-DD HH:mm:ss');



//1시간마다 해야할 일
var scheduler = schedule.scheduleJob('0 0 * * * *', function() {
    //let mNow  = new Date();
    //console.log(mNow);
    console.log('스케쥴러 실행');

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

module.exports = router;