const express = require('express');
const router = express.Router();
const moment = require('moment');

const jwt = require('../../module/jwt');
const upload = require('../../../config/multer');
const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');
const playlistModules = require('../../module/playlistModules');
const pool = require('../../module/pool');

/*
myPlaylist 조회 (= 아티스트의 플레이리스트 조회)
METHOD       : GET
URL          : /playlist/:userIdx
PARAMETER : userIdx = user Index(특정 사용자의 idx)
*/
router.get('/', async (req, res) => {
    const ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        const myPlaylist = await playlistModules.searchMyPlaylist(ID);
        console.log(myPlaylist)
        const customIdx = myPlaylist.customPlaylist;
        console.log(customIdx);
        console.log((await playlistModules.getSongList(customIdx)))
        const result = {
            "custom": (await playlistModules.getSongList(myPlaylist.customPlaylist)),
            "history": (await playlistModules.getSongList(myPlaylist.historyPlaylist)),
            "like": (await playlistModules.getSongList(myPlaylist.likePlaylist))
        }
        console.log(result);
    }
    //비회원일 경우
    else if (ID == -1) {

    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

//평가한 곡(rated) 에서 status 별로 조회
router.get('/rated', async (req, res) => {
    console.log("hello");
    //ID = userIdx
    const ID = jwt.verify(req.headers.authorization);
    //console.log(ID);
    //회원일 경우
    if (ID > 0) {
        const ratedPlaylistIdx = myPlaylistData.ratedPlaylist;
        const ratedSongsList = await playlistModules.getSongList(ratedPlaylistIdx) //array
        const waitSongList = new Array();
        const passSongList = new Array();
        const failSongList = new Array();
        for (var i = 0; i < ratedSongsList.length; i++) {
            if (ratedSongsList[i].songStatus == 0) {
                waitSongList.push(ratedSongsList[i]);
            }
            else if (ratedSongsList[i].songStatus == 1) {
                passSongList.push(ratedSongsList[i]);
            }
            else {
                failSongList.push(ratedSongsList[i]);
            }
        }
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.GET_SONGS_BY_STATUS_SUCCESS, {
            "통과": passSongList,
            "대기": waitSongList,
            "실패": failSongList
        }))

    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, "NO AUTHORIZATION"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

//upload 한 노래들 가져오기
router.get('/upload', async (req, res) => {
    //ID = userIdx
    const ID = jwt.verify(req.headers.authorization);
    //회원일 경우
    if (ID > 0) {
        const uploadPlaylistIdx = await playlistModules.getPlayList(ID, 'upload')
        const uploadSongLists = await playlistModules.getSongList(uploadPlaylistIdx);
        if (!uploadSongLists) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.GET_UPLOAD_LIST_FAIL));
        }
        else {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.GET_UPLOAD_LIST_SUCCESS, uploadSongLists));
        }
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "no authorization"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

//적중곡 가져오기
router.get('/hits', async (req, res) => {
    const ID = await jwt.verify(req.headers.authorization);
    console.log(ID);
    //const userIdx = req.params.userIdx;
    //회원일 경우
    if (ID > 0) {
        const hitsPlaylistIdx = await playlistModules.getPlayList(ID, 'hits');
        const hitsSongList = await playlistModules.getSongList(hitsPlaylistIdx);
        const getMyRateQuery = 'SELECT ratePoint FROM rate_history WHERE userIdx =? AND songIdx = ?';
        let average = new Array();
        let myRate = new Array();
        for(var i = 0 ; i < hitsSongList.length ; i++) {
            average[i] = (parseFloat(hitsSongList[i].rateScore / hitsSongList[i].rateUserCount).toFixed(1));
            hitsSongList[i].averageRate = average[i];
            let songIdx = hitsSongList[i]._id
            myRate[i] = (await pool.queryParam_Arr(getMyRateQuery, [ID, songIdx.toString()]))[0].ratePoint;
            hitsSongList[i].myRate = myRate[i];
        }
        console.log(hitsSongList);
        if(!hitsPlaylistIdx) {
            res.status(200).send(responseUtil.successFalse(returnCode.BAD_REQUEST, returnMessage.GET_HITS_LIST_FAIL));
        }
        else {
            res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.GET_HITS_LIST_SUCCESS, hitsSongList ));
        }
        
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "no authorization"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }

})
module.exports = router;