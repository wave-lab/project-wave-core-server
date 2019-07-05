const myPlaylist = require('../model/schema/myPlaylist');
const responseUtil = require('./responseUtil');
const returnMessage = require('../../config/returnMessage');
const returnCode = require('../model/returnCode');


module.exports = {
    searchMyPlaylist : (ID) => {
        myPlaylist.find({ "userIdx": ID }, async function (err, data) {
            if(err) {
                console.log(err);
            }
            else {
                console.log(data);
                return data;
            }
        })
    }
}