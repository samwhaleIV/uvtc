function ObjectRenderer() {
    this.render = function(timestamp,x,y,width,height) {
        context.fillStyle = "red";
        context.fillRect(x+5,y+5,width-10,height-10);
    }
}
