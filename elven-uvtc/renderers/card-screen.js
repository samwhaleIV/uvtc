function CardScreenRenderer(sequencer,callbacks,background) {
    const handDisplayHeightRatio = 144 / 128;
    const handDisplayWidthRatio = 128 / 144;

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
    innerLeftArea.color = "rgba(30,30,30,0.8)";

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

    const bubbleSelectorHitTest = {};
    bubbleSelectorHitTest.y = bubbleSelectorY;
    bubbleSelectorHitTest.height = bubbleSelectorHeight;

    const moveButtonHeight = 36;
    const moveButtonMargin = 10;
    const moveButtonColor = "black";
    const moveButtonDisabledColor = "rgba(40,40,40,0.4)";
    const moveButtonTextScale = TinyTextScale;
    const moveButtonTextPadding = 5;

    let moveButtonStartY;
    let moveButtonTextY;
    let moveButtonHoverY;
    let moveButtonHoverHeight;

    const maxMoveButtonRowButtons = 3;
    const maxMoveButtonHitTests = 12;
    const moveButtonHitTests = [];
    const moveButtonRowSchemas = [];

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

    const bubbleSelectorHover = {};
    bubbleSelectorHover.color = "white";

    const moveButtonSpecialHover = "rgb(80,80,80,0.5)";
    const moveButtonSpecialHoverDisabled = "rgb(100,100,100)";
    const moveButtonHoverColor = "rgb(80,80,80,0.7)";

    const rightBarWidthPercent = 0.25;

    const collapsedInnerLeftAreaWidth = 70;
    const textFeed = {};
    textFeed.color = "white";

    const rightTableCycleButton = {};
    const leftTableCycleButton = {};
    rightTableCycleButton.text = "next";
    leftTableCycleButton.text = "back";
    const tableCycleButtonTextScale = 2;

    const tableCycleButtonWidth = 120;
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

    const fieldBackgroundColor = "rgba(81,81,81,0.78)";

    let innerLeftAreaFirstRowHeight;
    let innerLeftAreaSecondRowHeight;
    let innerLeftAreaThirdRowHeight;

    let innerLeftAreaFirstRowY
    let innerLeftAreaSecondRowY;
    let innerLeftAreaThirdRowY;

    const textFeedWidth = 400;
    const textFeedTextXOffset = 0;

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

    const fullScreenCard = {hoverEffect:{}};
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

    const handDisplaySlots = [];
    for(let i = 0;i<6;i++) {
        handDisplaySlots[i] = {
            hoverEffect:{}
        }
    }


    const nextButton = {
        area: {},
        hover: {},
        text: "continue",
        textXOffset: undefined
    }
    nextButton.textXOffset = Math.floor(drawTextTest(nextButton.text,tableCycleButtonTextScale).width/2);

    const handPageHitTest = {};
    const slotsDisplaySlots = [];
    (function(){
        for(let i = 0;i<3;i++) {
            let text;
            switch(i) {
                case 0:
                    text = "defense";
                    break;
                case 1:
                    text = "attack";
                    break;
                case 2:
                    text = "special";
                    break;
            }
            const textDrawTestResult = drawTextTest(text,2);

            slotsDisplaySlots[i] = {
                icon: {},
                card: {},
                hover: {},
                text: text,
                iconTextWidth: textDrawTestResult.width,
                iconTextHeight: textDrawTestResult.height,
                iconTextX: undefined,
                iconTextY: undefined,
                iconTextScale: 2
            }
        }
    })();

    const fullScreenStatusIcon = {hover:{}};
    const statusIconFullArea = {};
    const statusIcons = [];
    let fieldIconTextY;
    let conditionsTextY;
    let conditionsTextX;
    const statusIconWidthRatio = 2 / 5;
    const statusIconHeightRatio = 5 / 2;
    for(let i = 0;i<10;i++) {
        statusIcons[i] = {
            hover: {}
        };
    }

    const noCardsText = "no cards in hand :(";
    const noCardsTextScale = 5;
    let noCardsTextXOffset;
    let noCardsTextYOffset;
    let noCardsTextX;
    let noCardsTextY;
    (function(){
        const t1 = drawTextTest(noCardsText,noCardsTextScale);
        noCardsTextXOffset = Math.floor(t1.width/2);
        noCardsTextYOffset = Math.floor(t1.height/2);
    })();

    this.updateSize = function() {
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

        const maxWidth = textFeed.width - 100;
        const innerTextWidth = textFeedWidth > maxWidth ? maxWidth : textFeedWidth;

        textFeed.textX = textFeed.x + Math.floor((textFeed.width/2) - (innerTextWidth / 2));
        textFeed.textY = textFeed.y + 20;
        textFeed.maxTextWidth = innerTextWidth;

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
        buttonRowImage.yOffset = Math.floor(moveButtonStartY + buttonRowImageMargin);

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


        innerLeftAreaFirstRowHeight = fullScreenCardArea.y - innerLeftArea.y;
        innerLeftAreaSecondRowHeight = innerLeftArea.fullHeight - innerLeftAreaFirstRowHeight - innerLeftAreaFirstRowHeight;
        innerLeftAreaThirdRowHeight = innerLeftAreaFirstRowHeight;

        innerLeftAreaFirstRowY = innerLeftArea.y;
        innerLeftAreaSecondRowY = innerLeftAreaFirstRowY + innerLeftAreaFirstRowHeight;
        innerLeftAreaThirdRowY = innerLeftAreaSecondRowY + innerLeftAreaSecondRowHeight;

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

        fullScreenCard.hoverEffect.x = fullScreenCard.x - hoverPadding;
        fullScreenCard.hoverEffect.y = fullScreenCard.y - hoverPadding;
        fullScreenCard.hoverEffect.width = fullScreenCard.width + doubleHoverPadding;
        fullScreenCard.hoverEffect.height = fullScreenCard.height + doubleHoverPadding;

        let handCardHeight, handCardWidth, xStart, yStart;

        //This is awful and we did far far far better in the card book - but this is a legacy piece of garbage that might not be worth refactoring for all extensive purposes of sanity;
        if(fullScreenCardArea.width / fullScreenCardArea.height > handDisplayHeightRatio) {
            const fullHandCardHeight = fullScreenCardArea.height - 20;
            
            handCardHeight = fullHandCardHeight / 2;
            handCardWidth = handCardHeight * (48 / 64);

            xStart = fullScreenCardArea.x + Math.floor((fullScreenCardArea.width / 2) - ((((handCardWidth+fullScreenCardMargin)*3))/2)) + fullScreenCardMargin + 5;
            yStart = fullScreenCardArea.y - 5;

            
            handCardHeight = (fullHandCardHeight / 2) - 10;
            handCardWidth = handCardHeight * (48 / 64);

        } else {
            const fullHandCardWidth = fullScreenCardArea.width - 20;
            const fullHandCardHeight = fullHandCardWidth * handDisplayWidthRatio;

            handCardHeight = fullHandCardHeight / 2;
            handCardWidth = handCardHeight * (48 / 64);

            yStart = fullScreenCardArea.y + Math.floor((fullScreenCardArea.height / 2) - (fullHandCardHeight / 2));
            xStart = fullScreenCardArea.x + Math.floor((fullScreenCardArea.width / 2) - ((((handCardWidth+fullScreenCardMargin)*3))/2)) + 9;
        }

        handCardHeight = Math.floor(handCardHeight);
        handCardWidth = Math.floor(handCardWidth);


        for(let x = 0;x<3;x++) {
            for(let y = 0;y<2;y++) {
                const index = x+(y*3);
                const displaySlot = handDisplaySlots[index];

                //todo change these
                displaySlot.x = xStart + x * (handCardWidth + fullScreenCardMargin);
                displaySlot.y = yStart + y * (handCardHeight + fullScreenCardMargin);
                displaySlot.width = handCardWidth;
                displaySlot.height = handCardHeight;




                displaySlot.hoverEffect.x = displaySlot.x - hoverPadding;
                displaySlot.hoverEffect.y = displaySlot.y - hoverPadding;
                displaySlot.hoverEffect.width = displaySlot.width + doubleHoverPadding;
                displaySlot.hoverEffect.height = displaySlot.height + doubleHoverPadding;
            }
        }

        handPageHitTest.x = handDisplaySlots[0].x;
        handPageHitTest.y = handDisplaySlots[0].y;

        handPageHitTest.width = (handDisplaySlots[2].x + handDisplaySlots[2].width) - handDisplaySlots[0].x;
        handPageHitTest.height = (handDisplaySlots[3].y + handDisplaySlots[3].height) - handDisplaySlots[0].y;

        const slotDisplayIconSize = handDisplaySlots[0].width;
        const slotDisplayIconXOffset = Math.floor((handDisplaySlots[0].width/2)-(slotDisplayIconSize/2));
        const slotDisplayIconYOffset = Math.floor((handDisplaySlots[0].height / 2) - (slotDisplayIconSize / 2));

        for(let i = 0;i<3;i++) {
            let slotIndex;
            switch(i) {
                case 0:
                    slotIndex = 3;
                    break;
                case 1:
                    slotIndex = 1;
                    break;
                case 2:
                    slotIndex = 5;
                    break;
            }
            const baseSlot = handDisplaySlots[slotIndex];
            const slotSlot = slotsDisplaySlots[i];
            slotSlot.hover = baseSlot.hoverEffect;
            slotSlot.icon.x = baseSlot.x + slotDisplayIconXOffset;
            slotSlot.icon.y = baseSlot.y + slotDisplayIconYOffset;
            slotSlot.icon.width = slotDisplayIconSize;
            slotSlot.icon.height = slotDisplayIconSize;

            slotSlot.card.x = baseSlot.x;
            slotSlot.card.y = baseSlot.y;
            slotSlot.card.width = baseSlot.width;
            slotSlot.card.height = baseSlot.height;

            if(slotSlot.icon.x % 2 == 0) {
                slotSlot.iconTextX = slotSlot.icon.x + Math.floor((slotDisplayIconSize/2) - (slotSlot.iconTextWidth / 2));
            } else {
                slotSlot.iconTextX = slotSlot.icon.x + Math.floor((slotDisplayIconSize/2) - (slotSlot.iconTextWidth / 2)) + 1;
            }
            if(slotSlot.icon.y % 2 == 0) {
                slotSlot.iconTextY = slotSlot.icon.y - slotSlot.iconTextHeight - 8;
            } else {
                slotSlot.iconTextY = slotSlot.icon.y - slotSlot.iconTextHeight - 7;
            }

            const yStart = handDisplaySlots[0].y + handDisplaySlots[0].height + 20;
            slotSlot.iconTextY = Math.floor(slotSlot.iconTextY);
            slotSlot.iconTextX = Math.floor(slotSlot.iconTextX);

            slotSlot.icon.fieldTextX = slotSlot.icon.x + 4;
            slotSlot.icon.fieldTextY = yStart + 4;
            slotSlot.icon.fieldIconY = yStart + 20;

            slotSlot.icon.fieldTextBlockY = yStart;
            slotSlot.icon.fieldTextBlockHeight = 20;

        }


        if(fullScreenCardArea.width > fullScreenCardArea.height) {
            fullScreenStatusIcon.height = fullScreenCardArea.height - 30;
            fullScreenStatusIcon.width = fullScreenStatusIcon.height;
        } else {
            fullScreenStatusIcon.width = fullScreenCardArea.width - 30;
            fullScreenStatusIcon.height = fullScreenStatusIcon.width;
        }
        fullScreenStatusIcon.x = fullScreenCardArea.x + Math.floor((fullScreenCardArea.width/2)-(fullScreenStatusIcon.width/2));
        fullScreenStatusIcon.y = fullScreenCardArea.y + Math.floor((fullScreenCardArea.height/2)-(fullScreenStatusIcon.height/2)) - 5;

        fullScreenStatusIcon.hover.x = fullScreenStatusIcon.x - hoverPadding;
        fullScreenStatusIcon.hover.y = fullScreenStatusIcon.y - hoverPadding;
        fullScreenStatusIcon.hover.width = fullScreenStatusIcon.width + doubleHoverPadding;
        fullScreenStatusIcon.hover.height = fullScreenStatusIcon.height + doubleHoverPadding;

        let statusIconHeight, statusIconWidth;

        statusIconFullArea.x = handDisplaySlots[0].x,
        statusIconFullArea.y = handDisplaySlots[0].y + 15,
        statusIconFullArea.height = (handDisplaySlots[2].y + handDisplaySlots[2].height) - handDisplaySlots[0].y,
        statusIconFullArea.width = ((handDisplaySlots[2].x + handDisplaySlots[2].width) - handDisplaySlots[0].x)-40,

        statusIconWidth = Math.ceil(statusIconFullArea.width / 5);
        statusIconHeight = statusIconWidth;

        xStart = statusIconFullArea.x - 1;
        yStart = statusIconFullArea.y + 5;

        for(let x = 0;x<5;x++) {
            for(let y = 0;y<2;y++) {
                const index = x+(y*5);
                const statusIcon = statusIcons[index];

                statusIcon.x = xStart + x * (statusIconWidth + 10);
                statusIcon.y = yStart + y * (statusIconHeight + 10);

                statusIcon.width = statusIconWidth;
                statusIcon.height = statusIconHeight;

                statusIcon.hover.x = statusIcon.x - hoverPadding;
                statusIcon.hover.y = statusIcon.y - hoverPadding;
                statusIcon.hover.width = statusIcon.width + doubleHoverPadding;
                statusIcon.hover.height = statusIcon.height + doubleHoverPadding;
            }
        }

        noCardsTextX = innerLeftArea.x + Math.floor((innerLeftArea.width/2)-noCardsTextXOffset);
        noCardsTextY = innerLeftArea.y + Math.floor((innerLeftArea.fullHeight/2)-noCardsTextYOffset);

        nextButton.area.x = leftTableCycleButton.x;
        nextButton.area.y = leftTableCycleButton.y;

        nextButton.area.width = (rightTableCycleButton.x + leftTableCycleButton.width) - leftTableCycleButton.x;
        nextButton.area.height = leftTableCycleButton.height;

        nextButton.hover.x = nextButton.area.x - hoverPadding;
        nextButton.hover.y = nextButton.area.y - hoverPadding;
        nextButton.hover.width = nextButton.area.width + doubleHoverPadding;
        nextButton.hover.height = nextButton.area.height + doubleHoverPadding;

        nextButton.textX = nextButton.area.x + Math.floor((nextButton.area.width/2)-nextButton.textXOffset);

    }

    function renderButtonRow(buttonRow,index,withHover,hoverIndex,specialHover,hoverColor) {
        const yPosition = index * (moveButtonHeight + moveButtonMargin);

        for(let i = 0;i<buttonRow.length;i++) {

            const buttonSchema = moveButtonRowSchemas[buttonRow.length-1][i];
            const button = buttonRow[i];

            if(button.isNotAButton) {
                drawTextWrappingWhite(
                    button.text,
                    buttonSchema.textX,
                    moveButtonTextY+yPosition,
                    buttonSchema.width,
                    1,3,
                    adaptiveTextScale
                );
                continue;
            }

            isHover = withHover && button.index === hoverIndex;

            if(isHover) {
                context.fillStyle = button.enabled ? hoverColor : "gray";
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
    function renderButtonRows(sequencer,withHover,hoverIndex,specialHover,hoverColor) {
        let i = 0;
        while(i < sequencer.buttonRows.length) {
            renderButtonRow(sequencer.buttonRows[i],i,withHover,hoverIndex,specialHover,hoverColor);
            i++;
        }
    }

    function getButtonForegroundColor(hover,specialHover,enabled) {
        if(hover) {
            if(enabled) {
                if(specialHover) {
                    return moveButtonSpecialHover;
                } else {
                    return moveButtonHoverColor;
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

    const getBarColorForShade = function(whiteBackground,shade,isRed) {
        if(whiteBackground) {
            if(isRed) {
                return `rgb(255,${shade},${shade})`;
            } else {
                return `rgb(${shade},255,${shade})`;
            }
        } else {
            if(isRed) {
                return `rgb(${255-shade},0,0)`;
            } else {
                return `rgb(0,${255-shade},0)`;
            }
        }
    }


    const defaultHoverIndex = -1;
    const barPulseTime = 200;

    const hoverTypes = {
        none: Symbol("none"),
        moveButtons: Symbol("moveButtons"),
        bubbleSelector: Symbol("bubbleSelector"),
        cycleButtons: Symbol("cycleButtons"),
        textFeedToggleButton: Symbol("textFeedToggleButton"),
        fullScreenCard: Symbol("fullScreenCard"),
        handPageCard: Symbol("handPageCard"),
        fullScreenStatus: Symbol("fullScreenStatus"),
        statusIcon: Symbol("statusIcon"),
        slotCard: Symbol("slotCard"),
        nextButton: Symbol("nextButton")
    }    

    this.sequencer = sequencer;
    this.sequencer.renderer = this;

    this.winCallback = callbacks.win;
    this.loseCallback = callbacks.lose;
    this.quitCallback = callbacks.quit;

    this.background = background;

    let viewTabLocked = false;

    let hoverType = hoverTypes.none;
    let hoverIndex = defaultHoverIndex;
    let showHoverSpecialEffect = false;

    let textFeedShown = false;

    textFeedToggleButton.enabled = true;

    let pageCycleEnabled = true;
    let fullScreenCardLocked = false;


    let toggleTextFeedTimeout = 150;
    let lastToggleTextSwap = 0;

    this.playerPulseStart = -barPulseTime;
    this.playerPulseType = -1;

    this.opponentPulseStart = -barPulseTime;
    this.opponentPulseType = -1;

    this.playerHealthPulse = function() {
        if(this.playerPulseType === -1) {
            this.playerPulseStart = performance.now();
            this.playerPulseType = 0;
            return true;
        }
        this.playerPulseType = 0;
        return false;
    }
    this.playerEnergyPulse = function() {
        if(this.playerPulseType === -1) {
            this.playerPulseStart = performance.now();
            this.playerPulseType = 1;
            return true;
        }
        return false;
    }
    this.opponentHealthPulse = function() {
        if(this.opponentPulseType === -1) {
            this.opponentPulseStart = performance.now();
            this.opponentPulseType = 0;
            return true;
        }
        this.opponentPulseType = 0;
        return false;
    }
    this.opponentEnergyPulse = function() {
        if(this.opponentPulseType === -1) {
            this.opponentPulseStart = performance.now();
            this.opponentPulseType = 1;
            return true;
        }
        return false;
    }

    this.getPlayerBarColor = function(timestamp) {
        if(this.playerPulseType === -1) {
            return this.sequencer.viewingSelfCards ? "white" : "black";
        } else {
            let shade = (timestamp - this.playerPulseStart) / barPulseTime;
            if(shade > 1) {
                this.playerPulseType = -1;
                shade = 1;
            }
            shade = Math.floor(shade * 256);

            return getBarColorForShade(this.sequencer.viewingSelfCards,shade,this.playerPulseType === 0);
        }
    }
    this.getOpponentBarColor = function(timestamp) {
        if(this.opponentPulseType === -1) {
            return this.sequencer.viewingSelfCards ? "black" : "white";
        } else {
            let shade = (timestamp - this.opponentPulseStart) / barPulseTime;
            if(shade > 1) {
                this.opponentPulseType = -1;
                shade = 1;
            }
            shade = Math.floor(shade * 256);
            return getBarColorForShade(!this.sequencer.viewingSelfCards,shade,this.opponentPulseType === 0);
        }
    }

    this.processKey = function(key) {
        switch(key) {
            case "Space":
                if(this.sequencer.nextButtonEnabled && this.sequencer.nextButtonShown) {
                    this.sequencer.nextButtonClicked();
                } else if(textFeedToggleButton.enabled) {
                    const now = performance.now()
                    if(now >= lastToggleTextSwap) {
                        if(textFeedShown) {
                            this.hideTextFeed();
                            playSound("reverse-click");
                        } else {
                            this.showTextFeed();
                            playSound("click");
                        }
                        lastToggleTextSwap = now + toggleTextFeedTimeout;
                    }
                }
                break;
            case "Escape":
                if(textFeedShown && textFeedToggleButton.enabled) {
                    this.hideTextFeed();
                    playSound("reverse-click");
                } else if(this.sequencer.fullScreenCard && !fullScreenCardLocked) {
                    this.sequencer.hideFullScreenCard(false);
                    if(hoverType === hoverTypes.fullScreenCard) {
                        hoverType = hoverTypes.none;
                        hoverIndex = defaultHoverIndex;
                    }
                } else if(this.sequencer.fullScreenStatus && !fullScreenCardLocked) {
                    this.sequencer.hideFullScreenStatus(false);
                    if(hoverType === hoverTypes.fullScreenStatus) {
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
        return (areaContains(x,y,
            textFeedToggleButton.x,
            textFeedShown ? textFeedToggleButton.y : textFeedToggleButton.collapsedY,
            textFeedToggleButton.width,
            textFeedToggleButton.height
        ) || areaContains(x,y,innerLeftArea.x,innerLeftAreaThirdRowY,innerLeftArea.width,innerLeftAreaThirdRowHeight)) || textFeedShown && contains(x,y,textFeed);
    }

    this.processClickEnd = function(x,y) {
        showHoverSpecialEffect = false;
        switch(hoverType) {
            case hoverTypes.nextButton:
                this.sequencer.nextButtonClicked();
                break;
            case hoverTypes.statusIcon:
                this.sequencer.statusClicked(hoverIndex);
                break;
            case hoverTypes.fullScreenCard:
                if(!fullScreenCardLocked) {
                    this.sequencer.hideFullScreenCard(false);
                }
                break;
            case hoverTypes.fullScreenStatus:
                if(!fullScreenCardLocked) {
                    this.sequencer.hideFullScreenStatus(false);
                }
                break;
            case hoverTypes.textFeedToggleButton:
                if(textFeedToggleButton.enabled) {
                    if(textFeedShown) {
                        this.hideTextFeed();
                        playSound("reverse-click");
                    } else {
                        this.showTextFeed();
                        playSound("click");
                    }
                }
                break;
            case hoverTypes.bubbleSelector:
                if(!viewTabLocked) {
                    this.sequencer.switchedPanes();
                }
                break;
            case hoverTypes.cycleButtons:
                if(hoverIndex === 0) {
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
                break;
            case hoverTypes.slotCard:
                this.sequencer.slotCardClicked(hoverIndex);
                break;
        }
        this.processMove(x,y);
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
            if(this.sequencer.fullScreenStatus) {
                if(this.textFeedToggleIsHitRegistered(mouseX,mouseY)) {
                    hoverType = hoverTypes.textFeedToggleButton;
                    hoverIndex = 0;
                    return;
                } else if(contains(mouseX,mouseY,fullScreenStatusIcon)) {
                    hoverType = hoverTypes.fullScreenStatus;
                    hoverIndex = 0;
                    return;
                } else if(this.sequencer.nextButtonShown && contains(mouseX,mouseY,nextButton.area)) {
                    hoverType = hoverTypes.nextButton;
                    hoverIndex = 0;
                    return;
                }
            } else if(this.sequencer.fullScreenCard) {
                if(this.textFeedToggleIsHitRegistered(mouseX,mouseY)) {
                    hoverType = hoverTypes.textFeedToggleButton;
                    hoverIndex = 0;
                    return;
                } else if(contains(mouseX,mouseY,fullScreenCard)) {
                    hoverType = hoverTypes.fullScreenCard;
                    hoverIndex = 0;
                    return;
                } else if(this.sequencer.nextButtonShown && contains(mouseX,mouseY,nextButton.area)) {
                    hoverType = hoverTypes.nextButton;
                    hoverIndex = 0;
                    return;
                }
            } else {
                if(this.textFeedToggleIsHitRegistered(mouseX,mouseY)) {
                    hoverType = hoverTypes.textFeedToggleButton;
                    hoverIndex = 0;
                    return;
                } else if(contains(mouseX,mouseY,bubbleSelectorHitTest)) {
                    hoverType = hoverTypes.bubbleSelector;
                    hoverIndex = 0;
                    return;
                } else if(this.sequencer.nextButtonShown && contains(mouseX,mouseY,nextButton.area)) {
                    hoverType = hoverTypes.nextButton;
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
                } else {
                    if(!textFeedShown) {
                        switch(this.sequencer.cardPageType) {
                            case cardPageTypes.hand:
                                if(contains(mouseX,mouseY,handPageHitTest)) {
                                    for(let i = 0;i<handDisplaySlots.length;i++) {
                                        if(contains(mouseX,mouseY,handDisplaySlots[i])) {
                                            hoverType = hoverTypes.handPageCard;
                                            hoverIndex = i;
                                            return;
                                        }
                                    }
                                }
                                break;
                            case cardPageTypes.slots:
                                if(contains(mouseX,mouseY,handPageHitTest)) {
                                    if(contains(mouseX,mouseY,handDisplaySlots[1])) {
                                        hoverType = hoverTypes.slotCard;
                                        hoverIndex = 1;
                                        return;
                                    } else if(contains(mouseX,mouseY,handDisplaySlots[3])) {
                                        hoverType = hoverTypes.slotCard;
                                        hoverIndex = 0;
                                        return;
                                    } else if(contains(mouseX,mouseY,handDisplaySlots[5])) {
                                        hoverType = hoverTypes.slotCard;
                                        hoverIndex = 2;
                                        return;
                                    }
                                }
                                break;
                            case cardPageTypes.field:
                                if(contains(mouseX,mouseY,statusIconFullArea)) {
                                    for(let i = 0;i<statusIcons.length;i++) {
                                        if(contains(mouseX,mouseY,statusIcons[i])) {
                                            hoverType = hoverTypes.statusIcon;
                                            hoverIndex = i;
                                            return;
                                        }
                                    }
                                }
                                break;
                        }                  
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
        this.background.render(timestamp);

        drawColoredRectangle(rightBar);
        drawColoredRectangle(innerRightBar);

        if(textFeedShown) {
            drawColoredRectangle(innerLeftArea);
            drawColoredRectangle(textFeed);
            const color = showHoverSpecialEffect && hoverType === hoverTypes.textFeedToggleButton ? "rgb(30,30,30)" : "black";
            drawRectangle(
                textFeedToggleButton,
                color
            );
            drawTextWhite(textFeedToggleButton.text,textFeedToggleButton.textX,textFeedToggleButton.textY,moveButtonTextScale);
            if(this.sequencer.textFeed) {
                drawTextWrappingBlack(this.sequencer.textFeed,textFeed.textX,textFeed.textY,textFeed.maxTextWidth,1,10,adaptiveTextScale);
            }

        } else {
            context.fillStyle = innerLeftArea.color;
            context.fillRect(
                innerLeftArea.x,innerLeftArea.y,
                innerLeftArea.width,innerLeftArea.fullHeight
            );

            context.fillStyle = showHoverSpecialEffect && hoverType === hoverTypes.textFeedToggleButton ? "rgb(30,30,30)" : "black";
            context.fillRect(
                textFeedToggleButton.x,
                textFeedToggleButton.collapsedY,
                textFeedToggleButton.width,
                textFeedToggleButton.height
            );
            drawTextWhite(textFeedToggleButton.text,textFeedToggleButton.textX,textFeedToggleButton.collapsedTextY,moveButtonTextScale);

            if(this.sequencer.fullScreenCard) {
                if(hoverType === hoverTypes.fullScreenCard) {
                    drawRectangle(fullScreenCard.hoverEffect,this.background.color);
                }
                renderCardFullScreen(
                    this.sequencer.fullScreenCard,
                    fullScreenCard.x,fullScreenCard.y,
                    fullScreenCard.width,fullScreenCard.height,
                );
            } else if(this.sequencer.fullScreenStatus) {
                if(hoverType === hoverTypes.fullScreenStatus) {
                    drawRectangle(fullScreenStatusIcon.hover,this.background.color);
                }
                renderStatusFullscreen(
                    this.sequencer.fullScreenStatus,
                    fullScreenStatusIcon.x,fullScreenStatusIcon.y,
                    fullScreenStatusIcon.width,fullScreenStatusIcon.height
                );
            } else {
                switch(this.sequencer.cardPageType) {
                    case cardPageTypes.field:
                        let statusIconIndex = 0;
                        while(statusIconIndex < statusIcons.length) {
                            const statusIcon = this.sequencer.cardPageRenderData[statusIconIndex];
                            const statusIconRenderData = statusIcons[statusIconIndex];
                            if(hoverType === hoverTypes.statusIcon && hoverIndex === statusIconIndex && statusIcon) {
                                drawRectangle(statusIconRenderData.hover,this.background.color);
                            }
                            renderStatus(
                                statusIcon,
                                statusIconRenderData.x,
                                statusIconRenderData.y,
                                statusIconRenderData.width,
                                statusIconRenderData.height
                            );
                            statusIconIndex++;
                        }
                        const fieldLeftIcon = slotsDisplaySlots[0].icon;
                        const fieldRightIcon = slotsDisplaySlots[2].icon;
                        context.drawImage(
                            imageDictionary["ui/card-icons"],
                            160,0,32,32,
                            fieldLeftIcon.x,fieldLeftIcon.fieldIconY,fieldLeftIcon.width,fieldLeftIcon.height
                        );
                        context.drawImage(imageDictionary["ui/card-icons"],
                            128,0,32,32,
                            fieldRightIcon.x,fieldRightIcon.fieldIconY,fieldRightIcon.width,fieldRightIcon.height
                        );
                        context.beginPath();
                        context.fillStyle = "black";
                        context.rect(
                            fieldLeftIcon.x,fieldLeftIcon.fieldTextBlockY,fieldLeftIcon.width,fieldLeftIcon.fieldTextBlockHeight
                        );
                        context.rect(
                            fieldRightIcon.x,fieldRightIcon.fieldTextBlockY,fieldRightIcon.width,fieldRightIcon.fieldTextBlockHeight
                        );
                        context.fill();

                        drawTextWhite(this.sequencer.fieldLeftIconText,fieldLeftIcon.fieldTextX,fieldLeftIcon.fieldTextY,2);
                        drawTextWhite(this.sequencer.fieldRightIconText,fieldRightIcon.fieldTextX,fieldRightIcon.fieldTextY,2);
                        break;
                    case cardPageTypes.slots:
                        let slotDisplayIndex = 0;
                        while(slotDisplayIndex < 3) {
                            const displaySlot = slotsDisplaySlots[slotDisplayIndex];
                            if(this.sequencer.cardPageRenderData[slotDisplayIndex]) {
                                if(hoverType === hoverTypes.slotCard && slotDisplayIndex === hoverIndex) {
                                    drawRectangle(displaySlot.hover,this.background.color);
                                }
                                renderCard(
                                    this.sequencer.cardPageRenderData[slotDisplayIndex],
                                    displaySlot.card.x,
                                    displaySlot.card.y,
                                    displaySlot.card.width,
                                    displaySlot.card.height
                                );
                            } else {
                                context.drawImage(
                                    imageDictionary["ui/card-icons"],64,0,32,32,
                                    displaySlot.icon.x,
                                    displaySlot.icon.y,
                                    displaySlot.icon.width,
                                    displaySlot.icon.height
                                );
                                drawTextWhite(displaySlot.text,displaySlot.iconTextX,displaySlot.iconTextY,displaySlot.iconTextScale);
                            }
                            slotDisplayIndex++;
                        }
                        break;
                    case cardPageTypes.hand:

                        if(this.sequencer.viewingSelfCards || this.sequencer.opponentCardsVisible) {
                            
                            if(this.sequencer.cardPageRenderData.length === 0) {
                                drawTextWhite(noCardsText,noCardsTextX,noCardsTextY,noCardsTextScale);
                            } else {
                                let handCardIndex = 0;
                                while(handCardIndex < this.sequencer.cardPageRenderData.length) {
                                    const handCard = handDisplaySlots[handCardIndex];
                                    if(hoverType === hoverTypes.handPageCard && handCardIndex === hoverIndex) {
                                        drawRectangle(handCard.hoverEffect,this.background.color);
                                    }
                                    renderCard(
                                        this.sequencer.cardPageRenderData[handCardIndex],
                                        handCard.x,
                                        handCard.y,
                                        handCard.width,
                                        handCard.height
                                    );
                                    handCardIndex++;
                                }
                            }

                        } else {
                            if(this.sequencer.cardPageRenderData.length === 0) {
                                drawTextWhite(noCardsText,noCardsTextX,noCardsTextY,noCardsTextScale);
                            } else {
                                let handCardIndex = 0;
                                while(handCardIndex < this.sequencer.cardPageRenderData.length) {
                                    const handCard = handDisplaySlots[handCardIndex];
                                    renderCardBack(
                                        this.sequencer.cardPageRenderData[handCardIndex],
                                        handCard.x,
                                        handCard.y,
                                        handCard.width,
                                        handCard.height
                                    );
                                    handCardIndex++;
                                }
                            }
                        }

                        break;
                }
            }
        }

        drawTextWhite(
            this.sequencer.cardPageText,
            pageTitleBlock.textX+this.sequencer.cardPageTextXOffset,
            pageTitleBlock.textY+this.sequencer.cardPageTextYOffset,
            this.sequencer.cardPageTextScale
        );

        if(this.sequencer.nextButtonShown) {
            if(hoverType === hoverTypes.nextButton) {
                drawRectangle(nextButton.hover,this.sequencer.nextButtonEnabled ? this.background.color : "gray");
            }
            drawRectangle(
                nextButton.area,getButtonForegroundColor(
                    hoverType === hoverTypes.nextButton,
                    showHoverSpecialEffect,
                    this.sequencer.nextButtonEnabled
                )
            );
            drawTextWhite(nextButton.text,nextButton.textX,leftTableCycleButton.textY,tableCycleButtonTextScale);
        } else {
            if(hoverType === hoverTypes.cycleButtons) {
                if(hoverIndex === 0) {
                    context.fillStyle = context.fillStyle = pageCycleEnabled ? this.background.color : "gray";
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
                    context.fillStyle = context.fillStyle = pageCycleEnabled ? this.background.color : "gray";
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
        }

        drawRectangle(leftBubbleSelector,this.getPlayerBarColor(timestamp));
        drawRectangle(rightBubbleSelector,this.getOpponentBarColor(timestamp));
        if(this.sequencer.viewingSelfCards) {
            drawTextBlack(playerNameText,leftBubbleText.x,leftBubbleText.y,leftBubbleText.scale);
            drawTextWhite(opponentNameText,rightBubbleText.x,rightBubbleText.y,rightBubbleText.scale);
        } else {
            drawTextWhite(playerNameText,leftBubbleText.x,leftBubbleText.y,leftBubbleText.scale);
            drawTextBlack(opponentNameText,rightBubbleText.x,rightBubbleText.y,rightBubbleText.scale);
        }

        this.renderStatusIcons();

        renderButtonRows(this.sequencer,hoverType === hoverTypes.moveButtons,hoverIndex,showHoverSpecialEffect,this.background.color);
    }
}
