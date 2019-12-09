function ElvesFillIn() {
    const image = imageDictionary["backgrounds/corrupt"]
    const offscreenCanvas = new OffscreenCanvas(image.width,image.height);
    offscreenCanvas.getContext("2d").drawImage(
        image,0,0,image.width,image.height
    );
    const pattern = context.createPattern(offscreenCanvas,"repeat");
    this.render = () => {
        context.rect(0,0,fullWidth,fullHeight);
        context.fillStyle = pattern;
        context.fill();
    }
}
export default ElvesFillIn;
