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
const expirationTimeFormat = moment().add(7, 'days').add(9,'hours').format('YYYY-MM-DD HH:mm:ss');


const multiUpload = upload.fields([{ name: 'uploadSong'}, { name: 'artwork' }]);

router.post('/', multiUpload, async (req, res) => {

    //ID = userIdx
    const ID = jwt.verify(req.headers.authorization);
    console.log(ID);
    //회원일 경우
    if(ID > 0) {
        const artworkUrl = req.files.artwork[0].location;
    const uploadSongUrl = req.files.uploadSong[0].location;
    const body = req.body;
    const genreNameArray = body.genreName[4].split(',');
    const moodNameArray = body.moodName[4].split(',');

    await song.create({
        originTitle: body.originTitle,
        userIdx: ID,
        streamCount: 0,
        likeCount: 0,
        artwork: artworkUrl,
        originArtistIdx: body.originArtistIdx,
        enrollTime: null,
        songUrl: uploadSongUrl,
        genreName: genreNameArray,
        moodName: moodNameArray,
        songComment: body.songComment,
        reportCount: 0,
        rateScore: 0,
        highlightTime: body.highlightTime,
        songStatus: 0,
        uploadDate: timeFormat,
        deleteTime: expirationTimeFormat,
        rateUserCount: 0
    }, async function (err, docs) {
        if (err) {
            console.log(err);
            res.status(200).send(resUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.SONG_UPLOAD_FAIL))
        }
        else {
            console.log(docs);
            res.status(200).send(resUtil.successTrue(returnCode.OK, returnMessage.SONG_UPLOAD_SUCCESS));
        }
    })

    }
    //비회원일 경우
    else if(ID == -1) {
        res.status(200).send(resUtil.successFalse(returnCode.BAD_REQUEST, "NO AUTHORIZATION"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(resUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})


module.exports = router;