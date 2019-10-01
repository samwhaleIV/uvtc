const TEXTURE_SIZE = 34;
const TEXTURE_NAME = "battle/love";
const IMPACT_DURATION = 100;
const MAX_IMPACT_AMOUNT = 4;
const HALF_IMPACT_AMOUNT = MAX_IMPACT_AMOUNT / 2;

const getImpactAmount = () => Math.random() * MAX_IMPACT_AMOUNT - HALF_IMPACT_AMOUNT;

function HeartDisplay(heartID=0) {
    const heartSprites = imageDictionary[TEXTURE_NAME];
    const textureX = heartID * TEXTURE_SIZE;
    let impactStart = null;
    this.impact = () => {
        impactStart = performance.now();
    }
    this.render = (timestamp,x,y,size,normal) => {
        if(normal > 1) {
            normal = 1;
        } else if(normal < 0) {
            normal = 0;
        }
        normal = 1 - normal;
        const halfSize = size / 2;

        let renderX = x - halfSize;
        let renderY = y - halfSize;

        if(impactStart !== null) {
            if(timestamp - impactStart > IMPACT_DURATION) {
                impactStart = null;
            } else {
                renderX += getImpactAmount();
                renderY += getImpactAmount();
            }
        }

        const renderHeight = size * normal;
        const topRenderHeight = size - renderHeight;

        const textureHeight = TEXTURE_SIZE * normal;
        const topTextureHeight = TEXTURE_SIZE - textureHeight;
        
        context.drawImage(
            heartSprites,

            textureX,TEXTURE_SIZE,
            TEXTURE_SIZE,textureHeight,
            
            renderX,renderY,
            size,renderHeight
        );

        
        context.drawImage(
            heartSprites,

            textureX,textureHeight,
            TEXTURE_SIZE,topTextureHeight,

            renderX,renderY+renderHeight,
            size,topRenderHeight
        )
    }
}
export default HeartDisplay;
