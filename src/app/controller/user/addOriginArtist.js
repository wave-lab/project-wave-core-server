const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const hash = require('../../module/hash');
const upload = require('../../../config/multer');


router.post('/', upload.array('originArtistImg'),async (req, res)=>{
    const insertOriginArtistQuery = 'INSERT INTO originArtist ( originArtistName, originArtistImg) VALUES (?,?)'
    const nameArray = req.body.originArtistName.split(',');
    for(var i=0 ; i < 100 ; i++) {
        await pool.queryParam_Arr(insertOriginArtistQuery, [nameArray[i], req.files[i].location])
    }
    for(var i = 0 ; i < 100;i++) {
        console.log('파일 이름 : '+req.files[i].originalname);
        console.log('인풋 이름 : ' + nameArray[i]);
        console.log('===========================================');
    }
    res.status(200).send('성공');
})

module.exports = router;