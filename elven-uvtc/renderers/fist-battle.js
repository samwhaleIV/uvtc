import MultiLayer from "../../../elven-engine/renderers/components/multi-layer.js";
import Fists from "./components/battle/weapons/fists.js";
import HeartDisplay from "./components/battle/heart-display.js";
import GetOpponent from "./components/battle/opponent.js";
import ApplyTimeoutManager from "../../../elven-engine/runtime/inline-timeout.js";
import BattleApplicator from "../runtime/battle/battle-applicator.js";
import RoundSplashEffect from "./components/battle/round-splash.js";
import SpriteForeground from "./components/battle/sprite-foreground.js";
import MovesManager from "../runtime/moves-manager.js";
import SnowballWeapon from "./components/battle/weapons/snowball.js";

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

const minimumYPunchDistance = 0.6;
const minimumXPunchDistance = 120;

const selfImpactDuration =  80;
const selfImpactIntensity = 0.4;

const DEFAULT_MAX_HEALTH = 10;
const HEAL_RATE_FACTOR = 100;

const headconIconSize = 90;
const headconMargin = 5;

const PUNCH_EFFECT_DURATION = 100;

function GetPlayerWeapon(battle) {
    let weaponName;
    if(ENV_FLAGS.WEAPON_OVERRIDE) {
        weaponName = ENV_FLAGS.WEAPON_OVERRIDE;
    } else {
        weaponName = MovesManager.getSlot("attack").name
    }
    switch(weaponName) {
        default:
        case "Wimpy":
            return new Fists(battle);
        case "Snowball":
            return new SnowballWeapon(battle);
    }
}

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
    this.render = (timestamp,x,y,size) => {
        heartDisplay.render(timestamp,x,y,size,health / maxHealth);
    }
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

    this.disableAdaptiveFill = true;
    this.noPixelScale = true;

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

    this.isMovementLocked = () => movementLocked;

    let punchEffectStart = -10000;

    this.movementLockedOrAttacking = () => movementLocked || this.weapon.attacking;
    this.punchEffect = () => {
        punchEffectStart = performance.now();
    }
    const showPunchEffect = timestamp => {
        return timestamp - punchEffectStart < PUNCH_EFFECT_DURATION;
    }

    this.fogColor = defaultFogColor;

    this.opponent = GetOpponent.call(this);

    this.staticBackgroundEffects = new MultiLayer();
    this.backgroundEffects = new MultiLayer();
    this.foregroundEffects = new MultiLayer();
    this.globalEffects = new MultiLayer();

    this.weapon = GetPlayerWeapon(this);

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
        switch(
            isPlayer ? playerLives : opponentLives
        ) {
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
        const halfHeadconWidth = Math.ceil((150 * (fullWidth / internalWidth))/3)*3;
        const headconHeight = halfHeadconWidth / 3;
        const innerHeadconSize = headconHeight - headconMargin - headconMargin;

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
                i*headconHeight,0,
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
            fullHeight - foregroundObject.renderHeight,
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
            renderXOffset: -renderWidth / 2
        }
    }

    opponentSequencer.call(this,specification=>{
        BattleApplicator.call(this,
            [foregroundLayer1,foregroundLayer2,foregroundLayer3],
            specification
        );
    });
    this.opponent.sprite = new SpriteForeground(...this.opponentSpriteParameters);

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
    const renderFog = () => {
        context.fillStyle = this.fogColor;
        context.fillRect(0,0,fullWidth,fullHeight);
    }
    this.lastOpponentCenterX = 0;

    const getLayerTransformMatrix = (scale,xNormal,xOffset,yOffset,verticalShift,center) => {
        const newWidth = fullWidth * scale;
        const newHeight = fullHeight * scale;
        let newY;
        if(center) {
            newY = (fullHeight - newHeight) / 2;
        } else {
            newY = fullHeight - newHeight + scale * verticalShift;
        }
        let newX = (fullWidth - newWidth) / 2;
        newX += xNormal * newWidth / 2;
        return [scale,0,0,scale,newX + xOffset,newY + yOffset];
    }
    const renderLayer = (transformMatrix,objects,postFog) => {
        context.setTransform.apply(context,transformMatrix);
        for(let i = 0;i<objects.length;i++) {
            renderForegroundObject(objects[i]);
        }
        context.resetTransform();
        if(postFog) {
            renderFog();
        }
    }
    const renderForeground = (timestamp,xNormal,depthNormal,xPixelOffset,yPixelOffset) => {
        depthNormal = foregroundYRetargetStart + (foregroundYRetargetEnd - foregroundYRetargetStart) * depthNormal;

        const widthFovScale = fullWidth / 1000;
        depthNormal *= widthFovScale;
        xNormal /= widthFovScale;

        const opponentXOffset = -this.opponent.x * halfWidth;
        const layer4 = getLayerTransformMatrix(
            depthNormal + this.opponent.y,
            xNormal,
            xPixelOffset + opponentXOffset,
            yPixelOffset,null,true
        );

        yPixelOffset -= fullHeight / groundHeightFactor;

        const baseVerticalShift = 50;
        const layer1 = getLayerTransformMatrix(
            Math.pow(depthNormal / 8,0.9),xNormal,xPixelOffset,yPixelOffset,baseVerticalShift
        );
        const layer2 = getLayerTransformMatrix(
            Math.pow(depthNormal / 4,0.7),xNormal,xPixelOffset,yPixelOffset,baseVerticalShift
        );
        const layer3 = getLayerTransformMatrix(
            Math.pow(depthNormal / 2,0.5),xNormal,xPixelOffset,yPixelOffset,baseVerticalShift
        );

        const layer4Scale = layer4[0];
        this.lastOpponentCenterX = layer4[4] + (fullWidth * layer4Scale / 2);
        
        context.save();
        renderLayer(layer1,foregroundLayer1,true);
        renderLayer(layer2,foregroundLayer2,true);
        renderLayer(layer3,foregroundLayer3,false);

        context.setTransform.apply(context,layer4);
        if(this.backgroundEffects) {
            this.backgroundEffects.render(timestamp,layer4Scale)
        }
        this.opponent.render(timestamp,showPunchEffect(timestamp));
        if(this.foregroundEffects) {
            this.foregroundEffects.render(timestamp,layer4Scale);
        }
        context.restore();
    }

    let keyDownLookup = {};
    this.processKey = key => {
        if(key in keyDownLookup) {
            return;
        }
        keyDownLookup[key] = true;
        switch(key) {
            case kc.up:     yDelta--; break;
            case kc.down:   yDelta++; break;
            case kc.left:   xDelta--; break;
            case kc.right:  xDelta++; break;
            case kc.accept: tryPlayerAttack(); break;
        }
        this.weapon.playerInput(key);
    }
    this.processKeyUp = key => {
        if(key in keyDownLookup) {
            delete keyDownLookup[key];
            switch(key) {
                case kc.up:    yDelta++; break;
                case kc.down:  yDelta--; break;
                case kc.left:  xDelta++; break;
                case kc.right: xDelta--; break;
            }
        }
    }

    this.getPlayerOpponentDistance = () => {
        const yDistance = Math.max(0,1 - y - this.opponent.y);
        const xDistance = Math.abs(halfWidth - this.lastOpponentCenterX);
        const xInRange = xDistance <= minimumXPunchDistance * (fullWidth / internalWidth);
        const yInRange = yDistance <= minimumYPunchDistance;
        const inRange = xInRange && yInRange;
        return {
            xDistance: xDistance,
            yDistance: yDistance,
            xInRange: xInRange,
            yInRange: yInRange,
            inRange: inRange
        };
    }

    this.tryPopVisibleMessage = () => {
        if(this.showingMessage) {
            if(this.showingMessage.readyToTerminate) {
                this.showingMessage.progress();
                playSound("text-sound");
                return false;
            }
            return true;
        } else {
            return false;
        }
    }
    
    const tryPlayerAttack = () => {
        this.weapon.attack();
    }

    this.processClick = () => tryPlayerAttack();

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

        const movementLocked = this.movementLockedOrAttacking();

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

        this.weapon.setSway(
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
            await this.delay(1000);
            this.healBattlers = true;
            await this.showRoundBanner(roundNumber);
            this.healBattlers = false;
            await this.roundStart(playerWon,roundNumber);
            this.unlockMovement();
        })();
    }

    this.faderCompleted = async () => {
        await this.delay(START_DELAY);
        await this.gameStart();
        await this.delay(500);
        await this.showRoundBanner(roundNumber);
        await this.roundStart(null,roundNumber)
        this.unlockMovement();
    }

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
        this.staticBackgroundEffects.render(timestamp);
        renderGround(x,renderY);

        if(showPunchEffect(timestamp)) {
            foregroundXOffset += Math.round(Math.random()*2);
            foregroundYOffset += Math.round(Math.random()*2);
        }

        this.opponent.movementLogic(delta);
        renderForeground(timestamp,x,renderY,foregroundXOffset,foregroundYOffset,delta);
        this.weapon.render(timestamp);

        if(impactDelta) {
            context.fillStyle = `rgba(255,0,0,${Math.abs(impactDelta)/2})`;
            context.fillRect(0,0,fullWidth,fullHeight);
        }

        context.resetTransform();

        if(this.healBattlers) {
            playerHealthController.healCycle(delta);
            opponentHealthController.healCycle(delta);
        }

        const margin = 100;
        const size = 150;
        opponentHealthController.render(timestamp,margin,margin,size);
        playerHealthController.render(timestamp,fullWidth-margin,fullHeight-margin,size);

        if(this.globalEffects) {
            this.globalEffects.render(timestamp);
        }

        renderHeadcons();
    }
}
export default FistBattleRenderer;
