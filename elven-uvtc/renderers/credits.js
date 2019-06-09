import CreditsData from "../runtime/credits-data.js";
import MainMenuRenderer from "./main-menu.js";
import ElvesFillIn from "./components/world/elves-fill-in.js";

function CreditsRenderer() {
    const pixelsPerSecond = 60;
    const lineHeight = 80;
    const doubleLineHeight = lineHeight + lineHeight;
    const dataRowCount = CreditsData.length;

    let lastFrame = performance.now();
    this.start = timestamp => {
        lastFrame = timestamp;
    }
    let yPosition = -(fullHeight+pixelsPerSecond);
    const yEnd = dataRowCount * lineHeight;

    this.song = "pos_loop";
    this.noPixelScale = true;

    let reachedEnd = false;

    this.processKey = () => {};
    this.processKeyUp = key => {
        if(key === kc.cancel) {
            faderEffectsRenderer.fillInLayer = new ElvesFillIn();
            this.fader.fadeOut(MainMenuRenderer);
        }
    }
    this.render = timestamp => {
        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);

        const delta = timestamp - lastFrame;
        const yDifference = delta / 1000 * pixelsPerSecond;
        lastFrame = timestamp;
        if(reachedEnd) {
            yPosition = yEnd - halfHeight - doubleLineHeight;
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
            const heightDifference = CreditsData[y](Math.floor(yOffset),lineHeight);
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
