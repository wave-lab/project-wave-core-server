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
const timeFormat = moment().add(9, 'hours').format('YYYY-MM-DD HH:mm:ss');
const expirationTimeFormat = moment().add(7, 'days').add(9, 'hours').format('YYYY-MM-DD HH:mm:ss');


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
        const genreArray = body.genre[4].split(',');
        const moodArray = body.mood[4].split(',');
        const artworkUrl = req.files.artwork[0].location;
        const songUrl = req.files.songUrl[0].location;
        const coverArtistNameQuery = 'SELECT nickname FROM user WHERE userIdx= ?';
        const coverArtistName = (await pool.queryParam_Arr(coverArtistNameQuery, [ID]))[0].nickname;
        const originArtistIdxQuery = 'SELECT originArtistIdx FROM originArtist WHERE originArtistName=?';
        
        const insertNewOriginArtistQuery = 'INSERT INTO originArtist (originArtistName) VALUES (?)';
        const inputSongData = {
            originTitle: body.originTitle,
            userIdx: ID,
            coverArtistName: coverArtistName,
            streamCount: 0,
            likeCount: 0,
            artwork: artworkUrl,
            originArtistIdx: body.originArtistIdx,
            originArtistName: body.originArtistName,
            enrollTime: null,
            songUrl: songUrl,
            genre: genreArray,
            mood: moodArray,
            songComment: body.songComment,
            reportCount: 0,
            rateScore: 0,
            highlightTime: body.highlightTime,
            songStatus: 0,
            uploadDate: moment(),
            deleteTime: moment().add(7, 'days'),
            rateUserCount: 0
        }
        if (body.originTitle == null || songUrl == undefined) {
            console.log(err);
            res.status(200).send(resUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.SONG_UPLOAD_FAIL))
        } else if (body.originArtistIdx == null) {
            await pool.queryParam_Arr(insertNewOriginArtistQuery, [body.originArtistName]);
            console.log('새 원곡가수 삽입 성공');
            const originArtistIdx = (await pool.queryParam_Arr(originArtistIdxQuery, [body.originArtistName]))[0].originArtistIdx;
            inputSongData.originArtistIdx = originArtistIdx;
            await song.create(inputSongData, async function (err, docs) {
                res.status(200).send(resUtil.successTrue(returnCode.OK, returnMessage.SONG_UPLOAD_SUCCESS));
            })
        } 
        else {
            await song.create(inputSongData, async function (err, docs) {
                res.status(200).send(resUtil.successTrue(returnCode.OK, returnMessage.SONG_UPLOAD_SUCCESS));
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