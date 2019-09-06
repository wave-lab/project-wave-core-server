const express = require('express');
const router = express.Router();
const moment = require('moment');

const jwt = require('../../module/jwt');
const upload = require('../../../config/multer');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const resUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');
const song = require('../../model/schema/song');
const genre = require('../../module/genre');
const mood = require('../../module/mood')
const playlistModules = require('../../module/playlistModules');

const multiUpload = upload.fields([{
    name: 'songUrl'
}, {
    name: 'artwork'
}]);

router.post('/', multiUpload, async (req, res) => {

    //ID = userIdx
    const ID = jwt.verify(req.headers.authorization);
    //회원일 경우
    if (ID > 0) {
        const body = req.body;
        const genreNameArray = new Array();
        for(var i = 0 ; i < body.genre.length ; i++) {
            genreNameArray[i] = genre[(body.genre)[i]];
        }
        const moodNameArray = new Array();
        for(var i = 0 ; i < body.mood.length ; i++) {
            moodNameArray[i] = mood[(body.mood)[i]];
        }
        const artworkUrl = req.files.artwork[0].location;
        const songUrl = req.files.songUrl[0].location;

        const coverArtistNameQuery = 'SELECT nickname FROM user WHERE userIdx= ?';
        const coverArtistName = (await pool.queryParam_Arr(coverArtistNameQuery, [ID]))[0].nickname;
        const originArtistIdxQuery = 'SELECT * FROM originArtist WHERE originArtistName=?';
        const insertNewOriginArtistQuery = 'INSERT INTO originArtist (originArtistName) VALUES (?)';

        const inputSongData = {
            originTitle: body.originTitle,
            userIdx: ID,
            coverArtistName: coverArtistName,
            streamCount: 0,
            likeCount: 0,
            artwork: artworkUrl,
            originArtistIdx : null,
            originArtistName: body.originArtistName,
            enrollTime: null,
            songUrl: songUrl,
            genre: genreNameArray,
            mood: moodNameArray,
            songComment: body.songComment,
            reportCount: 0,
            rateScore: 0,
            highlightTime: body.highlightTime,
            songStatus: 0,
            uploadDate: moment(),
            deleteTime: moment().add(7, 'days'),
            rateUserCount: 0
        }
        const originArtistData = (await pool.queryParam_Arr(originArtistIdxQuery, [body.originArtistName]));
        if (body.originTitle == null || songUrl == undefined) {
            res.status(200).send(resUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.SONG_UPLOAD_FAIL))
        } else if (originArtistData[0] == undefined) {
            await pool.queryParam_Arr(insertNewOriginArtistQuery, [body.originArtistName]);

            console.log('새 원곡가수 삽입 성공');
            const newData = (await pool.queryParam_Arr(originArtistIdxQuery, [body.originArtistName]));
            inputSongData.originArtistIdx = newData[0].originArtistIdx;

            await song.create(inputSongData, async function (err, docs) {
                res.status(200).send(resUtil.successTrue(returnCode.OK, returnMessage.SONG_UPLOAD_SUCCESS, docs));
            })
        }
        else {
            inputSongData.originArtistIdx = originArtistData[0].originArtistIdx;
            const uploadPlaylistIdx = (await playlistModules.getPlayList(ID, 'upload'))._id;
            await song.create(inputSongData, async function(err, docs){
                await playlistModules.addSongToPlaylist(uploadPlaylistIdx, docs._id)
                res.status(200).send(resUtil.successTrue(returnCode.OK, returnMessage.SONG_UPLOAD_SUCCESS, docs));
            })
        }


    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(resUtil.successFalse(returnCode.BAD_REQUEST, "NO AUTHORIZATION"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(resUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})


module.exports = router;