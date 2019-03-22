function PlayerRenderer(startDirection) {

    const footPrintTiles = {
        21: true
    }

    const sprite = imageDictionary["character-sprite"];
    const footStepsSprite = imageDictionary["footsteps"];

    const columnWidth = 16;
    const rowHeight = 16;
    const rowCount = 4;

    let walking = false;
    let currentColumn = 0;

    const animationFrameTime = 1000 / 10;

    this.direction = null;

    this.xOffset = 0;
    this.yOffset = 0;

    const maxFootStepCount = 2;
    const footStepBuffer = [];

    this.worldPositionUpdated = function(oldX,oldY,world) {
        const decalSourceX = this.direction === "up" || this.direction === "down" ? 0 : columnWidth;
        const xOffset = this.xOffset;
        const yOffset = this.yOffset;
        const newFootStep = {
            x: this.x,
            y: this.y,
            render: (timestamp,x,y,width,height) => {
                const horizontalOffset = xOffset * width;
                const verticalOffset = yOffset * height;
                context.drawImage(
                    footStepsSprite,
                    decalSourceX,0,
                    columnWidth,rowHeight,
                    x+horizontalOffset,y+verticalOffset,
                    width,height
                );
            }
        }
        const shouldPushNew = footPrintTiles[
            world.renderMap.background[
                this.x + this.y * world.renderMap.columns
            ]
        ];
        if(footStepBuffer.length < maxFootStepCount) {
            if(shouldPushNew) {
                footStepBuffer.push(newFootStep);
                world.addDecal(newFootStep);
            } else if(footStepBuffer.length > 0) {
                const removedDecal = footStepBuffer.shift();
                world.removeDecal(removedDecal);
            }
        } else {
            const removedDecal = footStepBuffer.shift();
            world.removeDecal(removedDecal);
            if(shouldPushNew) {
                footStepBuffer.push(newFootStep);
                world.addDecal(newFootStep);
            }
        }
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
        const destinationX = this.xOffset * width + x;
        const destinationY = this.yOffset * height + y;

        const animationRow = walking ? 
            Math.floor(timestamp / animationFrameTime) % rowCount * rowHeight
        : 0;
        context.drawImage(
            sprite,currentColumn,animationRow,columnWidth,rowHeight,destinationX,destinationY,width,height
        );

    }

}
