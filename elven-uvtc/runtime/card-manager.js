const allCards = {};
const allCardsList = [];
const cardSeries = [];

const internalCardWidth = 48;
const internalCardHeight = 64;

const addCardSeries = function(cardSeries,imagePath) {
    for(let i = 0;i<cardSeries.length;i++) {
        cardSeries[i].sourceX = i * internalCardWidth;
        cardSeries[i].imagePath = imagePath;
        allCards[cardSeries[i].name] = cardSeries[i];
        allCardsList.push(cardSeries[i]);
    }
    cardSeries.push(cardSeries);
}
