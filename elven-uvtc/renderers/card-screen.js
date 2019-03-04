const rightBar = {};
rightBar.y = 0;
rightBar.color = "rgba(255,255,255,0.5)";

const innerRightBarMargin = 5;
const innerRightBar = {};
innerRightBar.color = "rgba(0,0,0,0.5)";

const topBar = {};
topBar.x = 0;
topBar.y = 0;
topBar.height = 40;
topBar.color = "white";

const leftArea = {};
leftArea.x = 0;
leftArea.y = topBar.height;
leftArea.color = "rgba(128,128,128,0.7)";

const innerLeftAreaMargin = 15;
const innerAreaVerticalSpace = innerLeftAreaMargin * 3;
const innerLeftArea = {};
innerLeftArea.color = "rgb(242,242,242)";

const bubbleSelectorY = leftArea.y + innerLeftAreaMargin;

const bubbleSelectorHeight = innerLeftAreaMargin + innerLeftAreaMargin;

const leftBubbleSelector = {};
leftBubbleSelector.height = bubbleSelectorHeight;
leftBubbleSelector.y = bubbleSelectorY;

const rightBubbleSelector = {};
rightBubbleSelector.height = bubbleSelectorHeight;
rightBubbleSelector.y = bubbleSelectorY;

const halfBubbleExtensionWidth = 10;
const bubbleExtensionHeight = innerLeftAreaMargin;

const leftBubbleExtension = {};
leftBubbleExtension.height = bubbleExtensionHeight;
leftBubbleExtension.color = "white";

const rightBubbleExtension = {};
rightBubbleExtension.height = bubbleExtensionHeight;
rightBubbleExtension.color = "white";

const bubbleTextScale = SmallTextScale;
const bubbleTextMargin = 5;
const leftBubbleText = {
    scale: bubbleTextScale
};
const rightBubbleText = {
    scale: bubbleTextScale
};

const bubbleSelectorHitTest = {};
bubbleSelectorHitTest.y = bubbleSelectorY;
bubbleSelectorHitTest.height = bubbleSelectorHeight;

function updateRenderElements() {
    rightBar.x = fullWidth - Math.floor(fullWidth * 0.33);
    rightBar.width = fullWidth - rightBar.x;
    rightBar.height = fullHeight;

    innerRightBar.x = rightBar.x + innerRightBarMargin;
    innerRightBar.y = rightBar.y + innerRightBarMargin;

    innerRightBar.width = rightBar.width - innerRightBarMargin - innerRightBarMargin;
    innerRightBar.height = rightBar.height - innerRightBarMargin - innerRightBarMargin;

    topBar.width = rightBar.x;

    leftArea.height = fullHeight - leftArea.y;
    leftArea.width = topBar.width;


    innerLeftArea.x = leftArea.x + innerLeftAreaMargin;
    innerLeftArea.y = leftArea.y + innerLeftAreaMargin + innerAreaVerticalSpace;
    innerLeftArea.width = leftArea.width - innerLeftAreaMargin - innerLeftAreaMargin;
    innerLeftArea.height = leftArea.height - innerLeftAreaMargin - innerLeftAreaMargin - innerAreaVerticalSpace;

    const bubbleSelectorWidth = Math.round(innerLeftArea.width / 2);
    leftBubbleSelector.width = bubbleSelectorWidth;
    rightBubbleSelector.width = bubbleSelectorWidth;

    leftBubbleSelector.x = leftArea.x + Math.floor(leftArea.width / 2) - bubbleSelectorWidth;
    rightBubbleSelector.x = leftBubbleSelector.x + leftBubbleSelector.width;

    leftBubbleExtension.x = Math.round(leftBubbleSelector.x + (leftBubbleSelector.width / 2) - halfBubbleExtensionWidth);
    leftBubbleExtension.y = rightBubbleSelector.y + rightBubbleSelector.height;

    leftBubbleExtension.width = halfBubbleExtensionWidth + halfBubbleExtensionWidth;

    rightBubbleExtension.x = Math.round(rightBubbleSelector.x + (rightBubbleSelector.width / 2) - halfBubbleExtensionWidth);
    rightBubbleExtension.y = rightBubbleSelector.y + rightBubbleSelector.height;
    rightBubbleExtension.width = halfBubbleExtensionWidth + halfBubbleExtensionWidth;


    leftBubbleText.x = leftBubbleSelector.x + bubbleTextMargin;
    leftBubbleText.y = leftBubbleSelector.y + bubbleTextMargin;

    rightBubbleText.x = rightBubbleSelector.x + bubbleTextMargin;
    rightBubbleText.y = rightBubbleSelector.y + bubbleTextMargin;

    bubbleSelectorHitTest.x = leftBubbleSelector.x;

    bubbleSelectorHitTest.width = bubbleSelectorWidth + bubbleSelectorWidth;
}

function drawRectangle(rectangle,color) {
    context.fillStyle = color;
    context.fillRect(
        rectangle.x,rectangle.y,rectangle.width,rectangle.height
    );
}

function drawColoredRectangle(rectangle) {
    context.fillStyle = rectangle.color;
    context.fillRect(
        rectangle.x,rectangle.y,rectangle.width,rectangle.height
    );
}

function contains(x,y,r) {
    return x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height;
}

function CardScreenRenderer() {

    this.background = new CardBackground("backgrounds/card-test");

    this.sequencer = new CardSequencer();
    let viewingSelfCards = true;
    let viewTabLocked = false;

    this.verticalRenderMargin = 0;
    this.horizontalRenderMargin = defaultHorizontalRenderMargin;

    updateRenderElements();

    this.updateSize = function() {
        updateRenderElements();
    }

    this.processKey = function(key) {

    }

    this.setCardView = function(toPlayer) {
        viewingSelfCards = toPlayer;
    }

    this.lockCardView = function() {
        viewTabLocked = true;
    }
    this.unlockCardView = function() {
        viewTabLocked = false;
    }

    this.processClick = function(x,y) {
        if(!viewTabLocked && contains(x,y,bubbleSelectorHitTest)) {
            viewingSelfCards = !viewingSelfCards;
        }
    }

    this.processMove = function(x,y) {

    }

    let playerNameText = "you";
    let opponentNameText = "opponent";

    function renderStatic() {

        drawColoredRectangle(rightBar);
        drawColoredRectangle(innerRightBar);
        drawColoredRectangle(topBar);
        drawColoredRectangle(innerLeftArea);

        if(viewingSelfCards) {
            drawRectangle(leftBubbleSelector,"white");
            drawRectangle(rightBubbleSelector,"black");
            drawColoredRectangle(leftBubbleExtension);
            drawTextBlack(playerNameText,leftBubbleText.x,leftBubbleText.y,leftBubbleText.scale);
            drawTextWhite(opponentNameText,rightBubbleText.x,rightBubbleText.y,rightBubbleText.scale);
        } else {
            drawRectangle(leftBubbleSelector,"black");
            drawRectangle(rightBubbleSelector,"white");
            drawColoredRectangle(rightBubbleExtension);
            drawTextWhite(playerNameText,leftBubbleText.x,leftBubbleText.y,leftBubbleText.scale);
            drawTextBlack(opponentNameText,rightBubbleText.x,rightBubbleText.y,rightBubbleText.scale);
        }
    }


    this.render = function(timestamp) {

        
        this.background.render(timestamp);

        renderStatic();


    }
}
