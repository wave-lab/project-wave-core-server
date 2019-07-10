let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let historySchema = new Schema({
    userIdx : Number,
    songIdx : String,
    songInfo : Array,
    playCount : Number,
    playTime : Date
},{
    versionKey: false // You should be aware of the outcome after set to false
});

module.exports = mongoose.model('history', historySchema);