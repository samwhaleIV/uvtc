const allCards = {};
const allCardsList = [];
const allCardSeries = [];

const internalCardWidth = 48;
const internalCardHeight = 64;
const halfInternalCardHeight = internalCardHeight / 2;

const addCardSeries = function(cardSeries,imagePath) {
    for(let i = 0;i<cardSeries.length;i++) {
        cardSeries[i].sourceX = i * internalCardWidth;
        cardSeries[i].imagePath = imagePath;
        allCards[cardSeries[i].name] = cardSeries[i];
        allCardsList.push(cardSeries[i]);
    }
    allCardSeries.push(cardSeries);
}
