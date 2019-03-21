function PlayerRenderer() {

    const sprite = imageDictionary["character-sprite"];

    const columnWidth = 16;
    const rowHeight = 16;
    const rowCount = 4;

    let walking = true;
    let currentColumn = 0;

    const animationFrameTime = 1000 / 10;

    let horizontalOffset = 0;
    let verticalOffset = 0;

    this.updateDirection = function(direction) {
        switch(direction) {
            case "down":
                currentColumn = columnWidth * 0;
                break;
            case "up":
                currentColumn = columnWidth * 1;
                break;
            case "left":
                currentColumn = columnWidth * 2;
                break;
            case "right":
                currentColumn = columnWidth * 3;
                break;
        }
    }

    this.setWalking = function(isWalking) {
        walking = isWalking;
    }

    this.render = function(timestamp,x,y,width,height) {

        const destinationX = horizontalOffset * width + x;
        const destinationY = verticalOffset * height + y;

        const animationRow = walking ? 
            Math.floor(timestamp / animationFrameTime) % rowCount * rowHeight
        : 0;

        context.drawImage(
            sprite,currentColumn,animationRow,columnWidth,rowHeight,destinationX,destinationY,width,height
        );

    }

}
