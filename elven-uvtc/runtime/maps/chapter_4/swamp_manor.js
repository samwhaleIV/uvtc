addMap({
    WorldState: function(world) {
        this.load = () => {
            world.addPlayer(9,25,"up");
            world.playerObject.xOffset = 0.5;
            world.disableCameraXFollow();
            world.camera.x = 9;
            world.camera.xOffset = 0.5;
        }
        this.triggerImpulse = ID => {
            return TRIGGER_ACTIVATED;
        }
    },
    renderScale: 0.85,
    useCameraPadding: true,
    name: "swamp_manor"
});
