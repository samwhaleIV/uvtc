import { SpriteRenderer, ElfRenderer } from "../world/sprite.js";

const ELVES_ARE_NOT_FAT = "Cannot create an elf sprite with custom width or height dimensions";

function SpriteForeground(whomstve,isElf,customWidth,customHeight,yOffset) {
    
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

    this.renderToForeground = (timestamp,size,extraScale=0) => {
        size = Math.ceil(size * 2 / 16) * 16;
        size += extraScale;
        const halfSize = size/2;
        this.render(timestamp,halfWidth-halfSize,halfHeight-halfSize+yOffset*size,size,size);
    }
}
export default SpriteForeground;