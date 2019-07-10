let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let songSchema = new Schema({
    originTitle : String,
    userIdx : Number,
    coverArtistName : String,
    streamCount : Number,
    likeCount : Number,
    artwork : String,
    originArtistIdx : Number,
    originArtistName : String,
    enrollTime : Date,
    songUrl : String,
    genre : Array,
    mood : Array,
    songComment : String,
    reportCount : Number,
    rateScore : Number,
    highlightTime : String,
    songStatus : Number,
    deleteTime : Date,
    rateUserCount : Number,
    uploadDate : Date
},{
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('song', songSchema, "song");