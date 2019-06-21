import SpriteRenderer from "../world/sprite.js";

function SpriteForeground(whomstve,isElf) {

    const sprite = new SpriteRenderer("down",whomstve,isElf);
    sprite.x = 0;
    sprite.y = 0;

    this.render = timestamp => {
        const size = Math.ceil(largestDimension / 5 / 16) * 16;
        const halfSize = size/2;
        sprite.render(timestamp,halfWidth-halfSize,halfHeight-halfSize,size,size);
    }
}
export default SpriteForeground;