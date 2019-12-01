import WeaponBase from "../weapon-base.js";
import { OutgoingSnowball } from "../snowball.js";
import MultiLayer from "../../../../../../elven-engine/renderers/components/multi-layer.js";

const SNOWBALL_TEXTURE = "battle/snowball";
const SNOWBALL_TEXTURE_SIZE = 16;

const SNOWBALL_TEXTURE_SET = [
    {x:0,y:0},
    {x:SNOWBALL_TEXTURE_SIZE,y:SNOWBALL_TEXTURE_SIZE},
    {x:SNOWBALL_TEXTURE_SIZE,y:0},
    {x:0,y:SNOWBALL_TEXTURE_SIZE},
];

const SOUND_NAME = "damage";
const SOUND_DURATION = 0.15;
const SNOWBALL_DAMAGE = 1;

function snowballSound() {
    playSound(SOUND_NAME,SOUND_DURATION);
}
function SnowballWeapon(rendererState) {
    let textureIndex = 0;
    let snowballTextureX = 0;
    let snowballTextureY = 0;
    const advanceSnowballTexture = () => {
        textureIndex = (textureIndex + 1) % SNOWBALL_TEXTURE_SET.length;
        const newTexturePositions = SNOWBALL_TEXTURE_SET[textureIndex];
        snowballTextureX = newTexturePositions.x;
        snowballTextureY = newTexturePositions.y;
    }
    const snowballTexture = imageDictionary[SNOWBALL_TEXTURE];
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
        advanceSnowballTexture();
    }
    const render = timestamp => {
        if(!isAttacking()) {
            const size = 250 * fullHeight / 1080;
            context.drawImage(
                snowballTexture,
                snowballTextureX,snowballTextureY,
                SNOWBALL_TEXTURE_SIZE,SNOWBALL_TEXTURE_SIZE,
                halfWidth-size/2,fullHeight-size*1.33,size,size
            );
        }
        snowballRenderLayer.render(timestamp);
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
