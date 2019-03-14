
const bookCenter = {
    widthRatio: 5.75 / 9,
    heightRatio: 9 / 5.75,
    bookSizeDivider: 4.5,
    books: []
};
(function(){
    for(let i = 0;i<8;i++) {
        bookCenter.books[i] = {hover:{}};
    }
})();


const innerBookArea = {
    x: 100,
    y: 100,
    bottomMargin: 60
}

let stencilPadding;

function updateCardBookElements() {

    const testResult = drawTextTest("series 1",smallestTextScale);
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

    const halfWidth = bookWidth/2;
    const halfHeight = bookHeight/2;

    bookWidth = Math.floor(bookWidth);
    bookHeight = Math.floor(bookHeight);

    stencilPadding = Math.floor(bookWidth / 24);

    const horizontalStep = bookCenter.width / 8;//this is double the number of columns
    const verticalStep = bookCenter.height / 4;//this is double the number of rows

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

            book.hover.x = book.x - 4;
            book.hover.y = book.y - 4;
            book.hover.width = book.width + 8;
            book.hover.height = book.height + 8;

            book.textX = bookCenter.x + Math.floor(xCenter - bookCenter.bookTextXOffset);
            book.textY = bookCenter.y + Math.floor(yCenter - bookCenter.bookTextYOffset);
        }
    }
}


function CardBookRenderer() {

    const hoverTypes = {
        none: -1,
        fullScreenCard: 1,
        seriesCards: 2,
        backButton: 3,
        cycleButton: 4
    }

    const defaultHoverIndex = -1;

    let hoverType = hoverTypes.none;
    let hoverIndex = defaultHoverIndex;

    let showHoverSpecialEffect = false;

    this.fullScreenCard = null;
    this.viewingSeries = false;

    this.processKey = function(key) {
    }
    this.processKeyEnd = function(key) {
    }

    this.processMove = function(mouseX,mouseY) {
        if(!this.viewingSeries) {
            for(let i = 0;i<bookCenter.books.length;i++) {
                const book = bookCenter.books[i];
                if(contains(mouseX,mouseY,book)) {
                    hoverType = hoverTypes.seriesCards;
                    hoverIndex = i;
                    return;
                }
            }
        } else {

        }
        hoverType = hoverTypes.none;
        hoverIndex = defaultHoverIndex;
    }
    this.processClick = function(mouseX,mouseY) {
        showHoverSpecialEffect = true;



        this.processMove(mouseX,mouseY);
    }
    this.processClickEnd = function(mouseX,mouseY) {
        showHoverSpecialEffect = false;


        this.processMove(mouseX,mouseY);
    }

    updateCardBookElements();

    this.updateSize = updateCardBookElements;

    this.render = timestamp => {
        context.fillStyle = "white";
        context.fillRect(0,0,fullWidth,fullHeight);

        let i = 0;
        while(i < 8) {
            const book = bookCenter.books[i];
            if(hoverType === hoverTypes.seriesCards && hoverIndex === i) {
                drawRectangle(book.hover,"black");
            }
            renderCardBack(
                allCardSeries[0].manifest,
                book.x,book.y,
                book.width,book.height
            );
            drawTextStencil("black","series 1",book.textX,book.textY,smallestTextScale,stencilPadding);
            i++;
        }
    }
}
