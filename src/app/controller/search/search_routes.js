const express = require('express');
const router = express.Router({mergeParams: true})

//search
router.use('/search', require('./search'));

module.exports = router;