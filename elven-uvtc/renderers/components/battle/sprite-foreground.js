import { SpriteRenderer, ElfRenderer } from "../world/sprite.js";

const ELVES_ARE_NOT_FAT = "Cannot create an elf sprite with custom width or height dimensions";

function SpriteForeground(whomstve,isElf,customWidth,customHeight,yOffset) {
    if(isElf) {
        if(isElf && (customWidth || customHeight)) {
            throw Error(ELVES_ARE_NOT_FAT);
        }
        this.sprite = new ElfRenderer("down",whomstve);
    } else {
        this.sprite = new SpriteRenderer("down",whomstve,customWidth,customHeight);
    }

    this.sprite.x = 0;
    this.sprite.y = 0;
    this.sprite.animationFrameTime = 200;

    this.render = (timestamp,size,extraScale=0) => {
        size = Math.ceil(size * 2 / 16) * 16;
        size += extraScale;
        const halfSize = size/2;
        this.sprite.render(timestamp,halfWidth-halfSize,halfHeight-halfSize+yOffset*size,size,size);
    }
}
export default SpriteForeground;