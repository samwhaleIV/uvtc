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
