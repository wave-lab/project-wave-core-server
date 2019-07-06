var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var playlistSchema = new Schema({
    playlistName : String,
    playlistComment : String,
    userIdx : Number,
    songList: Array
},{
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('playlist', playlistSchema);