const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;

const ELF_WIDTH = 9;
const ELF_HEIGHT = 20;

const ELF_WIDTH_RATIO = ELF_HEIGHT / ELF_WIDTH;
const ELF_TO_WORLD_SCALE = ELF_WIDTH / WorldTextureSize;

const FOOTSTEPS_SPRITE_NAME = "footsteps";

function PlayerRenderer(startDirection) {
    if(ENV_FLAGS.ELF_PLAYER_HACK) {
        SpriteRenderer.call(this,startDirection,"wimpy-red-elf",true);
    } else {
        SpriteRenderer.call(this,startDirection,"player",false);
    }
    this.isPlayer = true;
}
function SpriteRenderer(startDirection,spriteName,isElf) {
    isElf = isElf ? true : false;

    const sprite = imageDictionary[`sprites/${spriteName}`];
    const footStepsSprite = imageDictionary[`sprites/${FOOTSTEPS_SPRITE_NAME}`];

    const columnWidth = isElf ? ELF_WIDTH : SPRITE_WIDTH;
    const rowHeight = isElf ? ELF_HEIGHT : SPRITE_HEIGHT;
    const rowCount = 4;

    const footstepWidth = 16;
    const footstepHeight = 16;

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
            const decalSourceX = this.direction === "up" || this.direction === "down" ? 0 : footstepWidth;
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
                        footstepWidth,footstepHeight,
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

    this.skipRenderLogic = true;

    const processRenderLogicForFrame = timestamp => {
        if(this.skipRenderLogic) {
            this.skipRenderLogic = false;
        } else if(this.renderLogic) {
            this.renderLogic(timestamp);
        }
    }

    if(isElf) {
        this.render = function(timestamp,x,y,width,height) {
            const startX = this.x, startY = this.y;
            processRenderLogicForFrame(timestamp);
            if(this.hidden) {
                return;
            }

            const renderWidth = width * ELF_TO_WORLD_SCALE;
            const renderHeight = ELF_WIDTH_RATIO * renderWidth;

            const renderXOffset = width / 4;
            const renderYOffset = renderHeight / 4;

            const destinationX = (this.xOffset * width + x + (this.x - startX) * width) + renderXOffset
            const destinationY = (this.yOffset * height + y + (this.y - startY) * height) - renderYOffset;

            const animationRow = specialRow !== null ? specialRow : !this.walkingOverride && walking ? 
                Math.floor(timestamp / animationFrameTime) % rowCount * rowHeight
            : 0;

            context.drawImage(
                sprite,currentColumn,animationRow,columnWidth,rowHeight,
                destinationX,destinationY,
                Math.round(renderWidth),
                Math.round(renderHeight)
            );

            if(showingAlert) {
                context.drawImage(
                    alertSprite,destinationX+renderWidth/2-width/2,destinationY-height,width,height
                );
            }
        }
    } else {
        this.render = function(timestamp,x,y,width,height) {
            const startX = this.x, startY = this.y;
            processRenderLogicForFrame(timestamp);
            if(this.hidden) {
                return;
            }
            const destinationX = this.xOffset * width + x + (this.x - startX) * width;
            const destinationY = this.yOffset * height + y + (this.y - startY) * height;

            if(showingAlert) {
                context.drawImage(
                    alertSprite,destinationX,destinationY-height,width,height
                );
            }
    
            const animationRow = specialRow !== null ? specialRow : !this.walkingOverride && walking ? 
                Math.floor(timestamp / animationFrameTime) % rowCount * rowHeight
            : 0;
            context.drawImage(
                sprite,currentColumn,animationRow,columnWidth,rowHeight,destinationX,destinationY,width,height
            );
        }
    }


}
export default SpriteRenderer;
export { PlayerRenderer, SpriteRenderer };
