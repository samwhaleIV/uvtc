function RenderMove(move,x,y,width,height,hover) {
    context.fillStyle = hover ? "blue" : "red";
    context.fillRect(x,y,width,height);
}
export default RenderMove;
