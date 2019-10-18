import WeaponBase from "../weapon-base.js";
import GetPunchImpactEffect from "../punch-effect.js";

const FIST_CENTER_OFFSET = 115;
const FIST_Y_OFFSET = 100;
const ALT_FIST_EXTRA_Y_OFFSET = 50;
const PUNCH_DURATION = 120;
const PUNCH_X_DISTANCE = 20;
const PUNCH_Y_DISTANCE = 80;
const FIST_WIDTH = 140;
const FIST_HEIGHT = 500;
const FIST_HALF_HEIGHT = FIST_HEIGHT / 2;
const FIST_HALF_WIDTH = FIST_WIDTH / 2;
const MOVEMENT_TIMEOUT = 30;
const FIST_COLOR = "rgb(5,5,5)";
const IDLE_FIST_ANGLE = Math.PI / 180 * 15;

const PUNCH_SOUND_NAME = "damage";
const PUNCH_SOUND_DURATION = 0.15;
const PUNCH_DAMAGE = 1;

function punchSound() {
    playSound(PUNCH_SOUND_NAME,PUNCH_SOUND_DURATION);
}
function FistsWeapon(rendererState) {
    const battle = rendererState;
    let lastPunch = "right";
    let leftPunchStart = null;
    let rightPunchStart = null;
    let lastPunchEnd = 0;
    const isAttacking = () => {
        const movementTimedOut = performance.now() - lastPunchEnd < MOVEMENT_TIMEOUT;
        return leftPunchStart !== null || rightPunchStart !== null || movementTimedOut
    }
    const renderFist = angle => {
        context.translate(FIST_HALF_WIDTH,FIST_HALF_HEIGHT);
        context.rotate(angle);
        context.fillStyle = FIST_COLOR;
        context.fillRect(0,0,FIST_WIDTH,FIST_HEIGHT);
        context.rotate(-angle);
        context.translate(-FIST_HALF_WIDTH,-FIST_HALF_HEIGHT);
    }
    const getPunchOffset = (timestamp,isLeft) => {
        const punchStart = isLeft ? leftPunchStart : rightPunchStart;
        if(punchStart !== null) {
            let punchNormal = (timestamp - punchStart) / PUNCH_DURATION;
            if(punchNormal > 1) {
                punchNormal = 1;
                if(isLeft) {
                    leftPunchStart = null;
                } else {
                    rightPunchStart = null;
                }
                lastPunchEnd = timestamp;
            }
            if(punchNormal > 0.5) {
                punchNormal = 1 - punchNormal / 2;
            }
            if(punchNormal < 0) {
                punchNormal = 0;
            }
            const yDistanceBase = isLeft ? PUNCH_Y_DISTANCE : PUNCH_Y_DISTANCE + ALT_FIST_EXTRA_Y_OFFSET;
            return {
                x: PUNCH_X_DISTANCE * punchNormal * 2,
                y: yDistanceBase * punchNormal * 2
            }
        } else {
            return {x:0,y:0};
        }
    }
    const punch = (attacked,didNotAttack) => {
        if(lastPunch === "right") {
            if(leftPunchStart === null) {
                leftPunchStart = performance.now();
                lastPunch = "left";
                if(attacked) {
                    attacked();
                }
            } else if(didNotAttack) {
                didNotAttack();
            }
        } else {
            if(rightPunchStart === null) {
                rightPunchStart = performance.now();
                lastPunch = "right";
                if(attacked) {
                    attacked();
                }
            } else if(didNotAttack) {
                didNotAttack();
            }
        }
    }
    const getAttackCallbackResult = (wasMessage=false) => {
        return {
            poppedMessage: wasMessage
        }
    }
    const getNoAttackCallbackResult = () => {
        return {}
    };
    const attack = (attacked,didNotAttack) => {
        if(isAttacking()) {
            if(didNotAttack) {
                didNotAttack(getNoAttackCallbackResult());
            }
            return;
        }
        if(battle.tryPopVisibleMessage()) {
            punch(()=>{
                punchSound();
                battle.noPunchEffect = true;
                if(attacked) {
                    attacked(getAttackCallbackResult());
                }
            });
            return;
        }
        if(battle.isMovementLocked()) {
            if(didNotAttack) {
                didNotAttack(getNoAttackCallbackResult());
            }
            return;
        }
        if(battle.getPlayerOpponentDistance().inRange) {
            punch(()=>{
                battle.foregroundEffects.addLayer(
                    GetPunchImpactEffect.call(battle)
                );
                punchSound();
                battle.damageOpponent(PUNCH_DAMAGE);
                battle.noPunchEffect = false;
                if(attacked) {
                    attacked(getAttackCallbackResult());
                }
            },didNotAttack);
        } else {
            punch(()=>{
                battle.noPunchEffect = true;
                if(attacked) {
                    attacked(getAttackCallbackResult());
                }
            });
        }
    }
    const render = timestamp => {
        let translationX = halfWidth - FIST_CENTER_OFFSET - FIST_WIDTH;
        let translationY = FIST_Y_OFFSET;

        const leftPunchOffset = getPunchOffset(timestamp,true);
        const rightPunchOffset = getPunchOffset(timestamp,false);

        translationX += leftPunchOffset.x;
        translationY -= leftPunchOffset.y;

        context.translate(translationX,translationY);
        renderFist(IDLE_FIST_ANGLE);
        context.translate(-translationX,-translationY);

        translationX = halfWidth + FIST_CENTER_OFFSET + FIST_WIDTH;
        translationY = FIST_Y_OFFSET + ALT_FIST_EXTRA_Y_OFFSET;

        translationX -= rightPunchOffset.x;
        translationY -= rightPunchOffset.y;

        context.translate(translationX,translationY);
        context.scale(-1,1);
        renderFist(IDLE_FIST_ANGLE);
        context.scale(1,1);
        context.translate(-translationX,-translationY);
    }
    WeaponBase.call(this,{
        isAttacking: isAttacking,
        attack: attack,
        render: render,
        playerInput: key => console.log(`Key: ${key}`)
    });
}
export default FistsWeapon;
