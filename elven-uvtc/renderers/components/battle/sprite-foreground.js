import { SpriteRenderer, ElfRenderer } from "../world/sprite.js";

const ELVES_ARE_NOT_FAT = "Cannot create an elf sprite with custom width or height dimensions";

function SpriteForeground(whomstve,isElf,customWidth,customHeight,yOffset) {
    let sprite;
    if(isElf) {
        if(isElf && (customWidth || customHeight)) {
            throw Error(ELVES_ARE_NOT_FAT);
        }
        sprite = new ElfRenderer("down",whomstve);
    } else {
        sprite = new SpriteRenderer("down",whomstve,customWidth,customHeight);
    }

    sprite.x = 0;
    sprite.y = 0;

    this.render = (timestamp,size) => {
        size = Math.ceil(size * 2 / 16) * 16;
        const halfSize = size/2;
        sprite.render(timestamp,halfWidth-halfSize,halfHeight-halfSize+yOffset*size,size,size);
    }
}
export default SpriteForeground;