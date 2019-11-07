import CompositeProcessor from "../../../../../elven-engine/renderers/components/composite-processor.js";

const DEFAULT_WATER_COLOR = "#0E110E";
const DEFAULT_REFLECTION_ALPHA = 0.15;

function GetBaseSwampReflector(waterColor,reflectionAlpha,tileOffsetDistance,composite) {
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
    compositor.waterColor = waterColor;
    compositor.tileOffsetDistance = tileOffsetDistance;
    compositor.reflectionAlpha = reflectionAlpha;

    if(typeof composite === "function") {
        compositor.composite = composite.bind(compositor)
    }
    return compositor;
}
function GetStaticSwampReflector(world,waterColor,reflectionAlpha,tileOffsetDistance) {
    return GetBaseSwampReflector(waterColor,reflectionAlpha,tileOffsetDistance,function(buffer,xOffset,yOffset) {
        context.fillStyle = this.waterColor;
        context.fillRect(0,0,fullWidth,fullHeight);
        context.save();
        context.globalAlpha = this.reflectionAlpha;
        context.scale(1,-1);
        const reflectionDistance = world.getTileSize() * this.tileOffsetDistance;
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
    });
}
function GetScrollableSwampReflector(world,waterColor,reflectionAlpha,tileOffsetDistance) {
    return GetBaseSwampReflector(waterColor,reflectionAlpha,tileOffsetDistance,function(buffer,xOffset,yOffset) {
        context.fillStyle = this.waterColor;
        context.fillRect(0,0,fullWidth,fullHeight);
        context.save();
        context.globalAlpha = this.reflectionAlpha;
        const tileSize = world.getTileSize();
        const reflectionDistance = tileSize * this.tileOffsetDistance;
        context.drawImage(
            buffer,0,0,fullWidth,fullHeight,
            xOffset+reflectionDistance,yOffset+reflectionDistance,
            fullWidth,fullHeight
        );
        context.restore();
        context.drawImage(
            buffer,0,0,fullWidth,fullHeight,
            xOffset,yOffset,fullWidth,fullHeight
        );
    });
}
function SwampBackgroundFX() {
    this.render = () => {
        context.clearRect(0,0,fullWidth,fullHeight);
    }
}
export default GetScrollableSwampReflector;
export { GetScrollableSwampReflector, GetStaticSwampReflector, SwampBackgroundFX }
