const myPlaylist = require('../model/schema/myPlaylist');
const responseUtil = require('./responseUtil');
const returnMessage = require('../../config/returnMessage');
const returnCode = require('../model/returnCode');


module.exports = {
   searchMyPlaylist : async (ID) => {
       let result;
       await myPlaylist.find({ "userIdx": ID }, function (err, data) {
           if(err) {
               console.log(err);
           }
           else {
               result = data;
           }

       })
       return result;
   }
}