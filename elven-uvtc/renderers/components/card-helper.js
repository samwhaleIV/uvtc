const cardTitleTextScale = TinyTextScale;
const cardTitlePadding = 4;
const doubleCardTitlePadding = cardTitlePadding + cardTitlePadding;

const fullScreenCardEnergyWidth = 64;

function renderCard(card,x,y,width,height,partial=false) {

    context.drawImage(
        imageDictionary[card.imagePath],
        card.sourceX,
        0,
        internalCardWidth,
        partial ? halfInternalCardHeight : internalCardHeight,
        x,y,width,height
    );
    const textTestResult = drawTextTest(card.name,cardTitleTextScale);
    context.fillStyle = "black";

    context.fillRect(
        x,y,
        textTestResult.width+doubleCardTitlePadding,
        textTestResult.height+doubleCardTitlePadding
    );

    //render card energy cost?

    drawTextWhite(card.name,x+cardTitlePadding,y+cardTitlePadding,cardTitleTextScale);

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
        drawTextWrappingBlack(card.description,x + 5,y+yTop+5,width - 20,7,1,TinyTextScale);
    }

}