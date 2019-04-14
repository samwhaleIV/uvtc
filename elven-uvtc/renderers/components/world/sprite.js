const invertDirection = direction => {
    switch(direction) {
        case "up":
            return "down";
        case "down":
            return "up";
        case "left":
            return "right";
        case "right":
            return "left";
        default:
            return direction;
    }
}
function PlayerRenderer(startDirection) {
    SpriteRenderer.call(this,startDirection,"player");
}
function SpriteRenderer(startDirection,spriteName,footstepsName="footsteps") {
    const sprite = imageDictionary[`sprites/${spriteName}`];
    const footStepsSprite = imageDictionary[`sprites/${footstepsName}`];

    const columnWidth = 16;
    const rowHeight = 16;
    const rowCount = 4;

    let walking = false;
    let currentColumn = 0;

    const animationFrameTime = 1000 / 12;

    this.direction = null;

    this.xOffset = 0;
    this.yOffset = 0;

    const maxFootStepCount = 2;
    const footStepBuffer = [];

    this.worldPositionUpdated = function(oldX,oldY,newX,newY,world) {
        const decalSourceX = this.direction === "up" || this.direction === "down" ? 0 : columnWidth;
        const xOffset = this.xOffset;
        const yOffset = this.yOffset;
        const newFootStep = {
            x: newX,
            y: newY,
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
                (newX + Math.round(xOffset)) + (newY + Math.round(yOffset)) * world.renderMap.columns
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
        const trigger = world.getTriggerState(newX,newY);
        if(trigger !== null) {
            world.map.triggerActivated(
                trigger,
                invertDirection(this.direction)
            );
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
    
    this.walkingOverride = false;

    this.render = function(timestamp,x,y,width,height) {
        const destinationX = this.xOffset * width + x;
        const destinationY = this.yOffset * height + y;

        const animationRow = !this.walkingOverride && walking ? 
            Math.floor(timestamp / animationFrameTime) % rowCount * rowHeight
        : 0;
        context.drawImage(
            sprite,currentColumn,animationRow,columnWidth,rowHeight,destinationX,destinationY,width,height
        );
    }

}
