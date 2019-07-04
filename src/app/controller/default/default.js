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

const multiUpload = upload.fields([{name : 'uploadSong'}, {name : 'artwork'}]);

router.get('/', async (req, res) => {

    //ID = userIdx
    const ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if(ID > 0) {
        
    }
    //비회원일 경우
    else if(ID == -1) {

    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

module.exports = router;