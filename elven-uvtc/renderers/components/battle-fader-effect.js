const BASE_GRAIN_SIZE = 20;
const MAX_GRAIN_DIFFERENCE = 20;
const GRAIN_RENDER_THRESHOLD = 10;


const TRACE_BLOCK_SIZE = 50;



function BattleFaderEffect() {

    const maximumGrainShade = 255 - GRAIN_RENDER_THRESHOLD;

    const whiteNoise = function(grainSize) {

        let horizontalGrain = Math.ceil(fullWidth / grainSize);
        let verticalGrain = Math.ceil(fullHeight / grainSize);
    
        const xOffset = Math.floor((horizontalGrain * grainSize - fullWidth) / 2);
        const yOffset = Math.floor((verticalGrain * grainSize - fullHeight) / 2);
    
        grainSize = Math.ceil(grainSize);

        let x = 0, y;
        while(x < horizontalGrain) {
            y = 0;
            while(y < verticalGrain) {
                const grainShade = 255 - Math.ceil(Math.random() * MAX_GRAIN_DIFFERENCE);
                if(grainShade < maximumGrainShade) {
                    context.fillStyle = `rgb(${grainShade},${grainShade},${grainShade})`;
                    context.fillRect(
                        (x*grainSize)-xOffset,
                        (y*grainSize)-yOffset,
                        grainSize,
                        grainSize
                    );
                }
                y++;
            }
            x++;
        }
    }

    const renderBlock = (x,y,verticalOffset,horizontalOffset) => {
        context.rect(x*TRACE_BLOCK_SIZE+horizontalOffset,y*TRACE_BLOCK_SIZE+verticalOffset,TRACE_BLOCK_SIZE,TRACE_BLOCK_SIZE);
    }

    const startBlockAreaRender = () => {
        context.beginPath();
    }

    const endBlockAreaRender = intensity => {
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "white";
        context.fill();
        context.globalCompositeOperation = "destination-over";
        whiteNoise(BASE_GRAIN_SIZE + BASE_GRAIN_SIZE * intensity);
        context.fillStyle = "white";
        context.fillRect(0,0,fullWidth,fullHeight);
        context.restore();
    }

    this.render = intensity => {
        
        const horizontalCount = Math.ceil(fullWidth / TRACE_BLOCK_SIZE);
        const verticalCount = Math.ceil(fullHeight / TRACE_BLOCK_SIZE);

        const extraAmount = Math.floor(fullHeight / TRACE_BLOCK_SIZE);

        const verticalOffset = (fullHeight - verticalCount * TRACE_BLOCK_SIZE) / 2;
        const horizontalOffset = (fullWidth - horizontalCount * TRACE_BLOCK_SIZE) / 2;

        const maxBoxCount = Math.ceil((verticalCount * horizontalCount + extraAmount) * intensity);

        let x = 0, y = 0, direction = 0, row = 0, render = false, boxCount = 0;
        let fullRotationCount
        startBlockAreaRender();
        renderBlock(x,y,verticalOffset,horizontalOffset);
        do {
            render = false;
            if(direction === 0) {
                x++;
                if(x > horizontalCount-row) {
                    x = horizontalCount-row-1;
                    direction = 1;
                } else {
                    render = true;
                }
            } else if(direction === 1) {
                y++;
                if(y > verticalCount-row) {
                    y = verticalCount-row-1;
                    direction = 2;
                } else {
                    render = true;
                }
            } else if(direction === 2) {
                x--;
                if(x < row) {
                    x = row;
                    direction = 3;
                    row++;
                } else {
                    render = true;
                }
            } else if(direction === 3) {
                y--;
                if(y < row) {
                    y = row;
                    direction = 0;
                } else {
                    render = true;
                }
            }
            if(render) {
                boxCount++;
                renderBlock(x,y,verticalOffset,horizontalOffset);
                render = false;
                fullRotationCount = 0;
            } else {
                fullRotationCount++;
            }
        } while(boxCount < maxBoxCount && fullRotationCount < 4);
        endBlockAreaRender(intensity);
    }
}
export default BattleFaderEffect;
