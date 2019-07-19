const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;

const ELF_WIDTH = 9;
const ELF_HEIGHT = 20;
const FOOTSTEPS_SPRITE_NAME = "footsteps";

const MAX_CONVOY_PATH_SIZE = 100;
const CONVOY_ALIGNMENT = 8;

function lerp(v0,v1,t) {
    //https://github.com/mattdesl/lerp/blob/master/LICENSE.md
    return v0*(1-t)+v1*t
}

function ElfRenderer(startDirection,spriteName) {
    SpriteRenderer.call(this,startDirection,spriteName,ELF_WIDTH,ELF_HEIGHT);
}
function PlayerRenderer(startDirection,isFakePlayer=false) {
    if(ENV_FLAGS.ELF_PLAYER_HACK) {
        ElfRenderer.call(this,startDirection,"wimpy-red-elf");
    } else {
        SpriteRenderer.call(this,startDirection,"player");
    }
    if(!isFakePlayer) {
        this.convoyAdd(new PlayerRenderer("down",true),new PlayerRenderer("down",true),new PlayerRenderer("down",true))
    }
    this.isPlayer = isFakePlayer ? false : true;
}
function SpriteRenderer(startDirection,spriteName,customColumnWidth,customColumnHeight) {
    const sprite = imageDictionary[`sprites/${spriteName}`];
    if(customColumnWidth === "auto") {
        customColumnWidth = sprite.width;
    }
    if(customColumnHeight === "auto") {
        customColumnHeight = sprite.height;
    }
    const footStepsSprite = imageDictionary[`sprites/${FOOTSTEPS_SPRITE_NAME}`];
    const customSize = customColumnWidth || customColumnHeight ? true : false;

    const customWidthRatio = customColumnHeight / customColumnWidth;
    const worldScaleTranslation = customColumnWidth / SPRITE_WIDTH;

    const columnWidth = customColumnWidth ? customColumnWidth : SPRITE_WIDTH;
    const rowHeight = customColumnHeight ? customColumnHeight : SPRITE_HEIGHT;
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

    const convoyPath = [];
    let convoyPathCount = 0;
    const convoy = [];
    let convoyCount = 0;
    const convoyAdd = object => {
        convoy.push(object);
        object.x = 0;
        object.y = 0;
        object.xOffset = 0;
        object.yOffset = 0;
        object.lastRenderX = -100;
        object.lastRenderY = -100;
        convoyCount++;
    }
    this.convoyAdd = (...objects) => objects.forEach(convoyAdd);

    const modifyConvoy = method => {
        const removed = convoy[method]();
        convoyCount = convoy.length;
        if(!convoyCount) {
            convoyPath.splice(0,convoyPathCount);
            convoyPathCount = 0;
        }
        return removed;
    }

    this.convoyRemoveFirst = () => modifyConvoy("shift");
    this.convoyRemoveLast = () => modifyConvoy("pop");
    Object.defineProperty(this,"convoyLength",{
        get: function() {
            return convoy.length;
        }
    });

    const setConvoyWalking = isWalking => {
        let i = 0;
        while(i < convoyCount) {
            convoy[i].setWalking(isWalking);
            i++;
        }
    }
    
    let lastX = null;
    let lastY = null;
    let lastTime = null;
    const baseRate = 1000 / 60;
    const minRate = baseRate * 4;
    const renderConvoy = (timestamp,x,y,width,height) => {
        if(!lastTime) {
            lastTime = timestamp;
        }
        let delta = timestamp - lastTime;
        if(delta > minRate) {
            delta = baseRate;
        }
        delta = baseRate / delta;

        const calculatedX = this.x + this.xOffset;
        const calculatedY = this.y + this.yOffset;
        if(lastX !== calculatedX || lastY !== calculatedY) {
            convoyPath.unshift({x:calculatedX,y:calculatedY,direction:this.direction});
            if(convoyPath.length > Math.floor(MAX_CONVOY_PATH_SIZE * delta)) {
                convoyPath.pop();
            }
            convoyPathCount = convoyPath.length;
            if(convoyCount) {
                setConvoyWalking(true);
            }
        } else if(convoyCount) {
            setConvoyWalking(false);
        }
        lastX = calculatedX;
        lastY = calculatedY;
        
        if(convoyPathCount) {
            const renderStack = [];
            const antiJitter = width / 16;
            let pathIndex = 0;
            let convoyIndex = 0;
            let pathDistance = 0;
            let lastX, lastY;
            while(convoyIndex < convoyCount && pathIndex < convoyPathCount) {
                const path = convoyPath[pathIndex];
                if(!lastX || !lastY) {
                    lastX = path.x;
                    lastY = path.y;
                }
                const xDistance = Math.pow(lastX - path.x,2);
                const yDistance = Math.pow(lastY - path.y,2);
                const distance = Math.sqrt(xDistance + yDistance);
                pathDistance += distance;
                if(pathDistance >= CONVOY_ALIGNMENT) {

                    const interpolationPoint = (pathDistance-CONVOY_ALIGNMENT)/CONVOY_ALIGNMENT;

                    const nextPath = convoyPath[pathIndex+1] || path;

                    const follower = convoy[convoyIndex];

                    const lerpedPathX = lerp(path.x,nextPath.x,interpolationPoint);
                    const lerpedPathY = lerp(path.y,nextPath.y,interpolationPoint);

                    let renderX = x + ((lerpedPathX - this.x) * width);
                    let renderY = y + ((lerpedPathY - this.y) * height);
                    if(Math.sqrt(Math.pow(follower.lastRenderX-renderX,2)) < antiJitter) {
                        renderX = follower.lastRenderX;
                    }
                    if(Math.sqrt(Math.pow(follower.lastRenderY-renderY,2)) < antiJitter) {
                        renderY = follower.lastRenderY;
                    }
                    follower.lastRenderX = renderX;
                    follower.lastRenderY = renderY;

                    lastX = path.x;
                    lastY = path.y;

                    follower.updateDirection(path.direction);
                    renderStack.unshift({follower:follower,x:renderX,y:renderY});
                    convoyIndex++;
                    pathDistance -= CONVOY_ALIGNMENT;
                }
                pathIndex++;
                
            }
            while(convoyIndex < convoyCount) {
                const path = convoyPath[convoyPathCount-1];
                const follower = convoy[convoyIndex];
                let renderX = x + ((path.x - this.x) * width);
                let renderY = y + ((path.y - this.y) * height);
                if(Math.abs(follower.lastRenderX-renderX) < antiJitter) {
                    renderX = follower.lastRenderX;
                }
                if(Math.abs(follower.lastRenderY-renderY) < antiJitter) {
                    renderY = follower.lastRenderY;
                }
                follower.lastRenderX = renderX;
                follower.lastRenderY = renderY;
                follower.updateDirection(path.direction);
                renderStack.unshift({follower:follower,x:renderX,y:renderY});
                convoyIndex++;
            }
            const renderStackSize = renderStack.length;
            let i = 0;
            while(i<renderStackSize) {
                const renderOperation = renderStack[i];
                renderOperation.follower.render(
                    timestamp,
                    renderOperation.x,renderOperation.y,
                    width,height
                );
                i++;
            }
        }
    }

    this.firstPosition = true;
    this.worldPositionUpdated = function(oldX,oldY,newX,newY,world,initial) {
        if(!initial) {
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
        }
        if(!this.isPlayer) {
            return;
        }
        this.triggerState = world.getTriggerState(newX,newY);
        this.impulseTrigger(world,initial);
    }

    this.impulseTrigger = (world,initial=false) => {
        const trigger = this.triggerState;
        const isOnTrigger = trigger ? true : false;
        const triggerAlreadyPressed = world.map.triggerActive;

        if(triggerAlreadyPressed && !world.map.triggerActivationMask) {
            if(!isOnTrigger) {
                world.map.triggerActive = false;
                world.map.triggerActivationMask = false;
                if(world.map.triggerDeactivated) {
                    world.map.triggerDeactivated(world.map.lastTrigger,invertDirection(this.direction));
                }
            }
        } else {
            if(isOnTrigger) {
                world.map.lastTrigger = trigger;
                world.map.triggerActive = true;
                if(initial) {
                    world.map.triggerActivationMask = true;
                    return;
                }
                if(world.map.triggerActivated) {
                    const result = world.map.triggerActivated(trigger,invertDirection(this.direction));
                    if(result === PENDING_CODE) {
                        world.map.triggerActivationMask = true;
                    } else {
                        world.map.triggerActivationMask = false;
                    }
                }
            }
        }
    }

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
    if(customSize) {
        this.render = function(timestamp,x,y,width,height) {
            const startX = this.x, startY = this.y;
            processRenderLogicForFrame(timestamp);
            if(this.hidden) {
                return;
            }
            if(convoyCount) {
                renderConvoy(timestamp,x,y,width,height);
            }
            const renderWidth = width * worldScaleTranslation;
            const renderHeight = customWidthRatio * renderWidth;

            const renderXOffset = (width - renderWidth) / 2;
            const renderYOffset = height - renderHeight;

            const destinationX = (this.xOffset * width + x + (this.x - startX) * width) + renderXOffset
            const destinationY = (this.yOffset * height + y + (this.y - startY) * height) + renderYOffset;

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
                    alertSprite,x,destinationY-height,width,height
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
            if(convoyCount) {
                renderConvoy(timestamp,x,y,width,height);
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
export { PlayerRenderer, SpriteRenderer, ElfRenderer };
