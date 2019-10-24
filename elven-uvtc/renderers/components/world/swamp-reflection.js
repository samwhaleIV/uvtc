import CompositeProcessor from "../../../../../elven-engine/renderers/components/composite-processor.js";

const DEFAULT_WATER_COLOR = "#0E110E";
const DEFAULT_REFLECTION_ALPHA = 0.15;

function GetSwampReflector(world,waterColor,reflectionAlpha,tileOffsetDistance) {
    if(!waterColor) {
        waterColor = DEFAULT_WATER_COLOR;
    }
    if(!reflectionAlpha) {
        reflectionAlpha = DEFAULT_REFLECTION_ALPHA;
    }
    if(!tileOffsetDistance) {
        tileOffsetDistance = 0;
    }
    const compositor = new CompositeProcessor(true);
    compositor.composite = (buffer,xOffset,yOffset) => {
        context.fillStyle = waterColor;
        context.fillRect(0,0,fullWidth,fullHeight);
        context.save();
        context.globalAlpha = reflectionAlpha;
        context.scale(1,-1);
        const reflectionDistance = world.getTileSize() * tileOffsetDistance;
        context.drawImage(
            buffer,0,0,fullWidth,fullHeight,
            xOffset,yOffset+reflectionDistance,
            fullWidth,-fullHeight
        );
        context.restore();
        context.drawImage(
            buffer,0,0,fullWidth,fullHeight,
            xOffset,yOffset,fullWidth,fullHeight
        );
    }
    return compositor;
}
function SwampBackgroundFX() {
    this.render = () => {
        context.clearRect(0,0,fullWidth,fullHeight);
    }
}
export default GetSwampReflector;
export { GetSwampReflector, SwampBackgroundFX }
