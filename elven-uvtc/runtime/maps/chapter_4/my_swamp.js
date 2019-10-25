import {GetScrollableSwampReflector, SwampBackgroundFX } from "../../../renderers/components/world/swamp-reflection.js";

addMap({
    WorldState: function(world) {
        this.load = () => {
            world.addPlayer(72,43,"left");
            world.playerObject.forcedStartPosition = true;
            world.playerObject.offscreenRendering = true;
            world.compositeProcessor = GetScrollableSwampReflector(
                world,null,null,-0.5
            );
            world.compositeProcessor.enable();
        }
    },
    fxBackground: SwampBackgroundFX,
    useCameraPadding: true,
    renderScale: 0.75,
    name: "my_swamp"
});
