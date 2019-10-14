function Gradient(stops,size) {
    const halfSize = size / 2;
    const quarterSize = halfSize / 2;
    const offscreenCanvas = new OffscreenCanvas(size,size);
    const offscreenContext = offscreenCanvas.getContext("2d");

    const gradient = offscreenContext.createRadialGradient(
        halfSize,halfSize,0,halfSize,halfSize,halfSize
    );

    stops.forEach(stop=>{
        gradient.addColorStop(stop[1],stop[0]);
    });

    offscreenContext.fillStyle = gradient;
    offscreenContext.fillRect(0,0,size,size);

    this.render = (x,y) => {
        context.drawImage(offscreenCanvas,0,0,size,size,x-quarterSize,y-quarterSize,size,size);
    }
}
export default Gradient;
