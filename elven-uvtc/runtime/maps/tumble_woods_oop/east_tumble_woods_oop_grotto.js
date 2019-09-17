addMap({
    WorldState: function(world,data) {

        console.log(world.renderMap);
        this.load = world => {
            world.addPlayer(0,10,"right");
            world.playerObject.yOffset = 0.5;
        }

        this.triggerImpulse = (ID,direction) => {
            if(direction === "left") {
                world.updateMap("east_tumble_woods_oop");
                return TRIGGER_ACTIVATED;
            }
        }
    },
    useCameraPadding: true,
    name: "east_tumble_woods_oop_grotto"
});
