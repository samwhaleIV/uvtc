const cardTitleTextScale = TinyTextScale;
const cardTitlePadding = 4;
const doubleCardTitlePadding = cardTitlePadding + cardTitlePadding;

function renderCard(card,x,y,width,height,partial=false) {

    context.fillStyle = "black";
    context.fillRect(x-2.5,y-2.5,width+5,height+5);

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

    drawTextWhite(card.name,x+cardTitlePadding,y+cardTitlePadding,cardTitleTextScale);

}
function renderCardPartial(card,x,y,width,height) {
    renderCard(card,x,y,width,height,true);
}

function renderCardFullScreen(card,x,y,width,height) {
    //TODO: Render more card shit because we have more space wooooo
    renderCard(card,x,y,width,height,false);
}