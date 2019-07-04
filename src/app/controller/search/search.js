const express = require('express');
const router = express.Router();
const responseUtil = require('../../module/responseUtil');
const returnCode = require('../../model/returnCode');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');

/* test */ 
router.get('/', async(req, res, next) => {

    const keyword = req.query.keyword;
    const QUERY1 = 'SELECT * FROM originArtist WHERE originArtistName LIKE "%' + keyword + '%" limit 10';
    const QUERY3 = 'SELECT userIdx, nickname, profileImg FROM user WHERE isArtist = 1 AND nickname LIKE "%' + keyword + '%" limit 10';

    let result = new Array();

    let result1 = await pool.queryParam_Arr(QUERY1, keyword);
    let result3 = await pool.queryParam_Arr(QUERY3, keyword);

    let query = {
        $or: []
    };

    query.$or.push({
        originTitle: keyword
    });

    console.log(query);

    song.find(query, async function (err, data) {
        if (err) {
            return res.status(200).send(responseUtil.successFalse(returnCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"));
        } else {
            result.push({
                "원곡 아티스트에 키워드 포함" : result1
            });
            result.push({
                "곡 제목에 키워드 포함" : data
            });
            result.push({
                "커버 아티스트에 키워드 포함" : result3
            })
            return res.status(200).send(responseUtil.successTrue(returnCode.OK, "검색 성공", result));
        }
    }).sort({
        enrollTime: -1
    }).limit(10);
});

module.exports = router; 