import WeaponBase from "../weapon-base.js";
import { OutgoingSnowball } from "../snowball.js";
import MultiLayer from "../../multi-layer.js";

const SOUND_NAME = "damage";
const SOUND_DURATION = 0.15;
const SNOWBALL_DAMAGE = 1;

function snowballSound() {
    playSound(SOUND_NAME,SOUND_DURATION);
}
function SnowballWeapon(rendererState) {
    const battle = rendererState;
    let snowball = null;
    const snowballRenderLayer = new MultiLayer();
    const isAttacking = () => {
        return snowball !== null;
    }
    const rangeCheck = () => {
        return battle.getPlayerOpponentDistance().xInRange;
    }
    const throwSnowball = attacked => {
        let currentSnowball = new OutgoingSnowball(
            rangeCheck,()=>{
                snowball = null;
                if(rangeCheck && attacked) {
                    attacked();
                }
            }
        ,()=>{
            if(currentSnowball === snowball) {
                snowball = null;
            }
            snowballRenderLayer.removeLayer(currentSnowball.renderID);
        });
        snowball = currentSnowball;
        snowball.renderID = snowballRenderLayer.addLayer(snowball);
    }
    const render = timestamp => {
        snowballRenderLayer.render(timestamp);
    }
    const attack = () => {
        if(isAttacking()) {
            return;
        }
        if(battle.tryPopVisibleMessage()) {
            throwSnowball(snowballSound);
            return;
        }
        if(battle.isMovementLocked()) {
            return;
        }
        throwSnowball(()=>{
            snowballSound();
            battle.damageOpponent(SNOWBALL_DAMAGE);
            battle.punchEffect();
        });
    }
    WeaponBase.call(this,{
        isAttacking: isAttacking,
        attack: attack,
        render: render
    });
}
export default SnowballWeapon;
