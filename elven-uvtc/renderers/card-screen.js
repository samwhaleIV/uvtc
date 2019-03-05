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

const hoverPadding = 2.5;
const doubleHoverPadding = hoverPadding + hoverPadding; 

const flatHoverPadding = 2;
const flatDoubleHoverPadding = flatHoverPadding + flatHoverPadding;

const hoverColor = "white";

const bubbleSelectorHitTest = {};
bubbleSelectorHitTest.y = bubbleSelectorY;
bubbleSelectorHitTest.height = bubbleSelectorHeight;

const moveButtonHeight = 40;
const moveButtonMargin = 10;
const moveButtonColor = "black";
const moveButtonDisabledColor = "rgba(40,40,40,0.75)";
const moveButtonTextScale = TinyTextScale;
const moveButtonTextPadding = 5;

let moveButtonStartY;
let moveButtonTextY;
let moveButtonHoverY;
let moveButtonHoverHeight;

const maxMoveButtonRowButtons = 3;
const maxMoveButtonHitTests = 10;
const moveButtonHitTests = [];
const moveButtonRowSchemas = [];
(function(){
    for(let i = 0;i<maxMoveButtonHitTests;i++) {
        moveButtonHitTests[i] = [];
        for(let i2 = 0;i2<maxMoveButtonRowButtons;i2++) {
            moveButtonHitTests[i][i2] = [];
            for(let i3 = 0;i3<=i2;i3++) {
                moveButtonHitTests[i][i2].push({});
            }
        }
    }
    for(let i = 0;i<maxMoveButtonRowButtons;i++) {
        moveButtonRowSchemas[i] = [];
        for(let i2 = 0;i2<=i;i2++) {
            moveButtonRowSchemas[i].push({});
        }
    }
})();

const bubbleSelectorHover = {};
bubbleSelectorHover.color = "white";

const moveButtonSpecialHover = "rgb(30,30,30,30)";
const moveButtonSpecialHoverDisabled = "rgb(100,100,100)";

const rightBarWidthPercent = 0.35;

function updateRenderElements() {
    rightBar.x = fullWidth - Math.floor(fullWidth * rightBarWidthPercent);
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
    bubbleSelectorHitTest.width = leftBubbleSelector.width + rightBubbleSelector.width;

    moveButtonStartY = innerRightBar.y + moveButtonMargin;
    moveButtonTextY = moveButtonStartY + moveButtonTextPadding;
    moveButtonHoverHeight = moveButtonHeight + doubleHoverPadding;
    moveButtonHoverY = moveButtonStartY - hoverPadding;

    const s1 = moveButtonRowSchemas[0][0];
    s1.x = innerRightBar.x + moveButtonMargin;
    s1.width = innerRightBar.width - moveButtonMargin - moveButtonMargin;
    s1.hoverX = s1.x - hoverPadding;
    s1.hoverWidth = s1.width + doubleHoverPadding;
    s1.textX = s1.x + moveButtonTextPadding;

    //Todo s2
    const s2StartX = s1.x;
    const s2Width = Math.floor((s1.width-moveButtonMargin) / 2);
    let runningX = s2StartX;
    for(let i = 0;i<2;i++) {
        const s2 = moveButtonRowSchemas[1][i];
        s2.x = runningX;
        s2.width = s2Width;
        s2.hoverX = s2.x - hoverPadding;
        s2.hoverWidth = s2.width + doubleHoverPadding;
        s2.textX = s2.x + moveButtonTextPadding;
        runningX += s2.width + moveButtonMargin;
    }

    //Todo s3
    const s3StartX = s1.x;
    const s3Width = Math.floor((s1.width-moveButtonMargin*2) / 3);
    runningX = s3StartX;
    for(let i = 0;i<3;i++) {
        const s3 = moveButtonRowSchemas[2][i];
        s3.x = runningX;
        s3.width = s3Width;
        s3.hoverX = s3.x - hoverPadding;
        s3.hoverWidth = s3.width + doubleHoverPadding;
        s3.textX = s3.x + moveButtonTextPadding;
        runningX += s3.width + moveButtonMargin;
    }

    for(let i = 0;i<maxMoveButtonHitTests;i++) {
        for(let i2 = 0;i2 < maxMoveButtonRowButtons;i2++) {
            for(let i3 = 0;i3<=i2;i3++) {
                const schema = moveButtonRowSchemas[i2][i3];
                const button = moveButtonHitTests[i][i2][i3];
                button.x = schema.hoverX;
                button.y = moveButtonStartY + (moveButtonHeight + moveButtonMargin) * i;
                button.width = schema.width;
                button.height = moveButtonHeight;
            }
        }
    }

    bubbleSelectorHover.x = bubbleSelectorHitTest.x - hoverPadding;
    bubbleSelectorHover.y = bubbleSelectorHitTest.y - hoverPadding;
    bubbleSelectorHover.width = bubbleSelectorHitTest.width + doubleHoverPadding;
    bubbleSelectorHover.height = bubbleSelectorHitTest.height + doubleHoverPadding;
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

function renderButtonRow(buttonRow,index,withHover,hoverIndex,specialHover) {
    const yPosition = index * (moveButtonHeight + moveButtonMargin);

    for(let i = 0;i<buttonRow.length;i++) {

        const buttonSchema = moveButtonRowSchemas[buttonRow.length-1][i];
        const button = buttonRow[i];

        if(button.isNotAButton) {
            drawTextWhite(button.text,buttonSchema.textX,moveButtonTextY+yPosition,SmallTextScale);
            continue;
        }

        isHover = withHover && button.index === hoverIndex;

        if(isHover) {
            context.fillStyle = hoverColor;
            context.fillRect(buttonSchema.hoverX,moveButtonHoverY+yPosition,buttonSchema.hoverWidth,moveButtonHoverHeight);
        }
    
        context.fillStyle =
            button.enabled ? isHover && specialHover ? moveButtonSpecialHover : moveButtonColor :
            isHover && specialHover ? moveButtonSpecialHoverDisabled : moveButtonDisabledColor;
    
        context.fillRect(
            buttonSchema.x,moveButtonStartY+yPosition,buttonSchema.width,moveButtonHeight
        );
        drawTextWhite(button.text,buttonSchema.textX,moveButtonTextY+yPosition,moveButtonTextScale);


    }
}
function renderButtonRows(sequencer,withHover,hoverIndex,specialHover) {
    let i = 0;
    while(i < sequencer.buttonRows.length) {
        renderButtonRow(sequencer.buttonRows[i],i,withHover,hoverIndex,specialHover);
        i++;
    }
}

const hoverTypes = {
    none: Symbol(),
    moveButtons: Symbol(),
    bubbleSelector: Symbol()
}

const defaultHoverIndex = -1;

function CardScreenRenderer() {

    const background = new CardBackground("backgrounds/card-test");

    this.sequencer = new CardSequencer();
    let viewingSelfCards = true;
    let viewTabLocked = false;

    this.verticalRenderMargin = 0;
    this.horizontalRenderMargin = 150;

    let hoverType = hoverTypes.none;
    let hoverIndex = defaultHoverIndex;
    let showHoverSpecialEffect = false;

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
        if(hoverIndex >= 0) {
            showHoverSpecialEffect = true;
        }
    }

    this.processClickEnd = function(x,y) {
        if(!viewTabLocked && contains(x,y,bubbleSelectorHitTest)) {
            viewingSelfCards = !viewingSelfCards;
        }
        showHoverSpecialEffect = false;
    }

    this.processMove = function(mouseX,mouseY) {
        if(contains(mouseX,mouseY,innerRightBar)) {
            const end = Math.min(this.sequencer.buttonRows.length,maxMoveButtonHitTests);
            for(let i = 0;i<end;i++) {
                if(contains(mouseX,mouseY,moveButtonHitTests[i][0][0])) {
                    const row = this.sequencer.buttonRows[i];
                    for(let x = 0;x<row.length;x++) {
                        const rowButton = row[x];
                        const buttonRegion = moveButtonHitTests[i][row.length-1][x];
                        if(contains(mouseX,mouseY,buttonRegion)) {
                            hoverType = hoverTypes.moveButtons;
                            hoverIndex = rowButton.index;
                            return;
                        }
                    }
                }
            }
        } else {
            if(contains(mouseX,mouseY,bubbleSelectorHitTest)) {
                hoverType = hoverTypes.bubbleSelector;
                hoverIndex = 0;
                return;
            }
        }
        hoverType = hoverTypes.none;
        hoverIndex = defaultHoverIndex;
    }

    let playerNameText = "you";
    let opponentNameText = "opponent";

    function renderStatic() {

        drawColoredRectangle(rightBar);
        drawColoredRectangle(innerRightBar);
        drawColoredRectangle(topBar);
        drawColoredRectangle(innerLeftArea);

        if(hoverType === hoverTypes.bubbleSelector) {
            //drawColoredRectangle(bubbleSelectorHover);
        }

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
        background.render(timestamp);

        renderStatic();
        renderButtonRows(this.sequencer,hoverType === hoverTypes.moveButtons,hoverIndex,showHoverSpecialEffect);

        renderCard(allCardSeries[0][0],innerLeftArea.x+10,innerLeftArea.y+10,48*4,(64*4)/2,true);
    }
}
