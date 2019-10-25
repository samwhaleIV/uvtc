import {GetStaticSwampReflector, SwampBackgroundFX } from "../../../renderers/components/world/swamp-reflection.js";

addMap({
    WorldState: function(world) {
        this.load = () => {
            world.addPlayer(24,11,"up");
            world.disableCameraYFollow();
            world.camera.y = 8;
            world.playerObject.forcedStartPosition = true;
            world.playerObject.offscreenRendering = true;
            world.compositeProcessor = GetStaticSwampReflector(
                world,null,null,3
            );
            world.compositeProcessor.enable();
        }
    },
    fxBackground: SwampBackgroundFX,
    useCameraPadding: true,
    renderScale: 0.75,
    name: "bear_burrow"
});
