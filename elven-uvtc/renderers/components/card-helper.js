const cardTitleTextScale = TinyTextScale;
const cardTitlePadding = 4;
const doubleCardTitlePadding = cardTitlePadding + cardTitlePadding;

const fullScreenCardEnergyWidth = 64;

function renderStatus(status,x,y,width,height) {
    //todo: Render the name?
    if(status) {
        context.drawImage(imageDictionary[status.imagePath],status.sourceX,0,internalStatusWidth,internalStatusHeight,x,y,width,height)
    } else {
        context.fillStyle = "rgba(255,255,255,1)";
        context.fillRect(Math.floor(x),Math.floor(y),Math.floor(width),Math.floor(height));
        //context.drawImage(imageDictionary["ui/card-icons"],64,0,32,32,x,y,width,height);
    }
}
function renderStatusFullscreen(status,x,y,width,height) {
    renderStatus(status,x,y,width,height);
    renderFullScreenName(status.name,status.lineBreakName,x,y,width,cardTitleTextScale);

    if(status.description) {
        const yTop = Math.floor(height*0.5);
        context.fillStyle = "rgba(255,255,255,1)";
        context.fillRect(
            x,
            y+yTop,
            width,
            height - yTop
        );
        drawTextWrappingBlack(card.description,x + 6,y+yTop+6,width - (smallestTextScale*15),7,smallestTextScale);
    }
}

function renderCardBack(card,x,y,width,height) {
    context.drawImage(imageDictionary[card.backFacePath],x,y,width,height);
}

function renderFullScreenName(name,lineBreakName,x,y,width,scale) {
    const textTestResult = drawTextTest(name,scale);
    if(textTestResult.width + doubleCardTitlePadding > width) {

        const ttr1 = drawTextTest(lineBreakName[0],scale);
        const ttr2 = drawTextTest(lineBreakName[1],scale);

        context.fillStyle = "black";
        context.beginPath();
        context.rect(
            x,y,ttr1.width+doubleCardTitlePadding,
            ttr1.height+doubleCardTitlePadding
        );
        context.rect(
            x,y+ttr2.height+doubleCardTitlePadding,
            ttr2.width+doubleCardTitlePadding,ttr2.height+doubleCardTitlePadding
        );
        context.fill();

        const cardTextX = x+cardTitlePadding;
        const cardTextY = y+cardTitlePadding;

        drawTextWhite(lineBreakName[0],cardTextX,cardTextY,scale);
        drawTextWhite(lineBreakName[1],cardTextX,cardTextY+ttr1.height+doubleCardTitlePadding,scale);

    } else {
        context.fillStyle = "black";
        context.fillRect(
            x,y,
            textTestResult.width+doubleCardTitlePadding,
            textTestResult.height+doubleCardTitlePadding
        );
        drawTextWhite(name,x+cardTitlePadding,y+cardTitlePadding,scale);
    }
}

function renderCard(card,x,y,width,height,partial=false) {

    context.drawImage(
        imageDictionary[card.imagePath],
        card.sourceX,
        0,
        internalCardWidth,
        partial ? halfInternalCardHeight : internalCardHeight,
        x,y,width,height
    );

    renderFullScreenName(card.name,card.lineBreakName,x,y,width,cardTitleTextScale);

    //render card energy cost?
}
function renderCardPartial(card,x,y,width,height) {
    renderCard(card,x,y,width,height,true);
}

function renderCardFullScreen(card,x,y,width,height) {
    //TODO: Render more card shit because we have more space wooooo
    renderCard(card,x,y,width,height,false);

    if(!isNaN(card.energyCost)) {
        context.drawImage(
            imageDictionary["ui/status-roll"],
            card.energyCost*32,32,32,32,
            x + width - fullScreenCardEnergyWidth,
            y,
            fullScreenCardEnergyWidth,
            fullScreenCardEnergyWidth
        );
    }

    if(card.description) {

        const yTop = Math.floor(height*0.75);


        context.fillStyle = "rgba(255,255,255,1)";
        context.fillRect(
            x,
            y+yTop,
            width,
            height - yTop
        );

        drawTextWrappingBlack(card.description,x + 6,y+yTop+6,width - (smallestTextScale*15),7,smallestTextScale);
    }

}