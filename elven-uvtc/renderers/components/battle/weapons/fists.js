import WeaponBase from "../weapon-base.js";
import GetPunchImpactEffect from "../punch-effect.js";

const FIST_CENTER_OFFSET = 75;
const ALT_FIST_EXTRA_Y_OFFSET = 50;
const PUNCH_DURATION = 120;
const PUNCH_X_DISTANCE = 20;
const PUNCH_Y_DISTANCE = 120;
const FIST_WIDTH = 200;
const FIST_HEIGHT = 400;
const FIST_HALF_WIDTH = FIST_WIDTH / 2;
const MOVEMENT_TIMEOUT = 50;
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
        return leftPunchStart !== null || rightPunchStart !== null || movementTimedOut;
    }
    const renderFist = (angle,height) => {
        context.rotate(angle);
        context.rect(
            -FIST_HALF_WIDTH,
            -height,
            FIST_WIDTH,
            height + height
        );
        context.rotate(-angle);
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
    const punch = attacked => {
        if(lastPunch === "right") {
            if(leftPunchStart === null) {
                leftPunchStart = performance.now();
                lastPunch = "left";
                if(attacked) {
                    attacked();
                }
            }
        } else {
            if(rightPunchStart === null) {
                rightPunchStart = performance.now();
                lastPunch = "right";
                if(attacked) {
                    attacked();
                }
            }
        }
    }
    const attack = () => {
        if(isAttacking()) {
            return;
        }
        if(battle.tryPopVisibleMessage()) {
            return;
        }
        if(battle.isMovementLocked()) {
            return;
        }
        if(battle.getPlayerOpponentDistance().inRange) {
            punch(()=>{
                battle.foregroundEffects.addLayer(
                    GetPunchImpactEffect.call(battle)
                );
                punchSound();
                battle.damageOpponent(PUNCH_DAMAGE);
                battle.punchEffect();
            });
        } else {
            punch();
        }
    }
    const render = timestamp => {
        const heightNormal = fullHeight / 1080
        const height = heightNormal * FIST_HEIGHT;

        const centerOffset = FIST_CENTER_OFFSET * heightNormal;

        let translationX = halfWidth - centerOffset - FIST_WIDTH;
        let translationY = fullHeight;

        const leftPunchOffset = getPunchOffset(timestamp,true);
        const rightPunchOffset = getPunchOffset(timestamp,false);

        translationX += leftPunchOffset.x;
        translationY -= leftPunchOffset.y;

        context.beginPath();
        context.fillStyle = FIST_COLOR;
        context.translate(translationX,translationY);
        renderFist(IDLE_FIST_ANGLE,height);
        context.translate(-translationX,-translationY);

        translationX = halfWidth + centerOffset + FIST_WIDTH;
        translationY = fullHeight + ALT_FIST_EXTRA_Y_OFFSET * heightNormal;

        translationX -= rightPunchOffset.x;
        translationY -= rightPunchOffset.y;

        context.translate(translationX,translationY);
        context.scale(-1,1);
        renderFist(IDLE_FIST_ANGLE,height);
        context.scale(1,1);
        context.translate(-translationX,-translationY);
        context.fill();
    }
    WeaponBase.call(this,{
        isAttacking: isAttacking,
        attack: attack,
        render: render
    });
}
export default FistsWeapon;
