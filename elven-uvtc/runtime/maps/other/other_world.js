import RotatingBackground from "../../../renderers/components/rotating-background.js";

addMap({
    WorldState: function(world) {
        this.load = () => {
            world.addPlayer(14,14,"up");
        }
    },
    useCameraPadding: true,
    renderScale: 0.9,
    fxBackground: function(world) {
        const image = imageDictionary["backgrounds/other-world"];
        this.render = () => context.drawImage(image,0,0,image.width,image.height,0,0,fullWidth,fullHeight);
    },
    name: "other_world"
});
