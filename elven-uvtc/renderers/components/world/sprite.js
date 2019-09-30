import { AlertSound } from "../../../runtime/tones.js";

const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;

const ELF_WIDTH = 9;
const ELF_HEIGHT = 20;
const FOOTSTEPS_SPRITE_NAME = "footsteps";
const PLAYER_SPRITE_NAME = "player";
const ELF_HACK_SPRITE = "wimpy-red-elf";

const CONVOY_ALIGNMENT = 1;

const SPRITE_ALERT_TIMEOUT = 500;

function convoyRenderSort(a,b) {
    return a.y - b.y;
}

function ElfRenderer(startDirection,spriteName) {
    SpriteRenderer.call(this,startDirection,spriteName,ELF_WIDTH,ELF_HEIGHT);
}
function PlayerRenderer(startDirection,isFakePlayer=false) {
    if(ENV_FLAGS.ELF_PLAYER_HACK) {
        ElfRenderer.call(this,startDirection,ELF_HACK_SPRITE);
    } else {
        SpriteRenderer.call(this,startDirection,PLAYER_SPRITE_NAME);
    }
    if(!isFakePlayer && ENV_FLAGS.DEBUG_PLAYER_CONVOY) {
        this.convoyAdd(
            new PlayerRenderer(null,true),
            new PlayerRenderer(null,true),
            new PlayerRenderer(null,true)
        );
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

    this.animationFrameTime = 1000 / 12;

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

    let convoyPath = [];

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

    const getConvoyPosition = convoyIndex => {
        const endLength = (convoyIndex + 1) * CONVOY_ALIGNMENT;
        let pathIndex = 1;
        let lastPath = convoyPath[0];
        let lengthBuffer = endLength;
        while(pathIndex < convoyPath.length) {
            const nextPath = convoyPath[pathIndex];

            const xDistance = Math.abs(lastPath.x-nextPath.x,2);
            const yDistance = Math.abs(lastPath.y-nextPath.y,2);

            const distance = xDistance || yDistance;

            if(lengthBuffer > distance) {
                lengthBuffer -= distance;
                pathIndex++;
                lastPath = nextPath;
            } else {
                if(xDistance) {
                    return {
                        direction: lastPath.direction,
                        x: lastPath.direction === "left" ? lastPath.x + lengthBuffer : lastPath.x - lengthBuffer,
                        y: lastPath.y
                    };
                } else {
                    return {
                        direction: lastPath.direction,
                        x: lastPath.x,
                        y: lastPath.direction === "up" ? lastPath.y + lengthBuffer : lastPath.y - lengthBuffer
                    };
                }
            }
        }
        const finalPath = convoyPath[convoyPath.length-1];
        return finalPath;
    }
    
    let lastX = null;
    let lastY = null;
    const renderConvoy = (timestamp,x,y,width,height) => {
        const calculatedX = this.x + this.xOffset;
        const calculatedY = this.y + this.yOffset;
        if(lastX !== calculatedX || lastY !== calculatedY) {
            const frontPath = convoyPath[0];
            if(!frontPath) {
                convoyPath[0] = {
                    direction: this.direction,
                    x: calculatedX,
                    y: calculatedY
                };
                convoyPath[1] = {
                    direction: this.direction,
                    x: calculatedX,
                    y: calculatedY
                };
            } else {
                if(this.direction !== frontPath.direction) {
                    convoyPath.unshift({
                        direction: this.direction,
                        x: calculatedX,
                        y: calculatedY
                    });
                } else {
                    frontPath.x = calculatedX;
                    frontPath.y = calculatedY;
                }
            }
            setConvoyWalking(true);
        } else {
            setConvoyWalking(false);
        }
        lastX = calculatedX;
        lastY = calculatedY;

        if(ENV_FLAGS.CONVOY_TRACE) {
            const xOffset = width / 2;
            const yOffset = height / 2;
            context.beginPath();
            context.lineWidth = 2;
            context.strokeStyle = "red";
            context.moveTo(
                xOffset + x + (convoyPath[0].x - this.x) * width,
                yOffset + y + (convoyPath[0].y - this.y) * height
            );
            for(let i = 1;i<convoyPath.length;i++) {
                const path = convoyPath[i];
                context.lineTo(
                    xOffset + x + (path.x - this.x) * width,
                    yOffset + y + (path.y - this.y) * height
                );
            } 
            context.stroke();
        }

        const renderStack = [];
        let convoyIndex = 0;
        while(convoyIndex < convoyCount) {
            const follower = convoy[convoyIndex];
            const convoyPosition = getConvoyPosition(convoyIndex);
            follower.updateDirection(convoyPosition.direction);
            renderStack.unshift({
                follower: follower,
                x: x + (convoyPosition.x - this.x) * width,
                y: y + (convoyPosition.y - this.y) * height
            });
            convoyIndex++;
        }
        const renderStackSize = renderStack.length;
        renderStack.sort(convoyRenderSort);
        let i = 0;
        let renderedSelf = false;
        const renderY = Math.round(y+this.yOffset*height);
        if(renderY < renderStack[0].y) {
            this.renderSelf(x,y,width,height);
            renderedSelf = true;
        }
        while(i<renderStackSize) {
            const renderOperation = renderStack[i];
            renderOperation.follower.render(
                timestamp,
                renderOperation.x,renderOperation.y,
                width,height
            );
            i++;
        }
        if(!renderedSelf) {
            this.renderSelf(x,y,width,height);
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
            const shouldPushNew = FootPrintTiles[
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
        if(!this.triggerState) {
            this.lastActive = null;
        }
        this.impulseTrigger(world,initial);
    }

    this.impulseTrigger = (world,initial=false) => {
        if(this.triggerState && !initial) {
            if(this.lastActive === this.triggerState) {
                return;
            }
            const result = world.map.triggerImpulse(this.triggerState,this.direction);
            if(result === TRIGGER_ACTIVATED) {
                this.lastActive = this.triggerState;
            } else {
                this.lastActive = null;
            }
        }
    }

    let specialRow = null;

    this.setSpecialFrame = function(frameID) {
        currentColumn = 4 * columnWidth + Math.floor(frameID / 4);
        specialRow = (frameID % 4) * rowHeight;
    }

    this.updateDirection = function(direction) {
        specialRow = null;
        switch(direction) {
            case "down":
                currentColumn = 0;
                break;
            case "up":
                currentColumn = columnWidth;
                break;
            case "right":
                currentColumn = columnWidth + columnWidth;
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
    
    const alertResolvers = [];
    let alertTimeout = null;
    this.alert = () => {
        return new Promise(resolve=>{
            if(alertTimeout !== null) {
                clearTimeout(alertTimeout);
            }
            alertResolvers.push(resolve);
            AlertSound();
            showingAlert = true;
            alertTimeout = setTimeout(() => {
                alertResolvers.forEach(resolver=>resolver());
                alertResolvers.splice(0);
                showingAlert = false;
            },SPRITE_ALERT_TIMEOUT);
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
    let startX, startY, recentTimestamp;
    if(customSize) {
        this.renderSelf = function(x,y,width,height) {
            const renderWidth = width * worldScaleTranslation;
            const renderHeight = customWidthRatio * renderWidth;

            const renderXOffset = (width - renderWidth) / 2;
            const renderYOffset = height - renderHeight;

            const destinationX = (this.xOffset * width + x + (this.x - startX) * width) + renderXOffset
            const destinationY = (this.yOffset * height + y + (this.y - startY) * height) + renderYOffset;

            const animationRow = specialRow !== null ? specialRow : !this.walkingOverride && walking ? 
                Math.floor(recentTimestamp / this.animationFrameTime) % rowCount * rowHeight
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
        this.renderSelf = function(x,y,width,height) {
            const destinationX = this.xOffset * width + x + (this.x - startX) * width;
            const destinationY = this.yOffset * height + y + (this.y - startY) * height;
            if(showingAlert) {
                context.drawImage(
                    alertSprite,destinationX,destinationY-height,width,height
                );
            }
            const animationRow = specialRow !== null ? specialRow : !this.walkingOverride && walking ? 
                Math.floor(recentTimestamp / this.animationFrameTime) % rowCount * rowHeight
            : 0;
            context.drawImage(
                sprite,currentColumn,animationRow,columnWidth,rowHeight,destinationX,destinationY,width,height
            );
        }
    }
    this.render = function(timestamp,x,y,width,height) {
        recentTimestamp = timestamp;
        startX = this.x;
        startY = this.y;
        processRenderLogicForFrame(timestamp);
        if(this.hidden) {
            return;
        }
        if(convoyCount) {
            renderConvoy(timestamp,x,y,width,height);
        } else {
            this.renderSelf(x,y,width,height);
        }
    }
}
export default SpriteRenderer;
export { PlayerRenderer, SpriteRenderer, ElfRenderer };
