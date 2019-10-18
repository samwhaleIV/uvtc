import { SpriteRenderer, ElfRenderer } from "../world/sprite.js";

const ELVES_ARE_NOT_FAT = "Cannot create an elf sprite with custom width or height dimensions";

function SpriteForeground(whomstve,isElf,customWidth,customHeight,yOffset,renderScale) {
    if(isElf) {
        if(isElf && (customWidth || customHeight)) {
            throw Error(ELVES_ARE_NOT_FAT);
        }
        ElfRenderer.call(this,"down",whomstve);
    } else {
        SpriteRenderer.call(this,"down",whomstve,customWidth,customHeight);
    }

    this.x = 0;
    this.y = 0;
    this.animationFrameTime = 200;

    this.renderToForeground = (timestamp,extraScale=0) => {
        const size = Math.ceil(renderScale * 2 / 16) * 16 + (extraScale * (renderScale/120));
        const halfSize = size / 2;
        this.render(
            timestamp,halfWidth-halfSize,halfHeight-halfSize+yOffset*size,size,size
        );
    }
}
export default SpriteForeground;