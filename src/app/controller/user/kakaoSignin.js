const express = require('express');
const router = express.Router();
const pool = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');
const hash = require('../../module/hash');

const returnCode = require('../../model/returnCode');
const returnMessage = require('../../../config/returnMessage');
const responseUtil = require('../../module/responseUtil');

router.post('/', (req, res, next) => {

});

module.exports = router;