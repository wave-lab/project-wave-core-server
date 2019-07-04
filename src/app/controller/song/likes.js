// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})


router.get('/', async (req, res) => {
    const inputsongIdx = req.params.songIdx;
    // 1. 파라미터(idx) 체크 => 실패시 CODE: 400, MSG : OUT_OF_VALUE
    console.log(inputsongIdx);
    res.status(200).send({
        message: req.params
    });
})
module.exports = router;