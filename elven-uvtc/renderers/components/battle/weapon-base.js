const SWAY_DECAY = 90;
const SWAY_HEIGHT = 20;
const SWAY_LOOP_TIME = 1000;
const SWAY_INERTIA_ATTACK_RATE = 8;
const SWAY_VELOCITY_TRACKING_MODIFIER = 1 / 4;
const IDLE_SWAY_HEIGHT = 2;
const IDLE_SWAY_LOOP_TIME = 2000;
const ATTACKING_PROPERTY = "attacking";

function WeaponBase(customLayer) {
    if(customLayer) {
        this.customLayer = customLayer;
    } else {
        this.customLayer = {
            isAttacking: () => false,
            attack: () => void 0,
            render: () => void 0,
            playerInput: key => console.log(`Key: ${key}`)
        };
    }
    Object.defineProperty(this,ATTACKING_PROPERTY,{
        get: function() {
            return this.customLayer.isAttacking();
        }
    });
    let sway = 0;
    let swayStart = 0;
    let swayEndStart = 0;
    let swayStopValue = 0;
    let lastMaxVelocity = 0;
    this.setSway = (xVelocityNormal,yVelocityNormal,timestamp) => {
        const swayNormal = Math.max(xVelocityNormal,yVelocityNormal);
        if(!sway) {
            if(!swayEndStart) {
                swayStart = timestamp;
            }
        }
        if(swayNormal / SWAY_INERTIA_ATTACK_RATE > lastMaxVelocity) {
            lastMaxVelocity = swayNormal * SWAY_VELOCITY_TRACKING_MODIFIER
        }
        if(swayNormal && swayEndStart) {
            swayEndStart = 0;
        }
        if(sway && !swayNormal) {
            if(!swayEndStart) {
                swayEndStart = timestamp;
                const angle = (timestamp-swayStart) / SWAY_LOOP_TIME % 1 * PI2;
                const yOffset = SWAY_HEIGHT * Math.sin(angle) * sway;
                swayStopValue = yOffset;
                lastMaxVelocity = 0;
            }
        }
        sway = swayNormal;
    }
    this.attack = () => this.customLayer.attack();
    this.playerInput = key => {
        if(this.customLayer.playerInput) {
            this.customLayer.playerInput(key);
        }
    }
    this.render = timestamp => {
        let yOffset = 0;
        if(swayEndStart !== 0) {
            const timeDifference = timestamp - swayEndStart;
            let decayNormal = timeDifference / SWAY_DECAY;
            if(decayNormal > 1) {
                decayNormal = 1;
                swayEndStart = 0;
            }
            yOffset = swayStopValue - swayStopValue * decayNormal;
        } else {
            const angle = (timestamp-swayStart) / SWAY_LOOP_TIME % 1 * PI2;
            yOffset = SWAY_HEIGHT * Math.sin(angle) * sway;
        }

        if(!this.attacking) {
            yOffset += IDLE_SWAY_HEIGHT * Math.sin(timestamp / IDLE_SWAY_LOOP_TIME % 1 * PI2); 
        }
        context.translate(0,yOffset);
        this.customLayer.render(timestamp);
        context.resetTransform();
    }
}
export default WeaponBase;

