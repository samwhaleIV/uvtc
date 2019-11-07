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
            const songIntro = SONG_INTRO_LOOKUP[song];
            const fancyEncodingData = SongsWithTheNewFancyIntroEncoding[song];
            if(fancyEncodingData) {
                this.fancyEncodingData = fancyEncodingData;
            } else if(songIntro) {
                this.songIntro = songIntro;
            }
        }
        opponentGenerator.call(this,applicator,...parameters);
    }
};
