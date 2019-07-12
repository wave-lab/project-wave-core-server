const express = require('express');
const router = express.Router({ mergeParams: true });

const returnCode = require('../../model/returnCode');
const responseUtil = require('../../module/responseUtil');
const playlist = require('../../model/schema/playlist');
const myPlaylist = require('../../model/schema/myPlaylist');

//아티스트가 좋아요 한 곡 조회
//해당 유저의 업로드 곡 조회 중에 pass한 곡, songStatus = 1
router.get('/', async (req, res, next) => {
    const userIdx = req.params.userIdx;

    const result = (await myPlaylist.find({ userIdx: userIdx }))[0];

    if (result != undefined) {

        let query = {
            '_id': result.likePlaylist,
            'songList.songStatus': 1
        }
        
        console.log(query);

        const result2 = (await playlist.find(query))[0];

        res.status(200).send(responseUtil.successTrue(returnCode.OK, "사용자 좋아요 곡 조회", result2));
    } else {
        res.status(200).send(responseUtil.successFalse(returnCode.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }
});

module.exports = router;