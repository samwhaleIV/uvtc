function CardBookRenderer() {


    this.render = timestamp => {
        context.fillStyle = "white";
        context.fillRect(0,0,fullWidth,fullHeight);
        drawTextStencil("black","test",50,50,3,20);
    }
}