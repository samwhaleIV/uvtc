const rightBar = {};
rightBar.y = 0;
rightBar.color = "rgba(255,255,255,0.5)";

const innerRightBarMargin = 5;
const innerRightBar = {};
innerRightBar.color = "rgba(0,0,0,0.5)";

const leftArea = {};
leftArea.x = 0;
leftArea.y = 0;
leftArea.color = "rgba(128,128,128,0.7)";

const innerLeftAreaMargin = 15;
const innerAreaVerticalSpace = 105;
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

const flatHoverPadding = Math.floor(hoverPadding);
const flatDoubleHoverPadding = flatHoverPadding + flatHoverPadding;

const hoverColor = "darkorange";

const bubbleSelectorHitTest = {};
bubbleSelectorHitTest.y = bubbleSelectorY;
bubbleSelectorHitTest.height = bubbleSelectorHeight;

const moveButtonHeight = 36;
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
const maxMoveButtonHitTests = 11;
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

const rightBarWidthPercent = 0.25;

const collapsedInnerLeftAreaWidth = 70;
const textFeed = {};
textFeed.color = "rgba(0,0,0,0.85)";

const rightTableCycleButton = {};
const leftTableCycleButton = {};
rightTableCycleButton.text = "next";
leftTableCycleButton.text = "back";
const tableCycleButtonTextScale = 2;

const tableCycleButtonWidth = 100;
const tableCycleButtonHeight = 30;
const doubleTableCycleButtonWidth = tableCycleButtonWidth + tableCycleButtonWidth;
rightTableCycleButton.width = tableCycleButtonWidth;
leftTableCycleButton.width = tableCycleButtonWidth;
rightTableCycleButton.height = tableCycleButtonHeight;
leftTableCycleButton.height = tableCycleButtonHeight;


const textFeedToggleButton = {};
textFeedToggleButton.text = "text feed";
textFeedToggleButton.enabled = true;
textFeedToggleButton.width = leftTableCycleButton.width;
textFeedToggleButton.height = leftTableCycleButton.height;
const fullScreenCardMargin = 15;

(function(){
    let textTestResult = drawTextTest(rightTableCycleButton.text,tableCycleButtonTextScale);
    rightTableCycleButton.textXOffset = Math.floor((tableCycleButtonWidth / 2) - (textTestResult.width / 2));
    rightTableCycleButton.textYOffset = Math.floor((tableCycleButtonHeight / 2) - (textTestResult.height / 2));

    textTestResult = drawTextTest(leftTableCycleButton.text,tableCycleButtonTextScale);
    leftTableCycleButton.textXOffset = Math.floor((tableCycleButtonWidth / 2) - (textTestResult.width / 2));
    leftTableCycleButton.textYOffset = Math.floor((tableCycleButtonHeight / 2) - (textTestResult.height / 2));

    textTestResult = drawTextTest(textFeedToggleButton.text,tableCycleButtonTextScale);
    textFeedToggleButton.textXOffset = Math.floor((textFeedToggleButton.width / 2) - (textTestResult.width / 2));
    textFeedToggleButton.textYOffset = Math.floor((textFeedToggleButton.height / 2) - (textTestResult.height / 2));
})();

rightTableCycleButton.color = "black";
leftTableCycleButton.color = "black";

leftTableCycleButton.hoverWidth = leftTableCycleButton.width + doubleHoverPadding;
leftTableCycleButton.hoverHeight = leftTableCycleButton.height + doubleHoverPadding;

rightTableCycleButton.hoverWidth = rightTableCycleButton.width + doubleHoverPadding;
rightTableCycleButton.hoverHeight = rightTableCycleButton.height + doubleHoverPadding;


const pageTitleBlock = {};
pageTitleBlock.color = "black";
pageTitleBlock.height = leftTableCycleButton.height;
pageTitleBlock.textScale = moveButtonTextScale;

const fullScreenCard = {};
const fullScreenCardArea = {};

const buttonRowImage = {};
const buttonRowImageMargin = 2;
buttonRowImage.width = 32;
buttonRowImage.height = 32;

leftBubbleSelector.x = innerLeftAreaMargin;

const leftStatusX = innerLeftAreaMargin;
let rightStatusX;
const statusWidth = 64;
const statusHeight = 64;
const statusY = innerLeftAreaMargin + bubbleSelectorHeight;

const handDisplayHeightRatio = 144 / 128 - 0.1;
const handDisplayWidthRatio = 128 / 144 + 0.1;
const handDisplaySlots = [];

const handPageHitTest = {};

function updateRenderElements() {
    rightBar.x = fullWidth - Math.floor(fullWidth * rightBarWidthPercent);
    rightBar.width = fullWidth - rightBar.x;
    rightBar.height = fullHeight;

    innerRightBar.x = rightBar.x + innerRightBarMargin;
    innerRightBar.y = rightBar.y + innerRightBarMargin;

    innerRightBar.width = rightBar.width - innerRightBarMargin - innerRightBarMargin;
    innerRightBar.height = rightBar.height - innerRightBarMargin - innerRightBarMargin;

    leftArea.height = fullHeight;
    leftArea.width = rightBar.x;

    innerLeftArea.x = leftArea.x + innerLeftAreaMargin;
    innerLeftArea.width = leftArea.width - innerLeftAreaMargin - innerLeftAreaMargin;

    innerLeftArea.y = leftArea.y + innerLeftAreaMargin + innerAreaVerticalSpace;

    innerLeftArea.fullHeight = (leftArea.y + leftArea.height - innerLeftAreaMargin) - innerLeftArea.y;

    innerLeftArea.height = collapsedInnerLeftAreaWidth;
    textFeed.height = innerLeftArea.fullHeight - innerLeftArea.height;
    textFeed.y = innerLeftArea.y + innerLeftArea.height;

    textFeedToggleButton.y = textFeed.y - textFeedToggleButton.height;
    textFeedToggleButton.collapsedY = innerLeftArea.y + innerLeftArea.fullHeight - textFeedToggleButton.height;

    textFeed.width = innerLeftArea.width;
    textFeed.x = innerLeftArea.x;

    leftTableCycleButton.x = innerLeftArea.x + innerRightBarMargin;
    leftTableCycleButton.y = innerLeftArea.y + innerRightBarMargin;

    leftTableCycleButton.textX = leftTableCycleButton.x + leftTableCycleButton.textXOffset;
    leftTableCycleButton.textY = leftTableCycleButton.y + leftTableCycleButton.textYOffset;

    rightTableCycleButton.x = ((innerLeftArea.x + innerLeftArea.width) - rightTableCycleButton.width)-innerRightBarMargin;
    rightTableCycleButton.y = leftTableCycleButton.y

    leftTableCycleButton.hoverX = leftTableCycleButton.x - hoverPadding;
    leftTableCycleButton.hoverY = leftTableCycleButton.y - hoverPadding;

    rightTableCycleButton.hoverX = rightTableCycleButton.x - hoverPadding;
    rightTableCycleButton.hoverY = rightTableCycleButton.y - hoverPadding;
    
    rightTableCycleButton.textX = rightTableCycleButton.x + rightTableCycleButton.textXOffset;
    rightTableCycleButton.textY = rightTableCycleButton.y + rightTableCycleButton.textYOffset;

    textFeedToggleButton.x = innerLeftArea.x;
    textFeedToggleButton.textX = textFeedToggleButton.x + textFeedToggleButton.textXOffset;

    textFeedToggleButton.textY = textFeedToggleButton.y + textFeedToggleButton.textYOffset;

    textFeedToggleButton.collapsedTextY = textFeedToggleButton.collapsedY + textFeedToggleButton.textYOffset;

    pageTitleBlock.y = leftTableCycleButton.y;
    pageTitleBlock.x = leftTableCycleButton.x + leftTableCycleButton.width + innerRightBarMargin;
    pageTitleBlock.width = rightTableCycleButton.x - innerRightBarMargin - pageTitleBlock.x;

    pageTitleBlock.textX = pageTitleBlock.x + Math.floor(pageTitleBlock.width/2);
    pageTitleBlock.textY = pageTitleBlock.y + Math.floor(pageTitleBlock.height/2);

    const bubbleSelectorWidth = Math.round(innerLeftArea.width / 2);
    leftBubbleSelector.width = bubbleSelectorWidth;
    rightBubbleSelector.width = bubbleSelectorWidth;

    rightBubbleSelector.x = leftBubbleSelector.x + leftBubbleSelector.width;

    rightStatusX = rightBubbleSelector.x;

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

    buttonRowImage.x = Math.floor(s1.x + s1.width - buttonRowImage.width - 0.5) - buttonRowImageMargin;
    buttonRowImage.yOffset = moveButtonStartY + buttonRowImageMargin;

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


    fullScreenCardArea.x = leftTableCycleButton.x + fullScreenCardMargin;
    fullScreenCardArea.y = leftTableCycleButton.y + leftTableCycleButton.height + fullScreenCardMargin;

    fullScreenCardArea.right = rightTableCycleButton.x + rightTableCycleButton.width - fullScreenCardMargin;
    fullScreenCardArea.bottom = textFeedToggleButton.collapsedY - fullScreenCardMargin;
    
    fullScreenCardArea.width = fullScreenCardArea.right - fullScreenCardArea.x;
    fullScreenCardArea.height = fullScreenCardArea.bottom - fullScreenCardArea.y;


    if(fullScreenCardArea.width / fullScreenCardArea.height > internalCardWidthRatio) {
        fullScreenCard.y = fullScreenCardArea.y;
        fullScreenCard.width = Math.floor(fullScreenCardArea.height * internalCardWidthRatio);
        fullScreenCard.height = fullScreenCardArea.height;
        fullScreenCard.x = fullScreenCardArea.x + Math.floor((fullScreenCardArea.width / 2) - (fullScreenCard.width / 2));
    } else {
        fullScreenCard.x = fullScreenCardArea.x;
        fullScreenCard.height = Math.floor(fullScreenCardArea.width * internalCardHeightRatio);
        fullScreenCard.width = fullScreenCardArea.width;
        fullScreenCard.y = fullScreenCardArea.y + Math.floor((fullScreenCardArea.height / 2) - (fullScreenCard.height / 2));
    }

    let handCardHeight, handCardWidth, xStart, yStart;

    if(fullScreenCardArea.width / fullScreenCardArea.height > handDisplayWidthRatio) {//height is smallest
        const fullHandCardHeight = fullScreenCardArea.height;
        const fullHandCardWidth = fullScreenCardArea.height * handDisplayHeightRatio;

        xStart = fullScreenCardArea.x + Math.floor((fullScreenCardArea.width / 2) - (fullHandCardWidth / 2));
        yStart = fullScreenCardArea.y;

        
        handCardHeight = fullHandCardHeight / 2;
        handCardWidth = fullHandCardWidth / 3;

        handPageHitTest.width = fullHandCardWidth;
        handPageHitTest.height = fullHandCardHeight;

    } else {
        const fullHandCardWidth = fullScreenCardArea.width;
        const fullHandCardHeight = fullScreenCardArea.width * handDisplayWidthRatio;

        yStart = fullScreenCardArea.y + Math.floor((fullScreenCardArea.height / 2) - (fullHandCardHeight / 2));
        xStart = fullScreenCardArea.x;

        
        handCardHeight = fullHandCardHeight / 2;
        handCardWidth = fullHandCardWidth / 3;

        handPageHitTest.width = fullHandCardWidth;
        handPageHitTest.height = fullHandCardHeight;

    }

    handPageHitTest.x = xStart;
    handPageHitTest.y = yStart;

    handCardHeight = Math.floor(handCardHeight - fullScreenCardMargin);
    handCardWidth = Math.floor(handCardWidth - 10);

    for(let x = 0;x<3;x++) {
        for(let y = 0;y<2;y++) {
            handDisplaySlots[x+(y*3)] = {
                width: handCardWidth,
                height: handCardHeight,
                x: xStart + x * (handCardWidth + fullScreenCardMargin),
                y: yStart + y * (handCardHeight + fullScreenCardMargin)
            }
        }
    }

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
function areaContains(x,y,rx,ry,rw,rh) {
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
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
    
        context.fillStyle = getButtonForegroundColor(isHover,specialHover,button.enabled);
    
        context.fillRect(
            buttonSchema.x,moveButtonStartY+yPosition,buttonSchema.width,moveButtonHeight
        );


        drawTextWhite(button.text,buttonSchema.textX,moveButtonTextY+yPosition,moveButtonTextScale);

        if(button.image) {
            context.drawImage(
                imageDictionary["ui/card-icons"],
                (button.image-1)*32,0,32,32,
                buttonRowImage.x,
                yPosition + buttonRowImage.yOffset,
                buttonRowImage.width,
                buttonRowImage.height
            );
        }
    }
}
function renderButtonRows(sequencer,withHover,hoverIndex,specialHover) {
    let i = 0;
    while(i < sequencer.buttonRows.length) {
        renderButtonRow(sequencer.buttonRows[i],i,withHover,hoverIndex,specialHover);
        i++;
    }
}

function getButtonForegroundColor(hover,specialHover,enabled) {
    if(hover) {
        if(enabled) {
            if(specialHover) {
                return moveButtonSpecialHover;
            } else {
                return moveButtonColor;
            }
        } else {
            if(specialHover) {
                return moveButtonSpecialHoverDisabled;
            } else {
                return moveButtonDisabledColor;
            }
        }
    } else {
        if(enabled) {
            return moveButtonColor;
        } else {
            return moveButtonDisabledColor;
        }
    }
}

const hoverTypes = {
    none: Symbol("none"),
    moveButtons: Symbol("moveButtons"),
    bubbleSelector: Symbol("bubbleSelector"),
    cycleButtons: Symbol("cycleButtons"),
    textFeedToggleButton: Symbol("textFeedToggleButton"),
    fullScreenCard: Symbol("fullScreenCard"),
    handPageCard: Symbol("handPageCard")
}

const defaultHoverIndex = -1;

function CardScreenRenderer() {

    const background = new CardBackground("backgrounds/card-test");

    this.sequencer = new CardSequencer(this);
    let viewingSelfCards = true;
    let viewTabLocked = false;

    let hoverType = hoverTypes.none;
    let hoverIndex = defaultHoverIndex;
    let showHoverSpecialEffect = false;

    let textFeedShown = false;

    textFeedToggleButton.enabled = true;

    let pageCycleEnabled = true;
    let fullScreenCardLocked = false;

    updateRenderElements();

    this.updateSize = function() {
        updateRenderElements();
    }

    let toggleTextFeedTimeout = 150;
    let lastToggleTextSwap = 0;

    this.processKey = function(key) {//todo add player-opn. pane toggling
        switch(key) {
            case "Space":
                if(textFeedToggleButton.enabled) {
                    const now = performance.now()
                    if(now >= lastToggleTextSwap) {
                        if(textFeedShown) {
                            this.hideTextFeed();
                        } else {
                            this.showTextFeed();
                        }
                        lastToggleTextSwap = now + toggleTextFeedTimeout;
                    }
                }
                break;
            case "Escape":
                if(textFeedShown && textFeedToggleButton.enabled) {
                    this.hideTextFeed();
                } else if(this.sequencer.fullScreenCard && !fullScreenCardLocked) {
                    this.sequencer.hideFullScreenCard(true);
                    if(hoverType === hoverTypes.fullScreenCard) {
                        hoverType = hoverTypes.none;
                        hoverIndex = defaultHoverIndex;
                    }
                } else {
                    //TODO: Open escape menu
                }
                break;
        }
    }
    this.processKeyUp = function(key) {
        switch(key) {
            case "Space":
                lastToggleTextSwap = performance.now();
                break;
        }
    }

    this.lockViewTab = function() {
        viewTabLocked = true;
    }
    this.unlockViewTab = function() {
        viewTabLocked = false;
    }

    this.processClick = function(x,y) {
        this.processMove(x,y);
        if(hoverIndex >= 0) {
            showHoverSpecialEffect = true;
        }
    }

    this.lockTextFeedToggle = function() {
        textFeedToggleButton.enabled = false;
    }
    this.unlockTextFeedToggle = function() {
        textFeedToggleButton.enabled = true;
    }

    this.showTextFeed = function() {
        textFeedShown = true;

    }
    this.hideTextFeed = function() {
        textFeedShown = false;
    }

    this.lockPageCycle = function() {
        pageCycleEnabled = false;
    }
    this.unlockPageCycle = function() {
        pageCycleEnabled = true;
    }


    this.lockFullScreenCardEscape = function() {
        fullScreenCardLocked = true;
    }
    this.unlockFullScreenCardEscape = function() {
        fullScreenCardLocked = false;
    }

    this.textFeedToggleIsHitRegistered = function(x,y) {
        return areaContains(x,y,
            textFeedToggleButton.x,
            textFeedShown ? textFeedToggleButton.y : textFeedToggleButton.collapsedY,
            textFeedToggleButton.width,
            textFeedToggleButton.height
        ) || textFeedShown && contains(x,y,textFeed);
    }

    this.processClickEnd = function(x,y) {
        showHoverSpecialEffect = false;
        switch(hoverType) {
            case hoverTypes.fullScreenCard:
                if(!fullScreenCardLocked) {
                    this.sequencer.hideFullScreenCard(true);
                    hoverType = hoverTypes.none;
                    hoverIndex = defaultHoverIndex;
                }
                break;
            case hoverTypes.textFeedToggleButton:
                if(textFeedToggleButton.enabled) {
                    if(textFeedShown) {
                        this.hideTextFeed();
                        if(!areaContains(x,y,
                            textFeedToggleButton.x,
                            textFeedShown ? textFeedToggleButton.y : textFeedToggleButton.collapsedY,
                            textFeedToggleButton.width,
                            textFeedToggleButton.height
                        )) {
                            hoverType = hoverTypes.none;
                            hoverIndex = defaultHoverIndex;
                        }
                    } else {
                        this.showTextFeed();
                    }
                }
                break;
            case hoverTypes.bubbleSelector:
                if(!viewTabLocked) {
                    this.sequencer.switchedPanes();
                }
                break;
            case hoverTypes.cycleButtons:
                if(hoverIndex) {
                    this.sequencer.activatePreviousPage();
                } else {
                    this.sequencer.activateNextPage();
                }
                break;
            case hoverTypes.moveButtons:
                if(this.sequencer.buttonLookup[hoverIndex].enabled) {
                    this.sequencer.activateActionButton(hoverIndex);
                }
                break;
            case hoverTypes.handPageCard:
                this.sequencer.handCardClicked(hoverIndex);
                //hoverType = hoverTypes.none;
                //hoverIndex = defaultHoverIndex;
                break;
        }
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
            if(!textFeedShown && this.sequencer.fullScreenCard && contains(mouseX,mouseY,fullScreenCard)) {
                hoverType = hoverTypes.fullScreenCard;
                hoverIndex = 0;
                return;
            } else if(contains(mouseX,mouseY,bubbleSelectorHitTest)) {
                hoverType = hoverTypes.bubbleSelector;
                hoverIndex = 0;
                return;
            } else if(contains(mouseX,mouseY,leftTableCycleButton)) {
                hoverType = hoverTypes.cycleButtons;
                hoverIndex = 0;
                return;
            } else if(contains(mouseX,mouseY,rightTableCycleButton)) {
                hoverType = hoverTypes.cycleButtons;
                hoverIndex = 1;
                return;
            } else if(this.textFeedToggleIsHitRegistered(mouseX,mouseY)) {
                hoverType = hoverTypes.textFeedToggleButton;
                hoverIndex = 0;
                return;
            } else if(this.sequencer.cardPageType === cardPageTypes.hand && contains(mouseX,mouseY,handPageHitTest)) {
                for(let i = 0;i<handDisplaySlots.length;i++) {
                    if(contains(mouseX,mouseY,handDisplaySlots[i])) {
                        hoverType = hoverTypes.handPageCard;
                        hoverIndex = i;
                        return;
                    }
                }
            }
        }
        hoverType = hoverTypes.none;
        hoverIndex = defaultHoverIndex;
    }

    let playerNameText = "you";
    let opponentNameText = "opponent";

    this.renderStatusIcons = function() {
        context.drawImage(
            imageDictionary["ui/status-roll"],
            this.sequencer.playerState.health*32,0,32,32,
            leftStatusX,
            statusY,
            statusWidth,
            statusHeight
        );
        context.drawImage(
            imageDictionary["ui/status-roll"],
            this.sequencer.playerState.energy*32,32,32,32,
            leftStatusX+statusWidth,
            statusY,
            statusWidth,
            statusHeight
        );
        context.drawImage(
            imageDictionary["ui/status-roll"],
            this.sequencer.opponentState.health*32,0,32,32,
            rightStatusX,
            statusY,
            statusWidth,
            statusHeight
        );
        context.drawImage(
            imageDictionary["ui/status-roll"],
            this.sequencer.opponentState.energy*32,32,32,32,
            rightStatusX+statusWidth,
            statusY,
            statusWidth,
            statusHeight
        );
    }

    this.render = function(timestamp) {
        background.render(timestamp);

        drawColoredRectangle(rightBar);
        drawColoredRectangle(innerRightBar);

        if(textFeedShown) {
            drawColoredRectangle(innerLeftArea);
            drawColoredRectangle(textFeed);
            drawRectangle(
                textFeedToggleButton,
                getButtonForegroundColor(
                    hoverType===hoverTypes.textFeedToggleButton,
                    showHoverSpecialEffect,
                    textFeedToggleButton.enabled
                )
            );
            drawTextWhite(textFeedToggleButton.text,textFeedToggleButton.textX,textFeedToggleButton.textY,moveButtonTextScale);
        } else {
            context.fillStyle = innerLeftArea.color;
            context.fillRect(
                innerLeftArea.x,innerLeftArea.y,
                innerLeftArea.width,innerLeftArea.fullHeight
            );
            context.fillStyle = getButtonForegroundColor(
                hoverType===hoverTypes.textFeedToggleButton,
                showHoverSpecialEffect,
                textFeedToggleButton.enabled
            );
            context.fillRect(
                textFeedToggleButton.x,
                textFeedToggleButton.collapsedY,
                textFeedToggleButton.width,
                textFeedToggleButton.height
            );
            drawTextWhite(textFeedToggleButton.text,textFeedToggleButton.textX,textFeedToggleButton.collapsedTextY,moveButtonTextScale);

            if(this.sequencer.fullScreenCard) {
                renderCardFullScreen(
                    this.sequencer.fullScreenCard,
                    fullScreenCard.x,fullScreenCard.y,
                    fullScreenCard.width,fullScreenCard.height,
                );
            } else {
                switch(this.sequencer.cardPageType) {
                    case cardPageTypes.field:
                        //TODO
                        break;
                    case cardPageTypes.slots:
                        //TODO
                        break;
                    case cardPageTypes.hand:
                        let handCardIndex = 0;
                        while(handCardIndex < this.sequencer.cardPageRenderData.length) {
                            const handCard = handDisplaySlots[handCardIndex]
                            renderCard(
                                this.sequencer.cardPageRenderData[handCardIndex],
                                handCard.x,
                                handCard.y,
                                handCard.width,
                                handCard.height
                            );
                            handCardIndex++;
                        }
                        //TODO
                        break;
                }
            }
        }

        drawTextBlack(
            this.sequencer.cardPageText,
            pageTitleBlock.textX+this.sequencer.cardPageTextXOffset,
            pageTitleBlock.textY+this.sequencer.cardPageTextYOffset,
            this.sequencer.cardPageTextScale
        );

        if(hoverType === hoverTypes.cycleButtons) {
            if(hoverIndex === 0) {
                context.fillStyle = hoverColor;
                context.fillRect(
                    leftTableCycleButton.hoverX,leftTableCycleButton.hoverY,
                    leftTableCycleButton.hoverWidth,leftTableCycleButton.hoverHeight
                );
                drawRectangle(leftTableCycleButton,getButtonForegroundColor(
                    true,showHoverSpecialEffect,pageCycleEnabled
                ));
                drawRectangle(rightTableCycleButton,getButtonForegroundColor(
                    false,showHoverSpecialEffect,pageCycleEnabled
                ));
            } else {
                context.fillStyle = hoverColor;
                context.fillRect(
                    rightTableCycleButton.hoverX,rightTableCycleButton.hoverY,
                    rightTableCycleButton.hoverWidth,rightTableCycleButton.hoverHeight
                );
                drawRectangle(rightTableCycleButton,getButtonForegroundColor(
                    true,showHoverSpecialEffect,pageCycleEnabled
                ));
                drawRectangle(leftTableCycleButton,getButtonForegroundColor(
                    false,showHoverSpecialEffect,pageCycleEnabled
                ));
            }
        } else {
            drawRectangle(leftTableCycleButton,getButtonForegroundColor(
                false,showHoverSpecialEffect,pageCycleEnabled
            ));
            drawRectangle(rightTableCycleButton,getButtonForegroundColor(
                false,showHoverSpecialEffect,pageCycleEnabled
            ));
        }

        drawTextWhite(leftTableCycleButton.text,leftTableCycleButton.textX,leftTableCycleButton.textY,tableCycleButtonTextScale);
        drawTextWhite(rightTableCycleButton.text,rightTableCycleButton.textX,rightTableCycleButton.textY,tableCycleButtonTextScale);

        if(hoverType === hoverTypes.bubbleSelector) {
            //Todo this maybe?
        }

        if(this.sequencer.viewingSelfCards) {
            drawRectangle(leftBubbleSelector,"white");
            drawRectangle(rightBubbleSelector,"black");
            drawTextBlack(playerNameText,leftBubbleText.x,leftBubbleText.y,leftBubbleText.scale);
            drawTextWhite(opponentNameText,rightBubbleText.x,rightBubbleText.y,rightBubbleText.scale);
        } else {
            drawRectangle(leftBubbleSelector,"black");
            drawRectangle(rightBubbleSelector,"white");
            drawTextWhite(playerNameText,leftBubbleText.x,leftBubbleText.y,leftBubbleText.scale);
            drawTextBlack(opponentNameText,rightBubbleText.x,rightBubbleText.y,rightBubbleText.scale);
        }

        this.renderStatusIcons();

        renderButtonRows(this.sequencer,hoverType === hoverTypes.moveButtons,hoverIndex,showHoverSpecialEffect);
    }
}
