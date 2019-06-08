import CreditsData from "../runtime/credits-data.js";

function CreditsRenderer() {
    const pixelsPerSecond = 50;
    const lineHeight = 80;
    const doubleLineHeight = lineHeight + lineHeight;
    const dataRowCount = CreditsData.length;

    let lastFrame = null;
    this.start = timestamp => {
        lastFrame = timestamp;
    }
    let yPosition = -(fullHeight+pixelsPerSecond);
    const yEnd = dataRowCount * lineHeight;

    this.song = "pos_loop";

    let reachedEnd = false;
    this.render = timestamp => {
        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);

        const delta = timestamp - lastFrame;
        const yDifference = delta / 1000 * pixelsPerSecond;
        lastFrame = timestamp;
        if(reachedEnd) {
            yPosition = yEnd - halfHeight - doubleLineHeight;
        }
        let width = 500, x;
        if(fullWidth < width) {
            width = fullWidth;
            x = 0;
        } else {
            x = halfWidth - width / 2;
        }

        context.fillStyle = "white";

        let dataRowStart, dataRowEnd, yOffset;

        if(yPosition < 0) {
            const trueRows = (fullHeight + yPosition) / lineHeight
            const rows = Math.ceil(trueRows) + 1;
            dataRowStart = 0;
            dataRowEnd = rows;
            yOffset = fullHeight - trueRows * lineHeight;
        } else {
            const rows = Math.ceil(fullHeight / lineHeight) + 1;
            dataRowStart = Math.floor(yPosition / lineHeight);
            dataRowEnd = dataRowStart+rows;
            yOffset = -(yPosition % lineHeight);
        }

        dataRowEnd = Math.min(dataRowEnd,dataRowCount);

        for(let y = dataRowStart;y<dataRowEnd;y++) {
            const heightDifference = CreditsData[y](x,Math.floor(yOffset),width);
            if(heightDifference) {
                yOffset += heightDifference;
            } else {
                yOffset += lineHeight;
            }
        }

        if(yPosition + halfHeight + lineHeight >= yEnd - lineHeight) {
            reachedEnd = true;
        } else {
            yPosition += yDifference;
        }
    }
}

export default CreditsRenderer;
