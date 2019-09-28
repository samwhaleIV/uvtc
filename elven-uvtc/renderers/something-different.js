import SpriteForeground from "./components/battle/sprite-foreground.js";
import CrazyFlyingShitEffect from "./components/crazy-flying-shit.js";
import MultiLayer from "./components/multi-layer.js";
import TheseHands from "./components/battle/these-hands.js";
import LoveAndCrystals from "./components/battle/love-and-crystals.js";

const textureSize = 16;
const halftextureSize = textureSize / 2;

const xLimit = 0.35;
const minimumX = -xLimit;
const maximumX = xLimit;
const minimumY = 0;
const maximumY = 1;

const foregroundYRetargetStart = 1.4;
const foregroundYRetargetEnd = 2.5;
const depthFactor = 0.5;
const foregroundYContrast = 100;
const foregroundYOffset = -100;
const topLayerYOffset = -150;
const frontLayerDepthAdjustment = 2.5;
const frontLayerSpecialModifier = 10;

const skewAmount = 0.5;
const skewCenterPush = 200;
const groundHeightFactor = 4;
const groundDepthFactor = 4;
const groundXDampening = 3;
const groundYModifier = 2;

const baseXAccel =       0.001;
const baseXDecel =       0.003;
const baseYAccel =       0.001;
const baseYDecel =       0.003;
const baseMaxXVelocity = 0.01;
const baseMaxYVelocity = 0.015;

const opponentSpriteOffset = 0.2;
const spriteScale = 120;

const defaultFogColor = "rgba(255,255,255,0.6)";

const maxDelta = 60;
const deltaBase = 1000 / 60;

const xStart = 0;
const yStart = 0.35;

function SomethingDifferentRenderer() {

    let x = xStart;
    let y = yStart;

    let xDelta = 0;
    let yDelta = 0;

    let xVelocity = 0;
    let yVelocity = 0;

    let lastFrame = 0;
    let movementLocked = false;

    this.lockMovement = () => {
        movementLocked = true;
        xVelocity = 0;
        yVelocity = 0;
    }
    this.unlockMovement = () => {
        movementLocked = false;
    }

    let fogColor = defaultFogColor;

    let opponentSprite = null;
    this.opponent = {
        y: 0,
        x: 0,
        render: timestamp => {
            opponentSprite.render(timestamp,spriteScale);
            //todo render this.opponentHeart
        }
    }
    this.backgroundEffects = new MultiLayer();
    this.foregroundEffects = new MultiLayer();
    this.globalEffects = new MultiLayer();

    this.hands = new TheseHands(this,null);//todo supply slots
    this.playerHeart = new LoveAndCrystals(this,null);//todo slots
    this.opponentHeart = new LoveAndCrystals(this,null);//todo slots

    this.forcedSizeMode = "fit";
    let tileset = null;
    const worldTileset = imageDictionary["world-tileset"];
    const headcons = imageDictionary["battle/headcon"];
    const getWorldTextureX = ID => ID % WorldTextureColumns * WorldTextureSize;
    const getWorldTextureY = ID => Math.floor(ID / WorldTextureColumns) * WorldTextureSize;

    const foregroundLayer1 = [];
    const foregroundLayer2 = [];
    const foregroundLayer3 = [];

    let headconMap = null;
    this.setHeadconIcon = (index,iconID=0) => {
        const item = headconMap[index];
        if(item) {
            item.icon = iconID;
        } else {
            console.warn("No headcon at index " + index);
        }
    };
    this.setHeadconLost = (index,value=false) => {
        const item = headconMap[index];
        if(item) {
            item.lost = value;
        } else {
            console.warn("No headcon at index " + index);
        }
    }

    const renderHeadcons = () => {
        const halfBarWidth = 180;
        const headconDistance = halfBarWidth/3;
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
            context.drawImage(headcons,iconX,iconY,90,90,i*headconDistance,0,50,50);
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

    const loadBattleSpecifics = () => {
        //DEBUG
        //todo isolation
        const getTree = posX => {
            return getForegroundObject(116,2,4,posX,8);
        }
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
        this.backgroundEffects.addLayer(new CrazyFlyingShitEffect());
        opponentSprite = new SpriteForeground("wimpy-red-elf",true,null,null,opponentSpriteOffset);
        tileset = imageDictionary["battle/test-tileset"];
        fogColor = defaultFogColor;
        headconMap = [
            {icon:0,lost:true},
            {icon:0,lost:false},
            {icon:0,lost:false},
    
            {icon:1,lost:false},
            {icon:1,lost:false},
            {icon:1,lost:true}
        ];
    }
    loadBattleSpecifics();

    const renderSky = () => {
        context.drawImage(tileset,48,16,16,16,0,0,fullWidth,fullHeight);
    }

    const renderGround = (xNormal,depthNormal) => {
        depthNormal = Math.max(-(depthNormal - 1) / groundDepthFactor,0.01);

        const renderHeight = fullHeight / groundHeightFactor;

        const groundTop = fullHeight - renderHeight;

        const adjustedTextureY = Math.max(depthNormal * groundYModifier * textureSize,0.0001);

        const adjustedTextureX = -xNormal / groundXDampening * textureSize + textureSize;

        context.drawImage(tileset,48,0,16,16,0,groundTop,fullWidth,renderHeight);

        context.setTransform(1,0,-skewAmount,1,skewCenterPush,0);
        context.drawImage(
            tileset,
            adjustedTextureX,adjustedTextureY,
            halftextureSize,textureSize,

            0,groundTop,
            halfWidth,renderHeight
        );
        context.setTransform(1,0,skewAmount,1,-skewCenterPush,0);
        context.drawImage(
            tileset,
            adjustedTextureX+halftextureSize,adjustedTextureY,
            halftextureSize,textureSize,

            halfWidth,groundTop,
            halfWidth,renderHeight
        );

        context.resetTransform();
    }
    const renderFog = () => {
        context.fillStyle = fogColor;
        context.fillRect(0,0,fullWidth,fullHeight);
    }
    const renderForeground = (timestamp,xNormal,depthNormal) => {
        depthNormal = foregroundYRetargetStart + (foregroundYRetargetEnd - foregroundYRetargetStart) * depthNormal;

        const firstDepthScale = Math.pow(depthNormal / 8,depthFactor);
        const secondDepthScale = Math.pow(depthNormal / 4,depthFactor);
        const thirdDepthScale = Math.pow(depthNormal / 2,depthFactor);
        const fourthDepthScale = depthNormal + this.opponent.y;

        const xOffset = halfWidth * xNormal;

        const firstDepthHeight = firstDepthScale * fullHeight;
        const secondDepthHeight = secondDepthScale * fullHeight;
        const thirdDepthHeight = thirdDepthScale * fullHeight;
        const fourthDepthHeight = fourthDepthScale * fullHeight;

        const opponentXOffset = this.opponent.x * halfWidth;
        
        const thirdDepthX = (fullWidth   - thirdDepthScale  * fullWidth)  /  2 + xOffset * thirdDepthScale;
        const thirdDepthY = (fullHeight - thirdDepthHeight) / 2 + foregroundYContrast / thirdDepthScale + foregroundYOffset;

        const secondDepthX = (fullWidth  - secondDepthScale * fullWidth)  /  2 + xOffset * secondDepthScale;
        const secondDepthY =(fullHeight - secondDepthHeight) / 2 + foregroundYContrast / secondDepthScale + foregroundYOffset;

        const firstDepthX = (fullWidth   - firstDepthScale  * fullWidth)  /  2 + xOffset * firstDepthScale;
        const firstDepthY = (fullHeight - firstDepthHeight) / 2 + foregroundYContrast / firstDepthScale + topLayerYOffset;

        const fourthDepthX = (fullWidth   - fourthDepthScale  * fullWidth)  /  2 + xOffset * fourthDepthScale - opponentXOffset;
        const fourthDepthY = (fullHeight - fourthDepthHeight) / 2 - Math.min(depthNormal - frontLayerDepthAdjustment,0) * frontLayerSpecialModifier;

        let i;
        context.setTransform(firstDepthScale,0,0,firstDepthScale,firstDepthX,firstDepthY);
        for(i = 0;i<foregroundLayer1.length;i++) {
            renderForegroundObject(foregroundLayer1[i]);
        }
        context.resetTransform();
        renderFog();
        context.setTransform(secondDepthScale,0,0,secondDepthScale,secondDepthX,secondDepthY);
        for(i = 0;i<foregroundLayer2.length;i++) {
            renderForegroundObject(foregroundLayer2[i]);
        }
        context.resetTransform();
        renderFog();
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

    const processMovement = delta => {
        if(movementLocked) {
            return;
        }

        const xAccel = baseXAccel * delta;
        const xDecel = baseXDecel * delta;

        const yAccel = baseYAccel * delta;
        const yDecel = baseYDecel * delta;

        const maxXVelocity = baseMaxXVelocity * delta;
        const maxYVelocity = baseMaxYVelocity * delta;

        if(xDelta > 0) {
            if(xVelocity < 0) {
                xVelocity = 0;
            }
            xVelocity += xAccel;
        } else if(xDelta < 0) {
            if(xVelocity > 0) {
                xVelocity = 0;
            }
            xVelocity -= xAccel;
        } else {
            if(xVelocity > 0) {
                xVelocity -= xDecel;
                if(xVelocity < 0) {
                    xVelocity = 0;
                }
            } else if(xVelocity < 0) {
                xVelocity += xDecel;
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
            yVelocity += yAccel;
        } else if(yDelta < 0) {
            if(yVelocity > 0) {
                yVelocity = 0;
            }
            yVelocity -= yAccel;
        } else {
            if(yVelocity > 0) {
                yVelocity -= yDecel;
                if(yVelocity < 0) {
                    yVelocity = 0;
                }
            } else if(yVelocity < 0) {
                yVelocity += yDecel;
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
        if(yVelocity !== 0) {
            y -= yVelocity;
        }

        if(x < minimumX) {
            x = minimumX;
        } else if(x > maximumX) {
            x = maximumX;
        }

        if(y < minimumY) {
            y = minimumY;
        } else if(y > maximumY) {
            y = maximumY;
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
        this.hands.render(timestamp);
        //this.playerHeart.render(timestamp); TODO
        if(this.globalEffects) {
            this.globalEffects.render(timestamp);
        }
    }
}
export default SomethingDifferentRenderer;
