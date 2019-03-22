function PlayerRenderer(startDirection) {

    const sprite = imageDictionary["character-sprite"];

    const columnWidth = 16;
    const rowHeight = 16;
    const rowCount = 4;

    let walking = false;
    let currentColumn = 0;

    const animationFrameTime = 1000 / 10;

    this.direction = null;

    this.nextTravelDuration = null;
    this.nextXStartTime = null;
    this.nextYStartTime = null;
    this.nextXPolarity = 0;
    this.nextYPolarity = 0;

    this.clearNextAnimationValues = () => {
        this.nextTravelDuration = null;
        this.nextXStartTime = null;
        this.nextYStartTime = null;
        this.nextXPolarity = 0;
        this.nextYPolarity = 0;
    }

    this.updateDirection = function(direction) {
        switch(direction) {
            case "down":
                currentColumn = columnWidth * 0;
                break;
            case "up":
                currentColumn = columnWidth * 1;
                break;
            case "right":
                currentColumn = columnWidth * 2;
                break;
            case "left":
                currentColumn = columnWidth * 3;
                break;
        }
        this.direction = direction;
    }

    this.setWalking = function(isWalking) {
        walking = isWalking;
    }
    this.isWalking = function() {
        return walking;
    }

    if(startDirection) {
        this.updateDirection(startDirection);
    } else {
        this.updateDirection("down");
    }

    this.render = function(timestamp,x,y,width,height) {

        let horizontalOffset = 0;
        let verticalOffset = 0;

        if(this.nextTravelDuration) {
            if(this.nextXStartTime) {
                let xDistance = (timestamp - this.nextXStartTime) / this.nextTravelDuration;
                if(xDistance > 1) {
                    xDistance = 1;
                }
                horizontalOffset = xDistance * this.nextXPolarity;
            }
            if(this.nextYStartTime) {
                let yDistance = (timestamp - this.nextYStartTime) / this.nextTravelDuration;
                if(yDistance > 1) {
                    yDistance = 1;
                }
                verticalOffset = yDistance * this.nextYPolarity;
            }
        }

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
