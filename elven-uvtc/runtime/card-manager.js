const allCards = {};
const allCardsList = [];
const allCardSeries = [];

const allStatuses = [];
const statusLookup = {};

const internalCardWidth = 48;
const internalCardHeight = 64;
const halfInternalCardHeight = internalCardHeight / 2;
const internalCardWidthRatio = internalCardWidth / internalCardHeight;
const internalCardHeightRatio = internalCardHeight / internalCardWidth;

const internalStatusWidth = 64;
const internalStatusHeight = 64;

const attackCardPrefix = processTextForWrapping("[attack slot card]\n\n");
const defenseCardPrefix = processTextForWrapping("[defense slot card]\n\n");
const specialCardPrefix = processTextForWrapping("[special slot card]\n\n");
const statusPrefix = processTextForWrapping("[status condition]\n\n");

const getLineBreakName = function(name) {
    const lineBreakName = [];
    const splitName = name.split(" ");
    lineBreakName.push(splitName.slice(0,splitName.length-1).join(" "));
    lineBreakName.push(splitName[splitName.length-1]);
    if(lineBreakName[0] === "") {
        lineBreakName[0] = lineBreakName[1];
        lineBreakName[1] = "";
    }
    return lineBreakName;
}

const addCardSeries = function(cardSeries,statuses,manifest) {
    for(let i = 0;i<cardSeries.length;i++) {

        cardSeries[i].sourceX = i * internalCardWidth;
        cardSeries[i].imagePath = manifest.imagePath;
        cardSeries[i].lineBreakName = getLineBreakName(cardSeries[i].name);
        cardSeries[i].backFacePath = manifest.backFacePath;

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
    let iOffset = 0;
    for(let i = 0;i<statuses.length;i++) {
        if(statuses[i].hidden) {
            iOffset--;
        } else {
            statuses[i].sourceX = (i+iOffset) * internalStatusWidth;
            statuses[i].imagePath = manifest.statusImagePath;
        }

        statuses[i].lineBreakName = getLineBreakName(statuses[i].name);
        if(statuses[i].description) {
            statuses[i].description = [...statusPrefix,...processTextForWrapping(statuses[i].description)];
        }

        statusLookup[statuses[i].name] = statuses[i];
        allStatuses.push(statuses[i]);
    }
    allCardSeries.push({
        cards: cardSeries,
        manifest: manifest
    });
}
