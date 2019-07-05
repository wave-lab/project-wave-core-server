const playlistSelect = require('../model/schema/playlist');
const pool = require('../module/pool');

module.exports = { // 두 개의 메소드 module화
    listSelect: async(...args) => { // (...args) expression은 arrow function 사
        const inputPlaylistIdx = args[0];
        let result;
        await playlistSelect.find({_id : inputPlaylistIdx}, async function(err, listSelectResult) {
            if(err) {
                result = null;
                    //console.log(err);
            } else {
                result = listSelectResult;
            }
        })
        return result;
    }
}