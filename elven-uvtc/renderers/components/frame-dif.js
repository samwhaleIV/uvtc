const BUFFER_SIZE = 100;
const STROKE_COLOR = "cyan";

function FrameDifRenderer() {

    const buffer = new Array(BUFFER_SIZE).fill(0);

    let lastFrame = null;
    let deltaAverage = 1;

    const frameTime = 1000 / 60;

    this.render = timestamp => {
        if(lastFrame === null) {
            lastFrame = timestamp;
        }
        const delta = timestamp - lastFrame;
        lastFrame = timestamp;

        deltaAverage = (deltaAverage + delta) / 2;

        buffer.shift();
        buffer.push(delta);

        const horizontalSpace = fullWidth / (BUFFER_SIZE-1);
        let i = 0;
        context.strokeStyle = STROKE_COLOR;
        context.beginPath();
        context.moveTo(0,halfHeight);
        horizontalSpace;
        while(i<BUFFER_SIZE) {
            let drawValue = (buffer[i] - frameTime) * 200;
            if(drawValue > 200) {
                drawValue = 200;
            } else if(drawValue < -200) {
                drawValue = -200;
            }
            context.lineTo(i * horizontalSpace,halfHeight+drawValue);
            i++;
        }
        context.stroke();

    }
}
export default FrameDifRenderer;