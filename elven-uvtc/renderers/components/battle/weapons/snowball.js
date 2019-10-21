import WeaponBase from "../weapon-base.js";
import { OutgoingSnowball } from "../snowball.js";
import MultiLayer from "../../multi-layer.js";

const SOUND_NAME = "snow";
const SNOWBALL_DAMAGE = 1;

function snowballSound() {
    playSound(SOUND_NAME);
}
function SnowballWeapon(rendererState) {
    const battle = rendererState;
    let snowball = null;
    const snowballRenderLayer = new MultiLayer();
    const isAttacking = () => {
        return snowball !== null;
    }
    const throwSnowball = attacked => {
        this.throwingBall = true;
        const inRange = battle.getPlayerOpponentDistance().xInRange;
        let currentSnowball = new OutgoingSnowball(
            inRange,()=>{
                this.throwingBall = false;
                snowball = null;
                if(inRange && attacked) {
                    attacked();
                }
            }
        ,()=>{
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
