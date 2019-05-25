const ELF_COUNT = 6;
const ELF_WIDTH = 9;
const ELF_HEIGHT = 20;

const ELF_HALF_HEIGHT = ELF_WIDTH / 2;
const HEIGHT_WIDTH_RATIO = ELF_HEIGHT / ELF_WIDTH;
const WIDTH_TO_WORLD_SCALE = ELF_WIDTH / WorldTextureSize;

function ElfSpriteRenderer(elfID) {

    if(elfID >= ELF_COUNT) {
        throw new Error(`Elf ID out of range (max ID: ${ELF_COUNT-1})`);
    }

    const spriteSheet = imageDictionary["sprites/elves"];

    const textureX = ELF_WIDTH * elfID;

    this.render = function(_,x,y,width,height) {
        const renderWidth = width * WIDTH_TO_WORLD_SCALE;
        const renderHeight = HEIGHT_WIDTH_RATIO * renderWidth;
        const renderX = x + width / 4;
        const renderY = y + height - renderHeight;
        context.drawImage(
            spriteSheet,textureX,0,ELF_WIDTH,ELF_HEIGHT,
            renderX,renderY,
            Math.round(renderWidth),
            Math.round(renderHeight)
        );
    }
}
export default ElfSpriteRenderer;