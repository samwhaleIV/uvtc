const TEXTURE_SIZE = 16;
const TEXTURE_NAME = "battle/snowball";
const THROW_TO_IMPACT_DURATION = 200;
const MAX_SCALE = 45;
const SNOWBALL_SPIN_TIME = 2500;
const OFFSET_RANGE = 10;

const IMPACT_DURATION = 100;
const IMPACT_RANGE = 250;
const IMPACT_PARTICLE_SIZE = 20;
const PARTICLE_COUNT = 25;
const PARTICLE_ALPHA_DIVISOR = 5;
const SNOWBALL_COLORS = ["black","#A0B1BC","white"];

const INCOMING_PARTICLE_SIZE = 7;
const INCOMING_PARTICLE_DISTANCE = 100;
const INCOMING_MAX_SCALE = 10;

const GET_TEXTURE_START = () => {
    return Math.round(Math.random()) * TEXTURE_SIZE;
}
const GET_RANDOM_OFFSET = () => {
    return Math.random() * OFFSET_RANGE - OFFSET_RANGE / 2;
}
const GET_SNOWBALL_SUB_PARTICLE_OFFSET_NORMAL = () => {
    return Math.random() * getRandomPolarity() / 1.5;
}
function SnowballSubParticleGroup(color,count) {
    const angles = new Array(count);
    for(let i = 0;i<count;i++) {
        const angle = i / count * PI2;
        angles[i] = {
            x: Math.cos(angle),
            y: Math.sin(angle),
            xOffset: GET_SNOWBALL_SUB_PARTICLE_OFFSET_NORMAL(),
            yOffset: GET_SNOWBALL_SUB_PARTICLE_OFFSET_NORMAL()
        }
    }
    this.render = (x,y,size,distance) => {
        context.beginPath();
        context.fillStyle = color;
        for(let i = 0;i<count;i++) {
            const angle = angles[i];
            context.rect(
                x+angle.x*distance*angle.xOffset,
                y+angle.y*distance*angle.yOffset,
                size,size
            );
        }
        context.fill();
    }
}

function SnowballImpact(start,callback,outgoing) {
    const g1 = new SnowballSubParticleGroup(SNOWBALL_COLORS[0],PARTICLE_COUNT);
    const g2 = new SnowballSubParticleGroup(SNOWBALL_COLORS[1],PARTICLE_COUNT);
    const g3 = new SnowballSubParticleGroup(SNOWBALL_COLORS[2],PARTICLE_COUNT);
    const renderAll = (particleX,particleY,particleSize,distance) => {
        g1.render(particleX,particleY,particleSize,distance);
        g2.render(particleX,particleY,particleSize,distance);
        g3.render(particleX,particleY,particleSize,distance);
    }
    this.render = timestamp => {
        const delta = timestamp - start;
        const normal = delta / IMPACT_DURATION;
        if(normal >= 1) {
            callback();
            return;
        }
        let particleSize, distance;
        if(outgoing) {
            particleSize = IMPACT_PARTICLE_SIZE * widthNormal; 
            distance = IMPACT_RANGE * widthNormal * normal;
        } else {
            particleSize = INCOMING_PARTICLE_SIZE;
            distance = INCOMING_PARTICLE_DISTANCE * normal;
        }
        const halfParticleSize = particleSize / 2;
        const particleX = halfWidth-halfParticleSize
        const particleY = halfHeight-halfParticleSize;
        context.save();
        context.globalAlpha = Math.max(
            1 - normal / PARTICLE_ALPHA_DIVISOR,0.01
        );
        renderAll(particleX,particleY,particleSize,distance);
        context.restore();
    }
}

let lastPolarity = 1;
function Snowball(outgoing,doesImpact,callback,terminationCallback) {
    const texture = imageDictionary[TEXTURE_NAME];
    const sourceX = GET_TEXTURE_START();
    const sourceY = GET_TEXTURE_START();
    const rotationPolarity = -lastPolarity;
    lastPolarity = rotationPolarity;
    const start = performance.now();
    const xOffset = GET_RANDOM_OFFSET();
    const yOffset = GET_RANDOM_OFFSET();
    let snowballImpact = null;
    let terminated = false;
    this.render = timestamp => {
        if(terminated) {
            return;
        }
        if(snowballImpact !== null) {
            context.save();
            if(outgoing) {
                context.resetTransform();
            }
            snowballImpact.render(timestamp);
            context.restore();
            return;
        }
        const thrownDelta = (timestamp - start) / THROW_TO_IMPACT_DURATION;

        let snowballSize;
        if(outgoing) {
            const sizeNormal = 1 - thrownDelta;
            const scale = sizeNormal * MAX_SCALE;
            snowballSize = scale * TEXTURE_SIZE * widthNormal;
        } else {
            snowballSize = thrownDelta * INCOMING_MAX_SCALE * TEXTURE_SIZE;
        }
        const halfSnowballSize = snowballSize / 2;
        if(thrownDelta >= 1) {
            let shouldImpact;
            if(typeof doesImpact === "function") {
                shouldImpact = doesImpact();
            } else {
                shouldImpact = doesImpact;
            }
            if(shouldImpact) {
                if(callback) {
                    callback();
                }
                snowballImpact = new SnowballImpact(timestamp,()=>{
                    if(terminationCallback) {
                        terminationCallback();
                    }
                    terminated = true;
                },outgoing);
                return;
            }
            if(terminationCallback) {
                terminationCallback();
            }
            terminated = true;
            return;
        }
        context.save();
        if(outgoing) {
            context.resetTransform();
        }
        context.translate(halfWidth+xOffset,halfHeight+yOffset);
        context.rotate(
            timestamp % SNOWBALL_SPIN_TIME / SNOWBALL_SPIN_TIME * PI2 * rotationPolarity
        );
        context.drawImage(
            texture,sourceX,sourceY,
            TEXTURE_SIZE,TEXTURE_SIZE,
            -halfSnowballSize,
            -halfSnowballSize,
            snowballSize,snowballSize
        );
        context.restore();
    }
}
function OutgoingSnowball(
    doesImpact,callback,terminationCallback
) {
    Snowball.call(
        this,true,doesImpact,callback,terminationCallback
    );
}
function IncomingSnowball(
    doesImpact,callback,terminationCallback
) {
    Snowball.call(
        this,false,doesImpact,callback,terminationCallback
    );
}
export default Snowball;
export { OutgoingSnowball, IncomingSnowball, Snowball };
