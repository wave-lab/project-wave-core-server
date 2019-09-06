const express = require('express');
const router = express.Router();
const responseUtil = require('../../module/responseUtil');
const returnCode = require('../../model/returnCode');
const pool = require('../../module/pool');

const qs = require('querystring');

const song = require('../../model/schema/song');

router.get('/', async (req, res, next) => {

    const originArtistName = qs.unescape(req.query.originArtistName);
    const artistName = qs.unescape(req.query.artistName);
    const originTitle = qs.unescape(req.query.originTitle);

    const QUERY1 = 'SELECT * FROM originArtist WHERE originArtistName LIKE "%' + originArtistName + '%" limit 10';
    const QUERY3 = 'SELECT userIdx, nickname, profileImg FROM user WHERE isArtist = 1 AND nickname LIKE "%' + artistName + '%" limit 10';

    try {
        let result = {};
        //let result = new Array();
        let result1 = await pool.queryParam_None(QUERY1);
        let result3 = await pool.queryParam_None(QUERY3);
        const result2 = await song.find({ originTitle: { $regex: '.*' + originTitle + '.*' } }).sort({ enrollTime: -1 }).limit(10);
        if (result1.length > 0) {
            result.originArtistName = result1;
            // result.push({
            //     "원곡 아티스트에 키워드 포함" : result1
            // });
        }
        if (result2.length > 0) {
            result.originTitle = result2;
            // result.push({
            //     "곡 제목에 키워드 포함" : result2
            // });
        }
        if (result3.length > 0) {
            result.artistName = result3;
            // result.push({
            //     "커버 아티스트에 키워드 포함" : result3
            // })
        }
        return res.status(200).send(responseUtil.successTrue(returnCode.OK, "검색 성공", result));

    } catch (err) {
        return res.status(200).send(responseUtil.successFalse(returnCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"));
    }
});

module.exports = router; 