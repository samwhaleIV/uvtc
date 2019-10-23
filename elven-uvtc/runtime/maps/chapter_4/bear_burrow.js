import CompositeProcessor from "../../../../../elven-engine/renderers/components/composite-processor.js";

const WATER_COLOR = "#0E110E";
const REFLECTION_ALPHA = 0.15;

addMap({
    WorldState: function(world) {
        this.load = () => {
            world.addPlayer(24,11,"up");
            world.disableCameraYFollow();
            world.camera.y = 8;
            world.playerObject.xOffset = true;
            world.playerObject.forcedStartPosition = true;
            world.playerObject.offscreenRendering = true;

            const compositeProcessor = new CompositeProcessor(true);
            compositeProcessor.composite = (buffer,xOffset,yOffset) => {
                context.fillStyle = WATER_COLOR;
                context.fillRect(0,0,fullWidth,fullHeight);
                context.save();
                context.globalAlpha = REFLECTION_ALPHA;
                context.scale(1,-1);
                const reflectionDistance = world.getTileSize() * 3;
                context.drawImage(
                    buffer,0,0,fullWidth,fullHeight,
                    xOffset,yOffset+reflectionDistance,fullWidth,-fullHeight
                );
                context.restore();
                context.drawImage(
                    buffer,0,0,fullWidth,fullHeight,
                    xOffset,yOffset,fullWidth,fullHeight
                );
            }
            compositeProcessor.enable();
            world.compositeProcessor = compositeProcessor;
        }
    },
    useCameraPadding: true,
    renderScale: 0.75,
    fxBackground: function() {
        this.render = () => {
            context.clearRect(0,0,fullWidth,fullHeight);
        }
    },
    name: "bear_burrow"
});
