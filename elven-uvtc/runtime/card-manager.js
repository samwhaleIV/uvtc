const allCards = {};
const allCardsList = [];
const allCardSeries = [];

const internalCardWidth = 48;
const internalCardHeight = 64;
const halfInternalCardHeight = internalCardHeight / 2;
const internalCardWidthRatio = internalCardWidth / internalCardHeight;
const internalCardHeightRatio = internalCardHeight / internalCardWidth;

const processCardDescription = function(description) {
    description = description.replace(/\n/g," \n ").split(" ");
    for(let i = 0;i<description.length-1;i++) {
        if(description[i] !== "\n") {
            description[i] = description[i] + " ";
        }
    }
    return description;
}

const attackCardPrefix = processCardDescription("[attack slot card]\n\n");
const defenseCardPrefix = processCardDescription("[defense slot card]\n\n");
const specialCardPrefix = processCardDescription("[special slot card]\n\n");

const addCardSeries = function(cardSeries,imagePath) {
    for(let i = 0;i<cardSeries.length;i++) {
        cardSeries[i].sourceX = i * internalCardWidth;
        cardSeries[i].imagePath = imagePath;
        if(cardSeries[i].description) {
            let descriptionPrefix = [];
            switch(cardSeries[i].type) {
                case "attack":
                    descriptionPrefix = attackCardPrefix;
                    break;
                case "defense":
                    descriptionPrefix = defenseCardPrefix;
                    break;
                case "special":
                    descriptionPrefix = specialCardPrefix;
                    break;
            }
            cardSeries[i].description = [...descriptionPrefix,...processCardDescription(cardSeries[i].description)];
        }
        allCards[cardSeries[i].name] = cardSeries[i];
        allCardsList.push(cardSeries[i]);
    }
    allCardSeries.push(cardSeries);
}
