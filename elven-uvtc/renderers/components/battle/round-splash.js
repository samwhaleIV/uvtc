const TEXTURE_NAME = "battle/round-splash";

const FREEZE_DURATION = 2500;
const TRANSITION_DURATION = 300;
const FIGHT_TEXTURE_POINT = 0.7;

const TOTAL_DURATION = FREEZE_DURATION + TRANSITION_DURATION + TRANSITION_DURATION;
const TRANSITION_PERIOD = TRANSITION_DURATION / TOTAL_DURATION;
const INVERSE_TRANSITION_PERIOD = 1 - TRANSITION_PERIOD;

const BANNER_TEXTURE_HEIGHT = 13;
const BANNER_TEXTURE_WIDTH = 21;

const TEXTURE_SCALE = 10;

const INNER_HEIGHT = BANNER_TEXTURE_HEIGHT * TEXTURE_SCALE;
const INNER_WIDTH = BANNER_TEXTURE_WIDTH * TEXTURE_SCALE;

const HALF_INNER_WIDTH = INNER_WIDTH / 2;
const BANNER_PADDING = TEXTURE_SCALE;

const BANNER_HEIGHT = INNER_HEIGHT + BANNER_PADDING + BANNER_PADDING;
const BANNER_HALF_HEIGHT = BANNER_HEIGHT / 2;

const FIGHT_TEXTURE_Y = 6 * BANNER_TEXTURE_HEIGHT;

function RoundSplashEffect(roundNumber,callback) {

    const textureY = (roundNumber - 1) * BANNER_TEXTURE_HEIGHT;
    const texture = imageDictionary[TEXTURE_NAME];

    const startTime = performance.now();
    this.render = timestamp => {
        const timeDifference = timestamp - startTime;

        let globalDelta = timeDifference / TOTAL_DURATION;
        if(globalDelta > 1) {
            globalDelta = 1;
            if(callback) {
                callback.call(null);
            }
            return;
        }

        const centerY = halfHeight - BANNER_HALF_HEIGHT;
        let yOffset = 0;
        let adjustedTextureY = textureY;

        const splashCenterX = halfWidth - HALF_INNER_WIDTH

        if(globalDelta < TRANSITION_PERIOD) {
            yOffset = (1 - globalDelta * 1 / TRANSITION_PERIOD) * -(halfHeight + BANNER_HALF_HEIGHT);
        } else if (globalDelta > INVERSE_TRANSITION_PERIOD) {
            yOffset = (1 - (1-globalDelta) * 1 / TRANSITION_PERIOD) * (halfHeight + BANNER_HALF_HEIGHT);
        }

        if(globalDelta > FIGHT_TEXTURE_POINT) {
            adjustedTextureY = FIGHT_TEXTURE_Y;
        }

        context.fillStyle = "black";
        context.fillRect(0,centerY+yOffset,fullWidth,BANNER_HEIGHT);

        context.drawImage(
            texture,
            0,adjustedTextureY,
            BANNER_TEXTURE_WIDTH,BANNER_TEXTURE_HEIGHT,
            splashCenterX,
            BANNER_PADDING + centerY + yOffset,
            INNER_WIDTH,INNER_HEIGHT
        );
    }
}
export default RoundSplashEffect;
