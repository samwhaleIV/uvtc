function CardBookRenderer(callback) {

    const bookCenter = {
        widthRatio: 5.75 / 9,
        heightRatio: 9 / 5.75,
        bookSizeDivider: 4.5,
        books: []
    };
    const cardCenter = {
        widthRatio: 4.5 / 6,
        heightRatio: 6 / 4.5,
        cards: [],
        cardSizeDivider: 4,
        backgroundScale: 200
    };
    
    const bookFullScreenCard = {
        widthRatio: 64 / 48,
        heightRatio: 48 / 64,
        hover: {}
    }
    
    const innerBookArea = {
        x: 100,
        y: 100,
        bottomMargin: 60
    }
    
    let cardBookButtonY;
    let cardBookButonUnderlineY;
    
    const cardBookExitButton = {};
    const cardBookBackButton = {};
    
    const cardBookCycleButton = {};
    
    (function(){
        for(let i = 0;i<8;i++) {
            bookCenter.books[i] = {hover:{}};
        }
        for(let i = 0;i<6;i++) {
            cardCenter.cards[i] = {hover:{}};
        }
        const testResult = drawTextTest("exit",3);
    
        cardBookButtonY = Math.floor((innerBookArea.y/2)-(testResult.height/2));
        cardBookButonUnderlineY = cardBookButtonY+testResult.height+2;
    
        cardBookExitButton.width = testResult.width;
        cardBookExitButton.height = testResult.height;
        cardBookExitButton.y = cardBookButtonY;
    
        const testResult2 = drawTextTest("back",3);
    
        cardBookBackButton.y = cardBookButtonY;
        cardBookBackButton.width = testResult2.width;
        cardBookBackButton.height = testResult2.height;
    
        const testResult3 = drawTextTest("page 0 of 0",3);
        cardBookCycleButton.y = cardBookButtonY;
        cardBookCycleButton.width = testResult3.width;
        cardBookCycleButton.height = testResult3.height;
        cardBookCycleButton.xOffset = testResult3.width / 2;
    })();
    
    const bookHoverPadding = 4;
    const bookDoubleHoverPadding = bookHoverPadding + bookHoverPadding;
    
    let stencilPadding;

    this.updateSize = function() {

        const testResult = drawTextTest("series 1",adaptiveTextScale);
        bookCenter.bookTextXOffset = testResult.width/2;
        bookCenter.bookTextYOffset = testResult.height/2;
    
        innerBookArea.x = Math.floor(fullWidth / 12);
    
        innerBookArea.width = fullWidth - innerBookArea.x - innerBookArea.x;
        innerBookArea.height = fullHeight - innerBookArea.y - innerBookArea.bottomMargin;
    
        if(innerBookArea.width / innerBookArea.height > bookCenter.heightRatio) {
    
            bookCenter.height = innerBookArea.height;
            bookCenter.width = Math.floor(bookCenter.height * bookCenter.heightRatio);
    
            bookCenter.y = innerBookArea.y;
            bookCenter.x = innerBookArea.x + Math.floor((innerBookArea.width/2)-(bookCenter.width/2));
    
        } else {
            bookCenter.width = innerBookArea.width;
            bookCenter.height = (innerBookArea.width * bookCenter.widthRatio);
    
            bookCenter.x = innerBookArea.x;
            bookCenter.y = innerBookArea.y + Math.floor((innerBookArea.height/2)-(bookCenter.height/2));
        }
    
        let bookWidth = bookCenter.width / bookCenter.bookSizeDivider;
        let bookHeight = bookWidth * (64 / 48);
    
        let halfWidth = bookWidth/2;
        let halfHeight = bookHeight/2;
    
        bookWidth = Math.floor(bookWidth);
        bookHeight = Math.floor(bookHeight);
    
        stencilPadding = Math.floor(bookWidth / 24);
    
        let horizontalStep = bookCenter.width / 8;//this is double the number of columns
        let verticalStep = bookCenter.height / 4;//this is double the number of rows
    
        for(let x = 0;x<4;x++) {
            for(let y = 0;y<2;y++) {
                const index = x+(y*4);
                const xCenter = horizontalStep * (1+(2*x));
                const yCenter = verticalStep * (1+(2*y));
    
                const book = bookCenter.books[index];
    
                book.x = bookCenter.x + Math.floor(xCenter - halfWidth);
                book.y = bookCenter.y + Math.floor(yCenter - halfHeight);
    
                book.width = bookWidth;
                book.height = bookHeight;
    
                book.hover.x = book.x - 2;
                book.hover.y = book.y - 2;
                book.hover.width = book.width + 4;
                book.hover.height = book.height + 4;
    
                book.textX = bookCenter.x + Math.floor(xCenter - bookCenter.bookTextXOffset);
                book.textY = bookCenter.y + Math.floor(yCenter - bookCenter.bookTextYOffset);
            }
        }
        cardBookExitButton.x = bookCenter.books[0].x + 6;
    
        if(innerBookArea.width / innerBookArea.height > cardCenter.heightRatio) {
    
            cardCenter.height = innerBookArea.height;
            cardCenter.width = Math.floor(cardCenter.height * cardCenter.heightRatio);
    
            cardCenter.y = innerBookArea.y;
            cardCenter.x = innerBookArea.x + Math.floor((innerBookArea.width/2)-(cardCenter.width/2));
    
        } else {
            cardCenter.width = innerBookArea.width;
            cardCenter.height = (cardCenter.width * cardCenter.widthRatio);
    
            cardCenter.x = innerBookArea.x;
            cardCenter.y = innerBookArea.y + Math.floor((innerBookArea.height/2)-(cardCenter.height/2));
        }
    
        let cardWidth = cardCenter.width / cardCenter.cardSizeDivider;
        let cardHeight = cardWidth * (64 / 48);
    
        halfWidth = cardWidth/2;
        halfHeight = cardHeight/2;
    
        cardWidth = Math.floor(cardWidth);
        cardHeight = Math.floor(cardHeight);
    
        horizontalStep = cardCenter.width / 6;//this is double the number of columns
        verticalStep = cardCenter.height / 4;//this is double the number of rows
    
        for(let x = 0;x<3;x++) {
            for(let y = 0;y<2;y++) {
                const index = x+(y*3);
                const xCenter = horizontalStep * (1+(2*x));
                const yCenter = verticalStep * (1+(2*y));
    
                const card = cardCenter.cards[index];
    
                card.x = cardCenter.x + Math.floor(xCenter - halfWidth);
                card.y = cardCenter.y + Math.floor(yCenter - halfHeight);
    
                card.width = cardWidth;
                card.height = cardHeight;
    
                card.hover.x = card.x - 2;
                card.hover.y = card.y - 2;
                card.hover.width = card.width + 4;
                card.hover.height = card.height + 4;
            }
        }
    
        cardBookBackButton.x = cardCenter.x + 6;
    
        cardCenter.backgroundWidth = cardCenter.backgroundScale;
        cardCenter.backgroundHeight = cardCenter.backgroundWidth * cardCenter.widthRatio;
    
    
        if(innerBookArea.width / innerBookArea.height > bookFullScreenCard.heightRatio) {
    
            bookFullScreenCard.height = innerBookArea.height;
            bookFullScreenCard.width = Math.floor(bookFullScreenCard.height * bookFullScreenCard.heightRatio);
    
            bookFullScreenCard.y = innerBookArea.y;
            bookFullScreenCard.x = innerBookArea.x + Math.floor((innerBookArea.width/2)-(bookFullScreenCard.width/2));
    
        } else {
            bookFullScreenCard.width = innerBookArea.width;
            bookFullScreenCard.height = (innerBookArea.width * bookFullScreenCard.widthRatio);
    
            bookFullScreenCard.x = innerBookArea.x;
            bookFullScreenCard.y = innerBookArea.y + Math.floor((innerBookArea.height/2)-(bookFullScreenCard.height/2));
        }
    
    
    
        bookFullScreenCard.hover.x = bookFullScreenCard.x - 6;
        bookFullScreenCard.hover.y = bookFullScreenCard.y - 6;
        bookFullScreenCard.hover.width = bookFullScreenCard.width + 12;
        bookFullScreenCard.hover.height = bookFullScreenCard.height + 12;
    
        cardBookCycleButton.x = Math.floor((fullWidth/2)-cardBookCycleButton.xOffset);
    }

    const hoverTypes = {
        none: -1,
        fullScreenCard: 1,
        seriesCards: 2,
        backButton: 3,
        cycleButton: 4,
        exitButton: 5,
        card: 6
    }

    const defaultHoverIndex = -1;

    let hoverType = hoverTypes.none;
    let hoverIndex = defaultHoverIndex;

    let showHoverSpecialEffect = false;

    this.fullScreenCard = null;
    this.viewingSeries = false;

    let releasedEscape = true;

    this.processKey = function(key) {
        switch(key) {
            case kc.cancel:
                if(!releasedEscape) {
                    break;
                }
                releasedEscape = false;
                if(this.viewingSeries) {
                    if(this.fullScreenCard) {
                        this.fullScreenCard = null;
                        playSound("reverse-click");
                    } else {
                        this.viewingSeries = false;
                        playSound("reverse-click");
                    }
                } else {
                    playSound("reverse-click");
                    this.exitCardBook();
                }
                break;
        }
    }

    this.pageIndex = 0;
    this.cycleButtonText = "page 0 of 0";

    this.processKeyUp = function(key) {
        switch(key) {
            case kc.cancel:
                releasedEscape = true;
                break;
        }
    }

    this.processMove = function(mouseX,mouseY) {
        if(!this.viewingSeries) {
            if(contains(mouseX,mouseY,cardBookExitButton)) {
                hoverType = hoverTypes.exitButton;
                hoverIndex = 0;
                return;
            }
            for(let i = 0;i<bookCenter.books.length;i++) {
                const book = bookCenter.books[i];
                if(contains(mouseX,mouseY,book)) {
                    hoverType = hoverTypes.seriesCards;
                    hoverIndex = i;
                    return;
                }
            }
        } else {
            if(this.fullScreenCard) {
                if(contains(mouseX,mouseY,bookFullScreenCard)) {
                    hoverType = hoverTypes.fullScreenCard;
                    hoverIndex = 0;
                    return;
                }
            } else {
                for(let i = 0;i<this.pageCardsLength;i++) {
                    const card = cardCenter.cards[i];
                    if(contains(mouseX,mouseY,card)) {
                        hoverType = hoverTypes.card;
                        hoverIndex = i;
                        return;
                    }
                }
            }
            if(contains(mouseX,mouseY,cardBookBackButton)) {
                hoverType = hoverTypes.backButton;
                hoverIndex = 0;
                return;
            }
            if(contains(mouseX,mouseY,cardBookCycleButton)) {
                hoverType = hoverTypes.cycleButton;
                hoverIndex = 0;
                return;
            }
        }
        hoverType = hoverTypes.none;
        hoverIndex = defaultHoverIndex;
    }

    this.pageCards = [];
    this.pageCardsLength = 0;

    this.cyclePage = function() {
        this.pageIndex = (this.pageIndex + 1) % this.pageCount;
        this.cycleButtonText = `page ${this.pageIndex+1} of ${this.pageCount}`;

        let sliceStart = this.pageIndex * 6;
        this.pageCards = this.currentSeries.cards.slice(sliceStart);
        this.pageCardsLength = Math.min(6,this.pageCards.length);
    }

    this.exitCardBook = callback;

    this.currentSeries = null;
    this.pageCount;


    this.processClick = function(mouseX,mouseY) {
        showHoverSpecialEffect = true;
        this.processMove(mouseX,mouseY);
    }
    this.processClickEnd = function(mouseX,mouseY) {
        showHoverSpecialEffect = false;

        switch(hoverType) {
            case hoverTypes.card:
                this.fullScreenCard = this.pageCards[hoverIndex];
                playSound("click");
                break;
            case hoverTypes.fullScreenCard:
                this.fullScreenCard = null;
                playSound("reverse-click");
                break;
            case hoverTypes.seriesCards:
                this.viewingSeries = true;

                this.currentSeries = allCardSeries[hoverIndex];
                this.pageCount = Math.ceil(this.currentSeries.cards.length / 6);
                this.pageIndex = -1;
                this.cyclePage();

                playSound("click");
                break;
            case hoverTypes.backButton:
                if(this.viewingSeries) {
                    if(this.fullScreenCard) {
                        this.fullScreenCard = null;
                        playSound("reverse-click");
                    } else {
                        this.viewingSeries = false;
                        playSound("reverse-click");
                    }
                }
                break;
            case hoverTypes.cycleButton:
                if(this.fullScreenCard) {
                    this.fullScreenCard = null;
                    playSound("reverse-click");
                } else {
                    playSound("click");
                    if(this.pageCount > 1) {
                        this.cyclePage();
                    }
                }
                break;
            case hoverTypes.exitButton:
                this.exitCardBook();
                playSound("reverse-click");
                break;
        }

        this.processMove(mouseX,mouseY);
    }

    this.render = timestamp => {
        context.fillStyle = "white";
        context.fillRect(0,0,fullWidth,fullHeight);

        if(!this.viewingSeries) {
            let i = 0;
            while(i < 8) {
                const book = bookCenter.books[i];
                if(hoverType === hoverTypes.seriesCards && hoverIndex === i) {
                    context.drawImage(
                        imageDictionary[allCardSeries[i].manifest.backgroundTexturePath],
                        0,0,48,64,
    
                        book.hover.x-3,
                        book.hover.y-3,
                        book.hover.width+6,
                        book.hover.height+6
                    );
                    drawRectangle(book.hover,"white");
                }

                const series = allCardSeries[i] || allCardSeries[0];//DEBUG ONLY

                renderCardBack(
                    series.manifest,
                    book.x,book.y,
                    book.width,book.height
                );
                drawTextStencil(series.manifest.brightBadge?"white":"black",series.name,book.textX,book.textY,adaptiveTextScale,stencilPadding);
                i++;
            }

            drawTextBlack("exit",cardBookExitButton.x,cardBookExitButton.y,3);
            if(hoverType === hoverTypes.exitButton) {
                context.fillStyle = "black";
                context.fillRect(cardBookExitButton.x,cardBookButonUnderlineY,cardBookExitButton.width,3);
            }
        } else {

            if(this.fullScreenCard) {

                context.drawImage(
                    imageDictionary[this.currentSeries.manifest.backgroundTexturePath],
                    0,0,48,64,

                    bookFullScreenCard.hover.x,
                    bookFullScreenCard.hover.y,
                    bookFullScreenCard.hover.width,
                    bookFullScreenCard.hover.height
                );

                renderCardFullScreen(
                    this.fullScreenCard,
                    bookFullScreenCard.x,
                    bookFullScreenCard.y,
                    bookFullScreenCard.width,
                    bookFullScreenCard.height
                );
            
            } else {
                context.drawImage(
                    imageDictionary[this.currentSeries.manifest.backgroundTexturePath],
                    0,0,cardCenter.backgroundWidth,cardCenter.backgroundHeight,
                    cardCenter.x,cardCenter.y,cardCenter.width,cardCenter.height
                );
    
    
                let i = 0;
                while(i < this.pageCardsLength) {
                    const card = cardCenter.cards[i];
                    const hasHover = hoverType === hoverTypes.card && hoverIndex === i;
                    if(hasHover) {
                        drawOutline(card.hover.x,card.hover.y,card.hover.width,card.hover.height,3,"white");
                    }
                    renderCard(this.pageCards[i],card.x,card.y,card.width,card.height,false,hasHover);
                    i++;
                }
            }
            if(hoverType === hoverTypes.backButton) {
                context.fillStyle = "black";
                context.fillRect(cardBookBackButton.x,cardBookButonUnderlineY,cardBookBackButton.width,3);
            } else if(hoverType === hoverTypes.cycleButton) {
                context.fillStyle = "black";
                context.fillRect(cardBookCycleButton.x,cardBookButonUnderlineY,cardBookCycleButton.width,3);
            }

            drawTextBlack("back",cardBookBackButton.x,cardBookBackButton.y,3);
            drawTextBlack(this.cycleButtonText,cardBookCycleButton.x,cardBookCycleButton.y,3);
        }

    }
}
export default CardBookRenderer;
