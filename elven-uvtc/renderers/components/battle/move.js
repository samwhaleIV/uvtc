const MOVE_SOURCE_WIDTH = 32;
const MOVE_SOURCE_HEIGHT = 32;

function RenderMove(move,x,y,size,hover,textless) {
    if(hover) {
        context.fillStyle = typeof hover !== "boolean" ? hover : CONSISTENT_PINK;
        const paddedSize = size + 6;
        context.fillRect(
            x-3,
            y-3,
            paddedSize,
            paddedSize
        );
    }

    let image = imageDictionary["battle/moves"];
    if(!image || move.sourceX > image.width) {
        image = imageDictionary["ui/error"];
        context.drawImage(
            image,0,0,image.width,image.height,
            x,y,size,size
        );
    } else {
        context.drawImage(
            imageDictionary["battle/moves"],
            move.sourceX,0,MOVE_SOURCE_WIDTH,MOVE_SOURCE_HEIGHT,
            x,y,size,size
        );
    }

    if(!textless && move.name) {
        const halfSize = size / 2;
        const centerX = x + halfSize;
        const centerY = y + halfSize;
        context.font = "18px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        const textWidth = context.measureText(move.name).width;
        const paddedTextWidth = textWidth + 22;
        const paddedTextHeight = 38;
        context.fillStyle = "white";
        context.fillRect(
            Math.round(centerX-paddedTextWidth/2),
            Math.round(centerY-paddedTextHeight/2),
            Math.round(paddedTextWidth),
            Math.round(paddedTextHeight)
        );
        context.fillStyle = "black";
        context.fillText(move.name,centerX,centerY);
    }

}
export default RenderMove;
export { MOVE_SOURCE_WIDTH, RenderMove }
