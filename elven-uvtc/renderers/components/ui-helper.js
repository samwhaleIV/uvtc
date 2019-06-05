const renderButton = (button,withHover,text,textXOffset,textYOffset,specialEffect) => {
    context.fillStyle = "rgba(255,255,255,0.12)";
    context.fillRect(button.x,button.y,button.width,button.height);
    if(withHover) {
        context.fillStyle = specialEffect ? ADarkerBlueColor : ACoolBlueColor;
        context.fillRect(
            button.x-hoverPadding,
            button.y-hoverPadding,
            button.width+doubleHoverPadding,
            button.height+doubleHoverPadding
        );
    }
    drawTextWhite(
        text,
        Math.round(button.x+(button.width/2)-textXOffset),
        Math.round(button.y+(button.height/2)-textYOffset),
        3
    );
}
const getPlaceholderLocation = () => {
    return {
        x: -1,
        y: -1,
        width: 0,
        height: 0
    }
}
const renderHoverEffect = (x,y,width,height,color="cyan") => {
    const halfRadius = width / 2;
    const gradient = context.createRadialGradient(
        x,y,
        0,
        x,y,
        halfRadius
    );
    gradient.addColorStop(0,color);
    gradient.addColorStop(0.95,"rgba(0,0,0,0.5)");
    gradient.addColorStop(1,"rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(x-halfRadius,y-halfRadius,width,height);
}
