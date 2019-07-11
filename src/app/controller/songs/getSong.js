const express = require('express');
const router = express.Router({ mergeParams: true });

const responseUtil = require('../../module/responseUtil');
const returnCode = require('../../model/returnCode');
const pool = require('../../module/pool');

const song = require('../../model/schema/song');
const jwt = require('../../module/jwt');

router.get('/', async (req, res) => {

    const ID = jwt.verify(req.headers.authorization);
    const songIdx = req.params.songIdx;

    const result = (await song.find({ _id: songIdx }))[0];

    if (ID != -1) {
        console.log(ID);

        /**
         * histroy에 추가
         */

        return res.status(200).send(responseUtil.successTrue(returnCode.OK, "사용자 노래 조회", result));
    } else {
        return res.status(200).send(responseUtil.successTrue(returnCode.OK, "비회원 노래 조회", result));
    }
});

module.exports = router; 