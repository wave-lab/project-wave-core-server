const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

//사용자가 입력한 새로운 원곡가수 저장
router.post('/', async(req,res,next)=>{
    const artistName = req.body.artistName;

    const originArtistQuery = 'INSERT INTO originArtist (originArtistName) VALUES (?)';
    const originArtistResult = await pool.queryParam_Arr(originArtistQuery, [artistName]);

    if(!originArtistResult){
        res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.ARTIST_FAIL));
    }else{
        res.status(200).send(responseUtil.successTrue(returnCode.OK, returnMessage.SUCCESS));
    }
})

module.exports = router;