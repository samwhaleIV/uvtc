import MultiLayer from "./components/multi-layer.js";
import TheseHands from "./components/battle/these-hands.js";
import HeartDisplay from "./components/battle/heart-display.js";
import GetOpponent from "./components/battle/opponent.js";
import GetPunchImpactEffect from "./components/battle/punch-effect.js";
import ApplyTimeoutManager from "./components/inline-timeout.js";
import FistBattleApplicator from "../runtime/battle/battle-applicator.js";
import RoundSplashEffect from "./components/battle/round-splash.js";

const textureSize = 16;
const halftextureSize = textureSize / 2;

const START_DELAY = 500;

const xLimit =      0.35;
const minimumX =   -xLimit;
const maximumX =    xLimit;
const minimumY =    0.18;
const maximumY =    0.7;

const foregroundYRetargetStart =    1.4;
const foregroundYRetargetEnd =      2.5;
const depthFactor =                 0.5;
const foregroundYContrast =         100;
const foregroundYOffset =          -100;
const topLayerYOffset =            -150;
const frontLayerDepthAdjustment =   2.5;
const frontLayerSpecialModifier =   10;

const skewAmount =          0.5;
const skewCenterPush =      200;
const groundHeightFactor =  4;
const groundDepthFactor =   4;
const groundXDampening =    3;
const groundYModifier =     2;

const baseXAccel =          0.0015;
const baseXDecel =          0.003;
const baseYAccel =          0.0015;
const baseYDecel =          0.003;
const baseMaxXVelocity =    0.01;
const baseMaxYVelocity =    0.02;

const defaultFogColor = "rgba(255,255,255,0.6)";

const maxFrameDifference = 60;
const deltaBase = 1000 / 60;

const xStart = 0;
const yStart = 0;

const halfHeadconWidth =    180;
const headconDistance =     60;
const headconHeight =       60;
const headconIconSize =     90;
const headconMargin =       5;
const innerHeadconSize = headconHeight - headconMargin - headconMargin;

const minimumYPunchDistance = 0.6;
const minimumXPunchDistance = 120;

const selfImpactDuration =  80;
const selfImpactIntensity = 0.4;

const damageSoundPunchDuration = 0.15;

const DEFAULT_MAX_HEALTH = 10;
const HEAL_RATE_FACTOR = 100;

function HealthController(maxHealth,heartRenderID,damageCallback,fatalCallback) {
    if(!maxHealth) {
        maxHealth = DEFAULT_MAX_HEALTH;
    }

    let health = maxHealth;
    this.getValue = () => health;
    this.getNormal = () => health / maxHealth;

    this.damage = amount => {
        health -= amount;
        damageCallback.call(null,amount);
        if(health <= 0) {
            health = 0;
            fatalCallback.call(null);
        }
    }

    this.heal = amount => {
        health += amount;
        if(health > maxHealth) {
            health = maxHealth;
        }
    }

    this.restore = () => health = maxHealth;

    const heartDisplay = new HeartDisplay(heartRenderID);
    this.render = (timestamp,x,y,size) => heartDisplay.render(timestamp,x,y,size,health / maxHealth);
    this.healCycle = delta => {
        const healDelta = maxHealth / HEAL_RATE_FACTOR * delta;
        if(health < maxHealth) {
            health += healDelta;
        }
        if(health > maxHealth) {
            health = maxHealth;
        }
    }
}

function FistBattleRenderer(winCallback,loseCallback,opponentSequencer) {

    ApplyTimeoutManager(this);

    let x = xStart;
    let y = yStart;

    let xDelta = 0;
    let yDelta = 0;

    let xVelocity = 0;
    let yVelocity = 0;

    let lastFrame = 0;
    let movementLocked = true;

    this.lockMovement = () => {
        movementLocked = true;
    }
    this.unlockMovement = () => {
        movementLocked = false;
    }

    const movementLockedOrPunching = () => movementLocked || this.hands.punching;
    const showPunchEffect = () => this.hands.punching && !noPunchEffect;

    this.fogColor = defaultFogColor;

    let noPunchEffect = true;

    this.opponentSprite = null;
    this.opponent = GetOpponent.call(this);

    this.backgroundEffects = new MultiLayer();
    this.foregroundEffects = new MultiLayer();
    this.globalEffects = new MultiLayer();

    this.hands = new TheseHands(this,null);//todo supply slots

    this.forcedSizeMode = "fit";
    this.tileset = null;
    const worldTileset = imageDictionary["world-tileset"];
    const headcons = imageDictionary["battle/headcon"];
    const getWorldTextureX = ID => ID % WorldTextureColumns * WorldTextureSize;
    const getWorldTextureY = ID => Math.floor(ID / WorldTextureColumns) * WorldTextureSize;

    const foregroundLayer1 = [];
    const foregroundLayer2 = [];
    const foregroundLayer3 = [];

    const headconMap = [
        {icon:0,lost:false},
        {icon:0,lost:false},
        {icon:0,lost:false},

        {icon:1,lost:false},
        {icon:1,lost:false},
        {icon:1,lost:false}
    ];
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

    let opponentLives = 3;
    let playerLives = 3;

    const updateLives = isPlayer => {
        let l1 = true, l2 = true, l3 = true;
        switch(opponentLives) {
            default:
            case 3: l3 = false;
            case 2: l2 = false;
            case 1: l1 = false;
            case 0: break;
        }
        if(isPlayer) {
            this.setHeadconLost(5,l3);
            this.setHeadconLost(4,l2);
            this.setHeadconLost(3,l1);
        } else {
            this.setHeadconLost(0,l3);
            this.setHeadconLost(1,l2);
            this.setHeadconLost(2,l1);
        }

    }
    const updateOpponentLives = () => updateLives(false);
    const updatePlayerLives = () => updateLives(true);

    const renderHeadcons = () => {
        context.translate(halfWidth-halfHeadconWidth,0);
        context.fillStyle = "black";
        context.fillRect(0,0,halfHeadconWidth,headconHeight);
        context.fillStyle = "white";
        context.fillRect(halfHeadconWidth,0,halfHeadconWidth,headconHeight);

        context.translate(headconMargin,headconMargin);
        for(let i = 0;i<6;i++) {
            const map = headconMap[i];
            let iconX = map.icon * headconIconSize;
            let iconY = map.lost ? headconIconSize : 0;
            context.drawImage(
                headcons,
                iconX,iconY,
                headconIconSize,headconIconSize,
                i*headconDistance,0,
                innerHeadconSize,innerHeadconSize
            );
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

    this.getForegroundObject = (startTextureID,width,height,posX,scale) => {
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

    opponentSequencer.call(this,specification=>{
        FistBattleApplicator.call(this,
            [foregroundLayer1,foregroundLayer2,foregroundLayer3],
            specification
        );
    });

    const renderSky = () => context.drawImage(this.tileset,48,16,16,16,0,0,fullWidth,fullHeight);

    const renderGround = (xNormal,depthNormal) => {
        depthNormal = Math.max(-(depthNormal - 1) / groundDepthFactor,0);
        const renderHeight = fullHeight / groundHeightFactor;
        const groundTop = fullHeight - renderHeight;
        const adjustedTextureY = Math.max(depthNormal * groundYModifier * textureSize,0);
        const adjustedTextureX = -xNormal / groundXDampening * textureSize + textureSize;

        context.drawImage(this.tileset,48,0,16,16,0,groundTop,fullWidth,renderHeight);
        context.save();
        context.setTransform(1,0,-skewAmount,1,skewCenterPush,0);
        context.drawImage(
            this.tileset,
            adjustedTextureX,adjustedTextureY,
            halftextureSize,textureSize,

            0,groundTop,
            halfWidth,renderHeight
        );
        context.setTransform(1,0,skewAmount,1,-skewCenterPush,0);
        context.drawImage(
            this.tileset,
            adjustedTextureX+halftextureSize,adjustedTextureY,
            halftextureSize,textureSize,

            halfWidth,groundTop,
            halfWidth,renderHeight
        );
        context.restore();
    }
    const renderFog = (xPixelOffset,yPixelOffset) => {
        context.fillStyle = this.fogColor;
        context.fillRect(-xPixelOffset,-yPixelOffset,fullWidth+xPixelOffset*2,fullHeight+yPixelOffset*2);
    }
    this.lastOpponentCenterX = 0;
    const renderForeground = (timestamp,xNormal,depthNormal,xPixelOffset,yPixelOffset) => {
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
        
        let thirdDepthX = (fullWidth - thirdDepthScale * fullWidth) / 2;
        thirdDepthX += xOffset * thirdDepthScale;
        let thirdDepthY = (fullHeight - thirdDepthHeight) / 2;
        thirdDepthX += foregroundYContrast / thirdDepthScale + foregroundYOffset;
        
        let secondDepthX = (fullWidth - secondDepthScale * fullWidth) / 2
        secondDepthX += xOffset * secondDepthScale;
        let secondDepthY = (fullHeight - secondDepthHeight) / 2;
        secondDepthY += foregroundYContrast / secondDepthScale + foregroundYOffset;
        
        let firstDepthX = (fullWidth - firstDepthScale * fullWidth) / 2;
        firstDepthX += xOffset * firstDepthScale;
        let firstDepthY = (fullHeight - firstDepthHeight) / 2;
        firstDepthY += foregroundYContrast / firstDepthScale + topLayerYOffset;
        
        let fourthDepthX = (fullWidth - fourthDepthScale * fullWidth) / 2;
        fourthDepthX += xOffset * fourthDepthScale - opponentXOffset;
        let fourthDepthY = (fullHeight - fourthDepthHeight) / 2;

        const adjustedFourthLayerDepth = Math.min(
            depthNormal - frontLayerDepthAdjustment,0
        );
        fourthDepthY -= adjustedFourthLayerDepth * frontLayerSpecialModifier;

        thirdDepthX += xPixelOffset;
        secondDepthX += xPixelOffset;
        firstDepthX += xPixelOffset;
        fourthDepthX += xPixelOffset;

        thirdDepthY += yPixelOffset;
        secondDepthY += yPixelOffset;
        firstDepthY += yPixelOffset;
        fourthDepthY += yPixelOffset;

        this.lastOpponentCenterX = fourthDepthX + (fullWidth * fourthDepthScale / 2);
        
        let i;
        context.save();
        context.setTransform(
            firstDepthScale,0,0,
            firstDepthScale,firstDepthX,firstDepthY
        );
        for(i = 0;i<foregroundLayer1.length;i++) {
            renderForegroundObject(foregroundLayer1[i]);
        }
        context.resetTransform();
        renderFog(xPixelOffset,yPixelOffset);
        context.setTransform(
            secondDepthScale,0,0,
            secondDepthScale,secondDepthX,secondDepthY
        );
        for(i = 0;i<foregroundLayer2.length;i++) {
            renderForegroundObject(foregroundLayer2[i]);
        }
        context.resetTransform();
        renderFog(xPixelOffset,yPixelOffset);
        context.setTransform(
            thirdDepthScale,0,0,
            thirdDepthScale,thirdDepthX,thirdDepthY
        );
        for(i = 0;i<foregroundLayer3.length;i++) {
            renderForegroundObject(foregroundLayer3[i]);
        }
        context.setTransform(
            fourthDepthScale,0,0,
            fourthDepthScale,fourthDepthX,fourthDepthY
        );
        if(this.backgroundEffects) {
            this.backgroundEffects.render(timestamp)
        }
        this.opponent.render(timestamp,showPunchEffect());
        if(this.foregroundEffects) {
            this.foregroundEffects.render(timestamp);
        }
        context.restore();
    }

    let wDown, sDown, aDown, dDown;
    this.processKey = key => {
        switch(key) {
            case kc.up:    if(wDown) return; yDelta--; wDown = true; break;
            case kc.down:  if(sDown) return; yDelta++; sDown = true; break;
            case kc.left:  if(aDown) return; xDelta--; aDown = true; break;
            case kc.right: if(dDown) return; xDelta++; dDown = true; break;
        }
    }
    this.processKeyUp = key => {
        switch(key) {
            case kc.up:    if(wDown) yDelta++; wDown = false; break;
            case kc.down:  if(sDown) yDelta--; sDown = false; break;
            case kc.left:  if(aDown) xDelta++; aDown = false; break;
            case kc.right: if(dDown) xDelta--; dDown = false; break;
        }
    }

    this.getPlayerOpponentDistance = () => {
        const yDistance = Math.max(0,1 - y - this.opponent.y);
        const xDistance = Math.abs(halfWidth - this.lastOpponentCenterX);
        const inRange = yDistance <= minimumYPunchDistance && xDistance <= minimumXPunchDistance;
        return {
            xDistance: xDistance,
            yDistance: yDistance,
            inRange: inRange
        };
    }

    this.processClick = () => {
        if(this.showingMessage) {
            this.hands.punch(()=>{
                playSound("damage",damageSoundPunchDuration);
                this.showingMessage.progress();
                noPunchEffect = true;
            });
            return;
        }
        if(movementLocked) {
            return;
        }
        if(this.getPlayerOpponentDistance().inRange) {
            this.hands.punch(()=>{
                this.foregroundEffects.addLayer(GetPunchImpactEffect.call(this));
                playSound("damage",damageSoundPunchDuration);
                this.damageOpponent(1);
                noPunchEffect = false;
            });
        } else if(!this.hands.punching) {
            this.hands.punch();
            noPunchEffect = true;
        }
    }

    const velocityLimiter = (velocity,maxVelocity) => {
        if(velocity > maxVelocity) {
            velocity = maxVelocity;
        } else if(velocity < -maxVelocity) {
            velocity = -maxVelocity;
        }
        return velocity;
    }

    const velocityChange = (velocity,delta,accel,decel) => {
        if(delta > 0) {
            if(velocity < 0) velocity = 0; velocity += accel;
        } else if(delta < 0) {
            if(velocity > 0) velocity = 0; velocity -= accel;
        } else if(velocity > 0) {
            velocity -= decel; if(velocity < 0) velocity = 0;
        } else if(velocity < 0) {
            velocity += decel; if(velocity > 0) velocity = 0;
        }
        return velocity;
    }

    const hardPositionLimiter = (value,minValue,maxValue,velocity,decel) => {
        if(value < minValue) {
            value = minValue;
            velocity += decel;
            if(velocity > 0) {
                velocity = 0;
            }
        } else if(value > maxValue) {
            value = maxValue;
            velocity -= decel;
            if(velocity < 0) {
                velocity = 0;
            }
        }
        return {
            value: value,
            velocity: velocity
        }
    }

    const processMovement = (delta,timestamp) => {

        const movementLocked = movementLockedOrPunching();

        const xDeltaMask = movementLocked ? 0 : xDelta;
        const yDeltaMask = movementLocked ? 0 : yDelta;

        const xAccel = baseXAccel * delta;
        const xDecel = baseXDecel * delta;

        const yAccel = baseYAccel * delta;
        const yDecel = baseYDecel * delta;

        const maxXVelocity = baseMaxXVelocity * delta;
        const maxYVelocity = baseMaxYVelocity * delta;

        xVelocity = velocityLimiter(
            velocityChange(xVelocity,xDeltaMask,xAccel,xDecel),
            maxXVelocity
        );
        yVelocity = velocityLimiter(
            velocityChange(yVelocity,yDeltaMask,yAccel,yDecel),
            maxYVelocity
        );

        if(!movementLocked) {
            if(xVelocity) x -= xVelocity;
            if(yVelocity) y -= yVelocity;
        }

        const xHardLimitResult = hardPositionLimiter(x,minimumX,maximumX,xVelocity,xDecel);
        x = xHardLimitResult.value;
        xVelocity = xHardLimitResult.velocity;

        const yHardLimitResult = hardPositionLimiter(y,minimumY,maximumY,yVelocity,yDecel);
        y = yHardLimitResult.value;
        yVelocity = yHardLimitResult.velocity;

        this.hands.setSway(
            Math.abs(xVelocity)/maxXVelocity,
            Math.abs(yVelocity)/maxYVelocity,
            timestamp
        );
    }

    let roundNumber = 1;
    this.endRound = playerWon => {
        this.lockMovement();
        if(playerWon) {
            opponentLives--;
            updateOpponentLives();
        } else {
            playerLives--;
            updatePlayerLives();
        }
        (async ()=>{
            if(playerLives <= 0 || opponentLives <= 0) {
                await this.gameOver(playerWon,roundNumber);
                if(playerWon) {
                    winCallback.call(null);
                } else {
                    loseCallback.call(null);
                }
                return;
            }
            await this.roundEnd(playerWon,roundNumber);
            roundNumber++;
            await delay(1000);
            this.healBattlers = true;
            await this.showRoundBanner(roundNumber);
            this.healBattlers = false;
            await this.roundStart(playerWon,roundNumber);
            this.unlockMovement();
        })();
    }
    (async ()=>{
        await delay(faderTime/2+START_DELAY);
        await this.gameStart();
        await delay(500);
        await this.showRoundBanner(roundNumber);
        this.unlockMovement();
    })();

    this.showRoundBanner = roundNumber => {
        return new Promise(resolve => {
            let effect;
            const clearEffect = () => {
                effect.terminate();
                resolve();
            }
            effect = new RoundSplashEffect(roundNumber,clearEffect);
            this.globalEffects.addLayer(effect);
        });
    }

    let impactStart = null;
    this.playerImpact = () => {
        impactStart = performance.now();
        playSound("ouch");
    }
    const playerHealthController = new HealthController(
        this.playerMaxHealth,this.playerHeartID || 0,
        damageAmount => {
            this.playerImpact();
            this.playerInjured(damageAmount);
        },
        this.endRound.bind(this,false)
    );
    const opponentHealthController = new HealthController(
        this.opponentMaxHealth,this.opponentHeartID || 1,
        this.opponentInjured,
        this.endRound.bind(this,true)
    );

    this.damagePlayer = amount => playerHealthController.damage(amount);
    this.damageOpponent = amount => opponentHealthController.damage(amount);
    this.healPlayer = amount => playerHealthController.heal(amount);
    this.healOpponent = amount => opponentHealthController.heal(amount);
    this.restorePlayerHealth = () => playerHealthController.restore();
    this.restoreOpponentHealth = () => opponentHealthController.restore();

    this.render = timestamp => {
        this.processThreads(timestamp);
        let delta = timestamp - lastFrame;
        if(delta > maxFrameDifference) {
            delta = maxFrameDifference;
        }
        delta /= deltaBase;
        lastFrame = timestamp;
        processMovement(delta,timestamp);

        let foregroundXOffset = 0;
        let foregroundYOffset = 0;

        let renderY = y;
        let impactDelta = 0;
        if(impactStart !== null) {
            impactDelta = (timestamp - impactStart) / selfImpactDuration;
            if(impactDelta > 1) {
                impactDelta = 1;
                impactStart = 0;
            }
            impactDelta
            if(impactDelta * 2 > 1) {
                impactDelta = 1 - impactDelta;
            } else {
                impactDelta /= 2;
            }
            impactDelta = -impactDelta;
            renderY += impactDelta * selfImpactIntensity;

            const offsetAmount = 15;
            foregroundYOffset += Math.round(Math.random()) ? offsetAmount * impactDelta : offsetAmount * -impactDelta;
        }

        renderSky();
        renderGround(x,renderY);

        if(showPunchEffect()) {
            foregroundXOffset += Math.round(Math.random()*2);
            foregroundYOffset += Math.round(Math.random()*2);
        }

        this.opponent.movementLogic(delta);

        renderForeground(timestamp,x,renderY,foregroundXOffset,foregroundYOffset,delta);


        this.hands.render(timestamp);

        if(impactDelta) {
            context.fillStyle = `rgba(255,0,0,${Math.abs(impactDelta)/2})`;
            context.fillRect(0,0,fullWidth,fullHeight);
        }

        renderHeadcons();

        if(this.healBattlers) {
            playerHealthController.healCycle(delta);
            opponentHealthController.healCycle(delta);
        }

        opponentHealthController.render(timestamp,100,100,100);
        playerHealthController.render(timestamp,fullWidth-100,fullHeight-100,100);

        if(this.globalEffects) {
            this.globalEffects.render(timestamp);
        }
    }
}
export default FistBattleRenderer;
