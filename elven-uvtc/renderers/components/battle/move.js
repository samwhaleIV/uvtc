const MOVE_SOURCE_WIDTH = 32;
const MOVE_SOURCE_HEIGHT = 32;
const SHADOW_BLUR_AMOUNT = 4;

function drawMoveNameWrapping(move,x,y,size) {
    const fontSize = Math.ceil(size / 6);
    const lineHeight = Math.ceil(fontSize * 1.33 + 8);
    const halfLineHeight = Math.round(lineHeight / 2);
    const lines = move.wrappedName;
    let yOffset = 0;
    const lineCount = lines.length;
    context.font = `${fontSize}px Arial`;
    context.textAlign = "left";
    for(let i = 0;i<lineCount;i++) {
        const lineY = Math.floor(y+yOffset);
        const line = lines[i];
        const lineWidth = Math.floor(context.measureText(line).width);
        context.fillStyle = "white";
        context.fillRect(Math.floor(x),lineY,lineWidth+10,lineHeight+1);
        context.fillStyle = "black";
        context.fillText(lines[i],x+4,lineY+halfLineHeight);
        yOffset += lineHeight;
    }
}

function RenderMove(move,x,y,size,hover,textless) {
    let startBlur = context.shadowBlur;
    context.shadowBlur = 0;
    if(hover) {
        context.fillStyle = typeof hover !== "boolean" ? hover : CONSISTENT_PINK;
        const paddedSize = size + 6;
        context.fillRect(
            x-3,
            y-3,
            paddedSize,
            paddedSize
        );
    } else {
        context.shadowBlur = SHADOW_BLUR_AMOUNT;
    }

    let image = imageDictionary["battle/moves"];
    if(!image || move.sourceX > image.width) {
        image = imageDictionary[ERROR_IMAGE];
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
        context.font = "16px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        let textWidth = context.measureText(move.name).width;
        let paddedTextWidth = textWidth + 22;
        if(paddedTextWidth > size-10) {
            context.shadowBlur = 0;
            drawMoveNameWrapping(move,x,y,size);
        } else {
            const paddedTextHeight = 38;
            if(!move.noTextBlur) {
                context.shadowBlur = SHADOW_BLUR_AMOUNT;
            } else {
                context.shadowBlur = 0;
            }
            context.fillStyle = "white";
            context.fillRect(
                Math.round(centerX-paddedTextWidth/2),
                Math.round(centerY-paddedTextHeight/2),
                Math.round(paddedTextWidth),
                Math.round(paddedTextHeight)
            );
            context.shadowBlur = 0;
            context.fillStyle = "black";
            context.fillText(move.name,centerX,centerY);
        }
    }

    context.shadowBlur = startBlur;

}
export default RenderMove;
export { MOVE_SOURCE_WIDTH, RenderMove }
