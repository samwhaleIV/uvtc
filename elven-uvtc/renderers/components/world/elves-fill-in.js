function ElvesFillIn() {
    const pattern = context.createPattern(
        imageDictionary["backgrounds/corrupt"],
        "repeat"
    );
    this.render = () => {
        context.fillStyle = pattern;
        context.fillRect(0,0,fullWidth,fullHeight);
    }
}
export default ElvesFillIn;
