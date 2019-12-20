const opponents = {};
const addOpponent = (battleID,opponent) => {
    opponents[battleID] = opponent;
}
const speechEventMap = speech => {return{type:"speech",text:speech}};
const textEventMap = text => {return{type:"text",text:text}};
const actionEventMap = action => {return{type:"action",process:action}};

const getOpponent = (battleID,...battleParameters) => {
    const parameters = battleParameters;
    const opponentGenerator = opponents[battleID];
    if(!opponentGenerator) {
        throw Error(`Missing opponent generator for battleID '${battleID}'`);
    }
    return function(applicator) {
        const song = BattleMusicLinkingManifest[battleID]
        if(song) {
            this.song = song;
            const fancyEncodingData = FANCY_INTRO_SONGS[song];
            if(fancyEncodingData) {
                this.fancyEncodingData = fancyEncodingData;
            } else if(song in SONG_INTRO_LOOKUP) {
                this.songIntro = song + MUSIC_INTRO_SUFFIX;
            }
        }
        opponentGenerator.call(this,applicator,...parameters);
    }
};
