import RotatingBackground from "../../../renderers/components/rotating-background.js";

addMap({
    WorldState: function(world) {
        this.load = () => {
            world.addPlayer(20,20,"up");
        }
    },
    useCameraPadding: true,
    renderScale: 0.9,
    background: function() {
        RotatingBackground.call(this,"other-world",0);
        this.clockwise = true;
        this.rotationTime = 500000;
    },
    name: "other_world"
});
