var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var top10Schema = new Schema({
    top10Idx : String,
    top10Name : String,
    checkTime : Date,
    playlistIdx : String
},{
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('top10', top10Schema);