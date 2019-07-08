let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let songSchema = new Schema({
    originTitle : String,
    userIdx : Number,
    streamCount : Number,
    likeCount : Number,
    artwork : String,
    originArtistIdx : Number,
    enrollTime : String,
    songUrl : String,
    genreName : Array,
    moodName : Array,
    songComment : String,
    reportCount : Number,
    rateScore : Number,
    highlightTime : String,
    songStatus : Number,
    deleteTime : String,
    rateUserCount : Number,
    uploadDate : String
},{
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('song', songSchema, "song");