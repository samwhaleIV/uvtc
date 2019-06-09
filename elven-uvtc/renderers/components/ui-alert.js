function UIAlert(message,timeout) {
    let done = false;
    playSound("energy");
    let startTime = performance.now();
    this.render = timestamp => {
        if(done) {
            return false;
        }
        if(timestamp - startTime >= timeout) {
            done = true;
            return false;
        }
        drawCornerText(message);
        return true;
    }
}
export default UIAlert;
