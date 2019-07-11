const opponents = {};
const addOpponent = (opponent,battleID) => {
    opponents[battleID] = opponent;
}
const getOpponent = (battleID,...battleParameters) => {
    const opponentGenerator = opponents[battleID];
    if(!opponentGenerator) {
        throw Error(`Missing opponent generator for battleID '${battleID}'`);
    }
    return new opponentGenerator(...battleParameters);
};
