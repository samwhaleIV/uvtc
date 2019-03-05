const cardTitleTextScale = SmallTextScale;
const cardTitlePadding = 4;
const doubleCardTitlePadding = cardTitlePadding + cardTitlePadding;

function renderCard(card,x,y,width,height) {
    context.drawImage(
        imageDictionary[card.imagePath],
        card.sourceX,
        0,
        internalCardWidth,
        internalCardHeight,
        x,y,width,height
    );
    const textTestResult = drawTextTest(card.title,cardTitleTextScale);
    context.fillStyle = "black";

    context.fillRect(
        x,y,
        textTestResult.width+doubleCardTitlePadding,
        textTestResult.height+doubleCardTitlePadding
    );

    drawTextWhite(card.title,x+cardTitlePadding,y+cardTitlePadding,cardTitlePadding);

}
