const myPlaylist = require('../model/schema/myPlaylist');
const playlist = require('../model/schema/playlist');
const song = require('../model/schema/song');

module.exports = {
    //플레이 리스트 조회
    searchMyPlaylist: async (ID) => {
        return (await myPlaylist.find({ userIdx: ID }))[0];
    },
    //내 플레이 리스트 조회
    getSongList: async (playlistIdx) => {
        return (await playlist.find({ _id: playlistIdx }))[0].songList;
    },
    addSongToPlaylist: async (playlistIdx, songIdx) => {
        const songList = (await playlist.find({ _id: playlistIdx }))[0].songList;
        const addSong = (await song.find({ _id: songIdx }))[0];
        await songList.push(addSong);
        await playlist.updateOne({ _id: playlistIdx }, { $set: { songList: songList } });
    },
    deleteSongFromPlaylist: async (playlistIdx, songIdx) => {
        const songList = (await playlist.find({ _id: playlistIdx }))[0].songList;
        for (var i in songList) {
            if (songList[i]._id == songIdx) {
                await songList.splice(i, 1);
            }
        }
        await playlist.updateOne({ _id: playlistIdx }, { $set: { songList: songList } });
    },
    getPlayList: async (ID, playlistName) => {
        const result = (await myPlaylist.find({ userIdx: ID }))[0];
        switch (playlistName) {
            case "like": {
                return (await playlist.find({ _id: result.likePlaylist }))[0];
            }
            case "rateReady": {
                return (await playlist.find({ _id: result.rateReadyPlaylist }))[0];
            }
            case "rated": {
                return (await playlist.find({ _id: result.ratedPlaylist }))[0];
            }
            case "upload": {
                return (await playlist.find({ _id: result.uploadPlaylist }))[0];
            }
            case "hits": {
                return (await playlist.find({ _id: result.hitsPlaylist }))[0];
            }
            case "custom": {
                return (await playlist.find({ _id: result.customPlaylist }))[0];
            }
        }
    }
}