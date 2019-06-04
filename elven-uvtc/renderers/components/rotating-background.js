function RotatingBackground(imageName,yOffset=0) {
    this.startHeight = fullHeight ? fullHeight : window.innerHeight;
    this.centerYOffset = yOffset;
    const image = imageDictionary[`backgrounds/${imageName}`];
    const imageWidth = image.width;
    const imageHeight = image.height;
    this.rotationTime = 400000;
    this.clockwise = false;
    this.timeOffset = 0;
    this.render = timestamp => {
        const centerY = halfHeight + (this.centerYOffset*(fullHeight/this.startHeight));
        timestamp = timestamp - this.timeOffset;
        context.save();
        context.translate(halfWidth,centerY);
        if(this.clockwise) {
            context.rotate((timestamp / this.rotationTime) % 1 * PI2);
        } else {
            context.rotate((this.rotationTime-timestamp / this.rotationTime) % 1 * PI2);
        }
        context.translate(-halfWidth,-centerY);
        const diameter = Math.round(largestDimension * 1.5);
        const radius = Math.round(diameter / 2);
        context.drawImage(
            image,0,0,imageWidth,imageHeight,
            halfWidth-radius,
            centerY-radius,
            diameter,diameter
        );
        context.restore();
    }
}
export default RotatingBackground;
