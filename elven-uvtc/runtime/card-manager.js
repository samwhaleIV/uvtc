const allCards = {};
const allCardsList = [];
const allCardSeries = [];

const internalCardWidth = 48;
const internalCardHeight = 64;
const halfInternalCardHeight = internalCardHeight / 2;
const internalCardWidthRatio = internalCardWidth / internalCardHeight;
const internalCardHeightRatio = internalCardHeight / internalCardWidth;

const attackCardPrefix = processTextForWrapping("[attack slot card]\n\n");
const defenseCardPrefix = processTextForWrapping("[defense slot card]\n\n");
const specialCardPrefix = processTextForWrapping("[special slot card]\n\n");

const addCardSeries = function(cardSeries,imagePath) {
    for(let i = 0;i<cardSeries.length;i++) {
        cardSeries[i].sourceX = i * internalCardWidth;
        cardSeries[i].imagePath = imagePath;

        const lineBreakName = [];

        const splitName = cardSeries[i].name.split(" ");
        lineBreakName.push(splitName.slice(0,splitName.length-1).join(" "));
        lineBreakName.push(splitName[splitName.length-1]);

        cardSeries[i].lineBreakName = lineBreakName;


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
            cardSeries[i].description = [...descriptionPrefix,...processTextForWrapping(cardSeries[i].description)];
        }
        allCards[cardSeries[i].name] = cardSeries[i];
        allCardsList.push(cardSeries[i]);
    }
    allCardSeries.push(cardSeries);
}
