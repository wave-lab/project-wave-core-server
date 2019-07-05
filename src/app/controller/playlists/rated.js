const express = require('express');
const router = express.Router();
const moment = require('moment');

const jwt = require('../../module/jwt');
const upload = require('../../../config/multer');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');
const timeFormat = moment().format('YYYY-MM-DD HH:mm:ss');
const song = require('../../model/schema/song');
const myPlaylist = require('../../model/schema/myplaylist');
const playlist = require('../../model/schema/playlist');
const getMyPlaylist = require('../../module/getMyPlaylist');

//평가한 곡(rated) 에서 status 별로 조회
router.get('/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    await getMyPlaylist.searchMyPlaylist(userIdx);


    // //ID = userIdx
    // //const ID = jwt.verify(req.headers.authorization);

    // //회원일 경우
    // //if(ID > 0) {
    // //대기곡 조회
    // myPlaylist.find({ "userIdx": userIdx }, async function (err, data) {
    //     if (err) {
    //         console.log('myPlaylist get failed');
    //     }
    //     else {
    //         console.log(data);
    //         const ratedPlaylistIdx = data[0].ratedPlaylist;
    //         console.log((await (playlist.find({ "_id": ratedPlaylistIdx }))[0]));
    //         const ratedSongsList = await (playlist.find({ "_id": ratedPlaylistIdx }))[0].songList; //array
    //         console.log(ratedSongsList);
    //         const waitSongList = await song.find({ "status": 0 }); //유보
    //         const passSongList = await song.find({ "status": 1 }); //패스
    //         const failSongList = await song.find({ "status": 2 }); //실패
    //         res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.GET_SONGS_BY_STATUS_SUCCESS, {
    //             "통과": passSongList,
    //             "대기": waitSongList,
    //             "실패": failSongList
    //         }))
    //     }
    // })
    // //}
    // // //비회원일 경우
    // // else if(ID == -1) {
    // //     res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, "NO AUTHORIZATION"));
    // // }
    // // //토큰 검증 실패
    // // else {
    // //     res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    // // }
})

module.exports = router;