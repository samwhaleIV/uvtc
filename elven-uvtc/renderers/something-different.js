import SpriteForeground from "./components/battle/sprite-foreground.js";
import CrazyFlyingShitEffect from "./components/crazy-flying-shit.js";

const groundTextureX = 0;
const groundTextureY = 0;

const skyTextureX = 16;
const skyTextureY = 16;

const textureWidth = 16;
const textureHeight = 16;
const halfTextureWidth = textureWidth / 2;
const groundTextureXHalf = groundTextureX + halfTextureWidth;

const fogColor = "rgba(255,255,255,0.6)";

function SomethingDifferentRenderer() {

    const opponentSprite = new SpriteForeground("wimpy-red-elf",true,null,null,0.2);
    this.opponent = {
        y: 0,
        x: 0,
        render: timestamp => {
            opponentSprite.render(timestamp,120);
        }
    }

    this.backgroundEffects = new CrazyFlyingShitEffect();

    this.forcedSizeMode = "fit";
    const tileset = imageDictionary["battle/test-tileset"];
    const worldTileset = imageDictionary["world-tileset"];
    const headcons = imageDictionary["battle/headcon"];
    const getWorldTextureX = ID => ID % WorldTextureColumns * WorldTextureSize;
    const getWorldTextureY = ID => Math.floor(ID / WorldTextureColumns) * WorldTextureSize;


    const foregroundLayer1 = [];
    const foregroundLayer2 = [];
    const foregroundLayer3 = [];

    const headconMap = [
        {icon:0,lost:true},
        {icon:0,lost:false},
        {icon:0,lost:false},

        {icon:1,lost:false},
        {icon:1,lost:false},
        {icon:1,lost:true}
    ];

    const renderHeadcons = () => {
        const halfBarWidth = 180;
        const headConDistance = halfBarWidth/3;
        const height = 60;
        context.translate(halfWidth-halfBarWidth,0);
        context.fillStyle = "black";
        context.fillRect(0,0,halfBarWidth,height);
        context.fillStyle = "white";
        context.fillRect(halfBarWidth,0,halfBarWidth,height);

        context.translate(5,5);
        for(let i = 0;i<6;i++) {
            const map = headconMap[i];
            let iconX = map.icon * 90;
            let iconY = map.lost ? 90 : 0;
            context.drawImage(headcons,iconX,iconY,90,90,i*headConDistance,0,50,50);
        }

        context.resetTransform();
    }

    const renderForegroundObject = foregroundObject => {
        context.drawImage(
            worldTileset,
            foregroundObject.textureX,
            foregroundObject.textureY,
            foregroundObject.textureWidth,
            foregroundObject.textureHeight,

            foregroundObject.renderXPercent * fullWidth + foregroundObject.renderXOffset,
            halfHeight + foregroundObject.renderYOffset,
            foregroundObject.renderWidth,
            foregroundObject.renderHeight
        );
    }

    const getForegroundObject = (startTextureID,width,height,posX,scale) => {
        const renderWidth = WorldTextureSize * width * scale;
        const renderHeight = WorldTextureSize * height * scale;
        return {
            textureX: getWorldTextureX(startTextureID),
            textureY: getWorldTextureY(startTextureID),
            textureWidth: width * WorldTextureSize,
            textureHeight: height * WorldTextureSize,
            renderWidth: renderWidth,
            renderHeight: renderHeight,
            renderXPercent: posX,
            renderXOffset: -renderWidth / 2,
            renderYOffset: -renderHeight / 2
        }
    }

    const getTree = posX => {
        return getForegroundObject(116,2,4,posX,8);
    }

    const loadForegroundLayers = () => {
        foregroundLayer1.push(
            getTree(0.4),
            getTree(0.9),
            getTree(-0.5),
            getTree(1.5),
        );
        foregroundLayer2.push(
            getTree(0.25),
            getTree(0.75),
            getTree(-0.5),
            getTree(1.5),         
        );
        foregroundLayer3.push(
            getTree(0.20),
            getTree(0.75)
        );
    }
    loadForegroundLayers();

    const renderSky = depth => {
        context.drawImage(tileset,48,16,16,16,0,0,fullWidth,fullHeight);
    }

    const renderGround = (xNormal,depthNormal) => {

        depthNormal = Math.max(-(depthNormal - 1) / 4,0.01);

        const renderHeight = fullHeight / 4;
        const skewAmount = 0.5;
        const centerPush = 0;

        const groundTop = fullHeight - renderHeight;

        const adjustedTextureY = Math.max(depthNormal * 2 * textureHeight,0.0001);

        const adjustedTextureX = -xNormal / 10 * textureWidth + textureWidth;

        context.drawImage(tileset,48,0,16,16,0,groundTop,fullWidth,renderHeight);

        context.setTransform(1,0,-skewAmount,1,centerPush,0);
        context.drawImage(
            tileset,
            adjustedTextureX,adjustedTextureY,
            halfTextureWidth,textureHeight,

            0,groundTop,
            halfWidth,renderHeight
        );
        context.setTransform(1,0,skewAmount,1,-centerPush,0);
        context.drawImage(
            tileset,
            adjustedTextureX+8,adjustedTextureY,
            halfTextureWidth,textureHeight,

            halfWidth,groundTop,
            halfWidth,renderHeight
        );

        context.resetTransform();
    }

    const renderFog = depthNormal => {
        context.fillStyle = `rgba(255,255,255,${depthNormal})`;
        context.fillRect(0,0,fullWidth,fullHeight);
    }

    const renderForeground = (timestamp,xNormal,depthNormal) => {
        depthNormal = 1.4 + (2.5 - 1.4) * depthNormal;

        const depthFactor = 0.5;

        const firstDepthScale = Math.pow(depthNormal / 2 / 2 /2,depthFactor);
        const secondDepthScale = Math.pow(depthNormal / 2 / 2,depthFactor);
        const thirdDepthScale = Math.pow(depthNormal / 2,depthFactor);
        const fourthDepthScale = depthNormal + this.opponent.y;

        //focal length
        //const firstDepthScale = depthNormal + 0.25;
        //const secondDepthScale = depthNormal + 0.5;
        //const thirdDepthScale = depthNormal + 1;

        const xOffset = halfWidth * xNormal;
        const yContrast = 100;
        const yOffset = -100;

        const firstDepthHeight = firstDepthScale * fullHeight;
        const secondDepthHeight = secondDepthScale * fullHeight;
        const thirdDepthHeight = thirdDepthScale * fullHeight;
        const fourthDepthHeight = fourthDepthScale * fullHeight;

        const opponentXOffset = this.opponent.x * halfWidth;
        
        const thirdDepthX = (fullWidth   - thirdDepthScale  * fullWidth)  /  2 + xOffset * thirdDepthScale;
        const thirdDepthY = (fullHeight - thirdDepthHeight) / 2 + yContrast / thirdDepthScale + yOffset;

        const secondDepthX = (fullWidth  - secondDepthScale * fullWidth)  /  2 + xOffset * secondDepthScale;
        const secondDepthY =(fullHeight - secondDepthHeight) / 2 + yContrast / secondDepthScale + yOffset;

        const firstDepthX = (fullWidth   - firstDepthScale  * fullWidth)  /  2 + xOffset * firstDepthScale;
        const firstDepthY = (fullHeight - firstDepthHeight) / 2 + yContrast / firstDepthScale - 150;

        const fourthDepthX = (fullWidth   - fourthDepthScale  * fullWidth)  /  2 + xOffset * fourthDepthScale - opponentXOffset;
        const fourthDepthY = (fullHeight - fourthDepthHeight) / 2 - Math.min(depthNormal - 2.5,0) * 10;

        let i;
        context.setTransform(firstDepthScale,0,0,firstDepthScale,firstDepthX,firstDepthY);
        for(i = 0;i<foregroundLayer1.length;i++) {
            renderForegroundObject(foregroundLayer1[i]);
        }
        context.resetTransform();
        renderFog(0.6);
        context.setTransform(secondDepthScale,0,0,secondDepthScale,secondDepthX,secondDepthY);
        for(i = 0;i<foregroundLayer2.length;i++) {
            renderForegroundObject(foregroundLayer2[i]);
        }
        context.resetTransform();
        renderFog(0.6);
        context.setTransform(thirdDepthScale,0,0,thirdDepthScale,thirdDepthX,thirdDepthY);
        for(i = 0;i<foregroundLayer3.length;i++) {
            renderForegroundObject(foregroundLayer3[i]);
        }

        context.setTransform(fourthDepthScale,0,0,fourthDepthScale,fourthDepthX,fourthDepthY);
        if(this.backgroundEffects) {
            this.backgroundEffects.render(timestamp)
        }
        this.opponent.render(timestamp);
        if(this.foregroundEffects) {
            this.foregroundEffects.render(timestamp);
        }
        context.resetTransform();
    }

    let xDelta = 0;
    let yDelta = 0;

    let wDown, sDown, aDown, dDown;

    this.processKey = key => {
        switch(key) {
            case kc.up:
                if(wDown) {
                    return;
                }
                yDelta--;
                wDown = true;
                break;
            case kc.down:
                if(sDown) {
                    return;
                }
                yDelta++;
                sDown = true;
                break;
            case kc.left:
                if(aDown) {
                    return;
                }
                xDelta--;
                aDown = true;
                break;
            case kc.right:
                if(dDown) {
                    return;
                }
                xDelta++;
                dDown = true;
                break;
        }
    }
    this.processKeyUp = key => {
        switch(key) {
            case kc.up:
                if(wDown) {
                    yDelta++;
                }
                wDown = false;
                break;
            case kc.down:
                if(sDown) {
                    yDelta--;
                }
                sDown = false;
                break;
            case kc.left:
                if(aDown) {
                    xDelta++;
                }
                aDown = false;
                break;
            case kc.right:
                if(dDown) {
                    xDelta--;
                }
                dDown = false;
                break;
        }
    }

    let x = 0;
    let y = 0.35;

    let xVelocity = 0;
    let yVelocity = 0;

    let lastFrame = 0;
    const maxDelta = 60;
    const deltaBase = 1000 / 60;

    let movementLocked = false;

    const lockMovement = () => {
        movementLocked = true;
        xVelocity = 0;
        yVelocity = 0;
    }

    const unlockMovement = () => {
        movementLocked = false;
    }

    let yMovementEnabled = false;

    const lockYMovement = () => {
        yMovementEnabled = false;
    }
    const unlockYMovement = () => {
        yMovementEnabled = true;
    }


    const processMovement = delta => {

        if(movementLocked) {
            return;
        }

        const accel =       0.001 * delta;
        const decel =       0.003 * delta;
        const maxXVelocity = 0.01 * delta;
        const maxYVelocity = 0.015 * delta;

        if(xDelta > 0) {
            if(xVelocity < 0) {
                xVelocity = 0;
            }
            xVelocity += accel;
        } else if(xDelta < 0) {
            if(xVelocity > 0) {
                xVelocity = 0;
            }
            xVelocity -= accel;
        } else {
            if(xVelocity > 0) {
                xVelocity -= decel;
                if(xVelocity < 0) {
                    xVelocity = 0;
                }
            } else if(xVelocity < 0) {
                xVelocity += decel;
                if(xVelocity > 0) {
                    xVelocity = 0;
                }
            }
        }
        if(xVelocity > maxXVelocity) {
            xVelocity = maxXVelocity;
        } else if(xVelocity < -maxXVelocity) {
            xVelocity = -maxXVelocity;
        }

        if(yDelta > 0) {
            if(yVelocity < 0) {
                yVelocity = 0;
            }
            yVelocity += accel;
        } else if(yDelta < 0) {
            if(yVelocity > 0) {
                yVelocity = 0;
            }
            yVelocity -= accel;
        } else {
            if(yVelocity > 0) {
                yVelocity -= decel;
                if(yVelocity < 0) {
                    yVelocity = 0;
                }
            } else if(yVelocity < 0) {
                yVelocity += decel;
                if(yVelocity > 0) {
                    yVelocity = 0;
                }
            }
        }
        if(yVelocity > maxYVelocity) {
            yVelocity = maxYVelocity;
        } else if(yVelocity < -maxYVelocity) {
            yVelocity = -maxYVelocity;
        }

        if(xVelocity !== 0) {
            x -= xVelocity;
        }
        if(yVelocity !== 0 && yMovementEnabled) {
            y -= yVelocity;
        }


        if(x < -0.35) {
            x = -0.35;
        } else if(x > 0.35) {
            x = 0.35;
        }

        if(y < 0) {
            y = 0;
        } else if(y > 1) {
            y = 1;
        }
    }


    this.render = timestamp => {
        let delta = timestamp - lastFrame;
        if(delta > maxDelta) {
            delta = maxDelta;
        }
        delta /= deltaBase;
        lastFrame = timestamp;

        processMovement(delta);

        renderSky();
        renderGround(x,y);
        renderForeground(timestamp,x,y);


        renderHeadcons();
    }
}
export default SomethingDifferentRenderer;
