function Gradient(stops,size=0) {
    let halfSize = size / 2;
    let quarterSize = size / 4;

    const offscreenCanvas = new OffscreenCanvas(size,size);
    const offscreenContext = offscreenCanvas.getContext("2d",{alpha:true});

    this.cache = () => {
        const gradient = offscreenContext.createRadialGradient(
            halfSize,halfSize,0,halfSize,halfSize,halfSize
        );
        stops.forEach(stop=>{
            gradient.addColorStop(stop[1],stop[0]);
        });
    
        offscreenContext.fillStyle = gradient;
        offscreenContext.fillRect(0,0,size,size);
    }

    this.updateSize = newSize => {
        size = newSize;
        halfSize = size / 2;
        quarterSize = size / 4;
        offscreenCanvas.width = size;
        offscreenCanvas.height = size;
        this.cache();
    }

    if(size) {
        this.cache();
    }

    this.render = (x,y) => {
        context.drawImage(offscreenCanvas,0,0,size,size,x-quarterSize,y-quarterSize,size,size);
    }
}
export default Gradient;
