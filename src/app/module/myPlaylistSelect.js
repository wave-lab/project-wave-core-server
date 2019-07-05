const myPlaylist = require('../model/schema/myPlaylist');
const pool = require('../module/pool');

module.exports = { // 두 개의 메소드 module화
    myListSelect: async(...args) => { // (...args) expression은 arrow function 사
        const inputPlaylistIdx = args[0];
        const inputUserIdx = args[1];

        let result;
        await myPlaylist.find({userIdx : inputUserIdx}, async function(err, myListSelectResult) {
            if(err) {
                result = null;
                    //console.log(err);
            } else {
                result = myListSelectResult;
            }
        })
        return result;
    }
}