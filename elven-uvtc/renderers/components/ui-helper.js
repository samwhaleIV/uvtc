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
const MENU_BUTTON_FONT = "21px Roboto";
const UI_ALERT_FONT = "21px Arial";
const CONSISTENT_PINK = "#FF006E";
const renderButtonHover = (x,y,width,height) => {
    context.fillStyle = CONSISTENT_PINK;
    context.fillRect(x-2,y-2,width+4,height+4);
}
const renderExitButton = (x,y,withHover,invert) => {
    x += 5;
    y += 5;
    let width = 230;
    let height = 80;
    if(fullWidth <= internalWidth) {
        width = 100;
        height = 80;
    }
    const backgroundColor = invert ? "white" : "black";
    const foregroundColor = invert ? "black" : "white";
    if(withHover) {
        renderButtonHover(x,y,width,height);
    }
    context.fillStyle = backgroundColor;
    context.fillRect(x,y,width,height);
    context.font = MENU_BUTTON_FONT;
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Exit",x+width/2,y+height/2+2);
    return {
        x: x,
        y: y,
        width: width,
        height: height
    };
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
