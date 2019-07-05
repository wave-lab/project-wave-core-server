const myPlaylist = require('../model/schema/myPlaylist');
const playlist = require('../model/schema/playlist');
const song = require('../model/schema/song');

module.exports = {
    searchMyPlaylist: async (ID) => {
        let result;
        await myPlaylist.find({ "userIdx": ID }, function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                result = data[0];
            }

        })
        return result;
    },
    getSongList: async (playlistIdx) => {
        let result;
        await playlist.find({ _id: playlistIdx }, async function (err, getSongListResult) {
            if (err) {
                result = null;
            } else {
                result = getSongListResult;
            }
        })
        return result;
    },
    addSongToPlaylist: async (playlistIdx, songIdx) => {
        const songList = (await playlist.find({ "_id": playlistIdx }))[0].songList;
        const addSong = (await song.find({ "_id": songIdx }))[0];
        await songList.push(addSong);
        await playlist.updateOne({ "_id": playlistIdx }, { $set: { "songList": songList } });
    },
    deleteSongFromPlaylist: async (playlistIdx, songIdx) => {
        const songList = (await playlist.find({ "_id": playlistIdx }))[0].songList;
        for (var i in songList) {
            if (songList[i]._id == songIdx) {
                await songList.splice(i, 1);
            }
        }
        await playlist.updateOne({ "_id": playlistIdx }, { $set: { "songList": songList } });
    },

}