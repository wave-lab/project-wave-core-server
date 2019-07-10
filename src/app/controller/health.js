const express = require('express');
const router = express.Router();
const responseUtil = require('../module/responseUtil');
const returnCode = require('../model/returnCode');

router.get('/', async(req, res, next) => {
    return res.status(200).send(responseUtil.successTrue(returnCode.OK, "Core SERVER RUNNING..."));
});

module.exports = router; 