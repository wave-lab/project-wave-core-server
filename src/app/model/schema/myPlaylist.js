let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let myPlaylistSchema = new Schema({
    userIdx : Number,
    historyPlaylist : String,
    likePlaylist : String,
    rateReadyPlaylist : String,
    ratedPlaylist : String,
    hitsPlaylist : String,
    uploadPlaylist : String,
    customPlaylist : Array
},{
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('myPlaylist', myPlaylistSchema);