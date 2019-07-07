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
            case "history": {
                return await playlist.find({ _id: result.historyPlaylist });
            }
            case "like": {
                return await playlist.find({ _id: result.likePlaylist });
            }
            case "rateReady": {
                return await playlist.find({ _id: result.rateReadyPlaylist });
            }
            case "rated": {
                return await playlist.find({ _id: result.ratedPlaylist });
            }
            case "upload": {
                return await playlist.find({ _id: result.uploadPlaylist });
            }
            case "hits": {
                return await playlist.find({ _id: result.hitsPlaylist });
            }
            case "custom": {
                return await playlist.find({ _id: result.customPlaylist });
            }
        }
    }
}