const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const pool = require('../../module/pool');

const myPlaylist = require('../../model/schema/myPlaylist');

/*
myPlaylist 조회 (= 아티스트의 플레이리스트 조회)
METHOD       : GET
URL          : /playlist/:userIdx
PARAMETER : userIdx = user Index(특정 사용자의 idx)
*/
router.get('/', async (req, res) => {
    const inputUserIdx = req.params.userIdx;

    if(!inputUserIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
    }
    else {
        myPlaylist.find({userIdx : inputUserIdx}, async function(err, myPlaylistResult) {
            if(err) {
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.OUT_OF_VALUE));
            } else {
                console.log(myPlaylistResult);
            }
        })
    }
})

module.exports = router;