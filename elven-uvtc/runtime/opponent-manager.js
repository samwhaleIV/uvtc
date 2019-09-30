const opponents = {};
const addOpponent = (opponent,battleID) => {
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
        opponentGenerator.call(this,applicator,...parameters);
    }
};
