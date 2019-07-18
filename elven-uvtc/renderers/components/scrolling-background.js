function ScrollingBackground(backgroundName,padding=0) {
    const doublePadding = padding + padding;
    const image = imageDictionary[`backgrounds/${backgroundName}`];
    const imageWidth = image.width;
    const imageHeight = image.height;
    this.cycleTime = 30000;
    this.render = function(timestamp) {
        context.fillStyle = "white";
        context.fillRect(0,0,fullWidth,fullHeight);

        context.save();
        context.globalCompositeOperation = "destination-out";

        context.fillRect(padding,padding,fullWidth-doublePadding,fullHeight-doublePadding);
        context.globalCompositeOperation = "destination-over";


        const normal = 1 - (timestamp % this.cycleTime / this.cycleTime);

        
        context.drawImage(
            image,0,0,imageWidth,imageHeight,
            Math.floor(fullWidth * normal),0,fullWidth,fullHeight
        );
        
        context.drawImage(
            image,0,0,imageWidth,imageHeight,
            -Math.floor(fullWidth - fullWidth * normal),0,fullWidth,fullHeight
        );


        context.restore();
    }
}
export default ScrollingBackground;

