const express = require('express');
const router = express.Router({ mergeParams: true })
const moment = require('moment');

const jwt = require('../../module/jwt');
const returnCode = require('../../model/returnCode');
const responseUtil = require('../../module/responseUtil');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');

/**
 * 곡 평가
 * songIdx, userIdx, 평점
 * 1. 평가 했는지 안했는지 확인
 * 2. 평가 내역 추가
 * 3. 포인트 적립 내역 추가
 * 4. song 업데이트 - 받은 점수, 심사한 사람 수 rateScore, rateUserCount
 * 5. 그 사람이 평가한 곡 +1
 * 
 * 트랜잭션 처리 X
 */

router.post('/', async (req, res) => {

    //ID = userIdx
    let ID = jwt.verify(req.headers.authorization);
    ID = 2;

    const isRateHistory = 'SELECT * FROM rate_history WHERE userIdx = ? AND songIdx = ?';
    const insertRateHistory = 'INSERT INTO rate_history(userIdx, songIdx, ratePoint) VALUES(?, ?, ?)';
    const insertPointHistory = 'INSERT INTO point_history(userIdx, songIdx, getPoint) VALUES(?, ?, ?)';
    const getRateSongCount = 'SELECT rateSongCount FROM user WHERE userIdx = ?'
    const updaterateSongCount = 'UPDATE user SET ? WHERE userIdx = ?'

    const songIdx = req.params.songIdx;
    const rateScore = req.body.rateScore;

    //회원일 경우.
    if (ID > 0) {

        let result1 = await pool.queryParam_Arr(isRateHistory, [ID, songIdx]);

        if(result1.length == 0) {
            await song.find({ _id: songIdx }, async function (err, obj) {
                if (err) {
                    res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, "노래가 없습니다."));
                } else {
                    await song.update({ _id: songIdx }, {
                        $set: { rateScore: obj[0].rateScore + Number(rateScore), rateUserCount: obj[0].rateUserCount + 1 }
                    }, async function (err, output) {
                        if (err) {
                            res.status(200).send(responseUtil.successFalse(returnCode.DB_ERROR, "database failure"));
                        } else {
                            let result2 = await pool.queryParam_Arr(insertRateHistory, [ID, songIdx, rateScore]);
                            let result3 = await pool.queryParam_Arr(insertPointHistory, [ID, songIdx, 100]);
                            let result4 = await pool.queryParam_Arr(getRateSongCount, ID);
    
                            let data = {
                                rateSongCount: result4[0].rateSongCount + 1
                            };
    
                            let result5 = await pool.queryParam_Arr(updaterateSongCount, [data, ID]);
                            /**
                             * 1. 내가 평가한 곡 플레이 리스트 조회
                             * 2. 플레이 리스트에 곡 추가
                             */
                            res.status(200).send(responseUtil.successTrue(returnCode.CREATED, "평가 완료"));
                        }
                    })
                }
            });
        }else {
            res.status(200).send(responseUtil.successFalse(returnCode.NO_CONTENT, "이미 평가를 진행했습니다."));
        }
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