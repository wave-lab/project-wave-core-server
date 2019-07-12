const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

router.get('/', async (req, res, next) => {
    selectOriginArtistQuery = 'SELECT * FROM originArtist LIMIT 100';
    selectOriginArtistResult = await pool.queryParam_None(selectOriginArtistQuery);
    if (!selectOriginArtistResult) {
        res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, returnMessage.NULL_VALUE));
    } else {
        res.status(200).send(responseUtil.successTrue(returnCode.OK, "아티스트 조회 성공", selectOriginArtistResult));
    }
});

module.exports = router;