const express = require('express');
const router = express.Router({ mergeParams: true })

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const genre = require('../../module/genre');

/**
 * 평가 대기곡 스케줄러
 * 내가 업로드한 곡은 제외
 * 내가 선호하는 아티스트, 장르 기반
 * 1. 내가 좋아하는 아티스트의 노래를 커버한 곡
 * 2. 내가 좋아하는 장르
 * 
 * songStatus 0유보 1 통과 2 실패
 */

router.get('/', async (req, res) => {

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);

    //회원일 경우
    if (ID > 0) {
        const QUERY1 = 'SELECT * FROM user_originArtist WHERE userIdx = ?'
        const QUERY2 = 'SELECT * FROM user_genre WHERE userIdx = ?'

        let query = {
            $or: [],
            genreName: []
        };

        const result1 = await pool.queryParam_Arr(QUERY1, ID);

        for (i = 0; i < result1.length; i++) {
            query.$or.push({
                userIdx: result1[i].originArtistIdx
            });
        }

        const result3 = await pool.queryParam_Arr(QUERY2, ID);

        for (i = 0; i < result3.length; i++) {
            query.genreName.push(
                genre[result3[i].genreIdx]
            );
        }

        console.log(query);

        //db.articles.find( { “comments”: { $elemMatch: { “name”: “Charlie” } } } )

        const result4 = await song.find(query);
        console.log(result4);

        res.status(200).send(responseUtil.successTrue(returnCode.OK, "평가 대기곡 플레이리스트", result4));
    }
    //비회원일 경우
    else if (ID == -1) {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "로그인을 해 주세요"));
    }
    //토큰 검증 실패
    else {
        res.status(200).send(responseUtil.successFalse(returnCode.FORBIDDEN, "access denied"));
    }
})

module.exports = router;