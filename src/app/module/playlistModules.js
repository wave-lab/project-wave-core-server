const myPlaylist = require('../model/schema/myPlaylist');
const playlist = require('../model/schema/playlist');
const song = require('../model/schema/song');

module.exports = {
    searchMyPlaylist : async (ID) => {
        let result;
        await myPlaylist.find({ "userIdx": ID }, function (err, data) {
            if(err) {
                console.log(err);
            }
            else {
                result = data[0];
            }
            
        })
        return result;
    },
    getSongList : async (playlistIdx) => {
        await playlist.find({_id : playlistIdx}, async function(err, getSongListResult) {
            if(err) {
                result = null;
                    //console.log(err);
            } else {
                result = getSongListResult;
            }
        })
        return result;
    },
    addSongToPlaylist : async (playlistIdx, songIdx) => {
        const songList = (await playlist.find({"_id" : playlistIdx}))[0].songList;
        const addSong = (await song.find({"_id" : songIdx}))[0];
        await songList.push(addSong);
        await playlist.update({"_id" : playlistIdx}, {$set : {"songList" : songList}});
        console.log('added');
    },
    deleteSongFromPlaylist : async (playlistIdx, songIdx) => {
        const songList = this.getSongList(playlistIdx);
        for(var i in songList) {
            if(songList[i].songIdx == songIdx) {
                await songList.splice(i,1);
            }
        }
        await playlist.update({"_id" : playlistIdx}, {$set : {"songList" : songList}});
        console.log('deleted');
    },
    
}