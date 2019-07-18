function FadeToBlack(duration,start) {
    let fadeStart = start ? start : null;
    this.render = timestamp => {
        if(!fadeStart) {
            fadeStart = timestamp;
        }
        let progress = (timestamp - fadeStart) / duration;
        if(progress > 1) {
            progress = 1;
        }
        context.fillStyle = `rgba(0,0,0,${progress})`;
        context.fillRect(0,0,fullWidth,fullHeight);
    }
}
export default FadeToBlack;
