function PlayerRenderer(startDirection) {
    SpriteRenderer.call(this,startDirection,"player");
    this.isPlayer = true;
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

    this.tilesPerSecond = 2.5;

    Object.defineProperty(this,"speed",{
        get: function() {
            return this.tilesPerSecond;
        },
        set: function(value) {
            this.setSpeed(value);
        }
    });

    let tmpSpeed;

    this.setSpeed = speed => {
        tmpSpeed = this.tilesPerSecond;
        this.tilesPerSecond = speed;
    }
    this.restoreSpeed = () => {
        this.tilesPerSecond = tmpSpeed;
    }

    this.xOffset = 0;
    this.yOffset = 0;

    const maxFootStepCount = 2;
    const footStepBuffer = [];

    this.firstPosition = true;
    this.worldPositionUpdated = function(oldX,oldY,newX,newY,world) {
        if(!this.firstPosition) {
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
        } else {
            this.firstPosition = false;
        }
        if(!this.isPlayer) {
            return;
        }
        const trigger = world.getTriggerState(newX,newY);
        const wasOnTrigger = this.onTrigger;
        this.onTrigger = trigger ? true : false;
        if(this.onTrigger) {
            this.lastTrigger = trigger;
            this.impulseTrigger(world);
        } else if(wasOnTrigger && world.map.triggerDeactivated) {
            world.map.triggerDeactivated(
                wasOnTrigger
            );
        }
    }
    this.impulseTrigger = world => {
        world.map.triggerActivated(
            this.lastTrigger,
            invertDirection(this.direction)
        );
    }
    this.onTrigger = false;
    this.lastTrigger = null;

    let specialRow = null;

    this.setSpecialFrame = function(frameID) {
        currentColumn = (Math.floor(frameID / rowCount)+4) * columnWidth;
        specialRow = frameID % rowCount * columnWidth;
    }

    this.updateDirection = function(direction) {
        specialRow = null;
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
    this.renderLogic = null;

    let showingAlert = false;
    this.alert = () => {
        return new Promise(resolve=>{
            playSound("alert");
            showingAlert = true;
            setTimeout(() => {
                showingAlert = false;
                resolve();
            },SpriteAlertTimeout);
        });
    }
    const alertSprite = imageDictionary["sprites/alert"];

    this.hidden = false;
    
    Object.defineProperty(this,"location",{
        get: function() {
            return [this.x,this.y,this.xOffset,this.yOffset];
        }
    });

    this.render = function(timestamp,x,y,width,height) {
        if(this.renderLogic) {
            this.renderLogic(timestamp);
        }
        if(showingAlert) {
            context.drawImage(
                alertSprite,x,y-height,width,height
            );
        }
        if(this.hidden) {
            return;
        }
        const destinationX = this.xOffset * width + x;
        const destinationY = this.yOffset * height + y;

        const animationRow = specialRow || !this.walkingOverride && walking ? 
            Math.floor(timestamp / animationFrameTime) % rowCount * rowHeight
        : 0;
        context.drawImage(
            sprite,currentColumn,animationRow,columnWidth,rowHeight,destinationX,destinationY,width,height
        );
    }

}
export default SpriteRenderer;
export { PlayerRenderer, SpriteRenderer };
