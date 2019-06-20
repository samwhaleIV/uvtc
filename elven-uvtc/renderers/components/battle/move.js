const MOVE_SOURCE_WIDTH = 32;
const MOVE_SOURCE_HEIGHT = 32;

function RenderMove(move,x,y,size,hover) {
    if(hover) {
        context.fillStyle = CONSISTENT_PINK;
        const paddedSize = size + flatDoubleHoverPadding;
        context.fillRect(
            x-flatHoverPadding,
            y-flatHoverPadding,
            paddedSize,
            paddedSize
        );
    }
    context.drawImage(
        imageDictionary["battle/moves"],
        move.sourceX,0,MOVE_SOURCE_WIDTH,MOVE_SOURCE_HEIGHT,
        x,y,size,size
    );
    if(move.name) {
        const halfSize = size / 2;
        const centerX = x + halfSize;
        const centerY = y + halfSize;
        context.font = "18px Arial";
        const textWidth = context.measureText(move.name).width;
        const paddedTextWidth = textWidth + 20;
        const paddedTextHeight = 24;
        context.fillStyle = "white";
        context.fillRect(
            centerX-paddedTextWidth/2,
            centerY-paddedTextHeight/2,
            paddedTextWidth,
            paddedTextHeight
        );
        context.fillStyle = "black";
        context.fillText(move.name,centerX,centerY);
    }

}
export default RenderMove;
export { MOVE_SOURCE_WIDTH, RenderMove }
