function BoxFaderEffect() {
    const columns = 30;
    this.fillInLayer = null;
    this.render = (intensity,fadeOut) => {
        let start, end;


        const boxSize = Math.ceil(fullWidth / columns);
        let rows = Math.floor(fullHeight / boxSize) + 1;

        const boxYOffset = Math.floor((fullHeight - rows * boxSize) / 2);

        const boxCount = rows * columns;

        let boxes = Math.ceil(intensity * boxCount);


        if(fadeOut) {
            start = 0;
            end = boxes;
        } else {
            boxes = boxCount - boxes;
            end = boxCount;
            start = boxes;
        }

        context.beginPath();

        for(let i = start;i<end;i++) {

            let y = Math.floor(i / columns);
            let x = i % columns;

            if(y % 2 === 0) {
                x = columns-1-x;
            }
            context.rect(x*boxSize,(y*boxSize)+boxYOffset,boxSize,boxSize);
        }



        if(this.fillInLayer) {
            context.save();
            context.globalCompositeOperation = "destination-out";
            context.fillStyle = "white";
            context.fill();
            context.globalCompositeOperation = "destination-over";
            this.fillInLayer.render(performance.now());
            context.restore();
        } else {
            context.fillStyle = "black";
            context.fill();
        }
    }
}
export default BoxFaderEffect;
