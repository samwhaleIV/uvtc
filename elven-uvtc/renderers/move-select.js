function MoveSelectRenderer(options,moveUpdateCallback) {
    let hoverIndex = -1;
    const optionsCount = options.length;
    this.processMove = (x,y) => {

    }
    this.processClick = this.processMove;
    this.processClickEnd = () => {
        if(hoverIndex > -1) {
            moveUpdateCallback(options[hoverIndex].name)
        }
    }
    this.processKey = key => {

    }
    this.processKeyUp = key => {

    }
    this.render = (timestamp,x,y,width,height) => {
        context.fillStyle = "rgba(0,0,0,0.93)";
        context.fillRect(x,y,width,height);

        const moveSize = width/8;
        const margin = moveSize/4;

        const columnCount = Math.floor(width / (moveSize+margin));

        let xOffset = 0;
        let yOffset = 0;

        const hiddenYOffset = moveSize/4;
        const hiddenXOffset = (width - columnCount * (moveSize+margin)) / 2 + moveSize/8;

        let i = 0;
        let column = 0;
        hoverIndex = -1;
        while(i<optionsCount) {
            const moveX = x+xOffset+hiddenXOffset;
            const moveY = y+yOffset+hiddenYOffset;
            let hover = false;
            if(areaContains(lastRelativeX,lastRelativeY,moveX,moveY,moveSize,moveSize)) {
                hoverIndex = i;
                hover = "white";
            }
            options[i].render(moveX,moveY,moveSize,hover,!i?false:!hover);
            i++;
            column++;
            xOffset += moveSize + margin;
            if(column > columnCount-1) {
                column = 0;
                xOffset = 0;
                yOffset += moveSize + margin;
            }
        }
    }
}
export default MoveSelectRenderer;
