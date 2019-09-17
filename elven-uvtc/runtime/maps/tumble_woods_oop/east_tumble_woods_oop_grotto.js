addMap({
    WorldState: function(world,data) {

        console.log(world.renderMap);
        this.load = world => {
            world.addPlayer(0,10,"right");
            world.playerObject.yOffset = 0.5;
        }

        this.triggerActivated = (ID,direction) => {
            if(direction === "right") {
                world.updateMap("east_tumble_woods_oop");
            } else {
                return PENDING_CODE;
            }
        }
    },
    useCameraPadding: true,
    name: "east_tumble_woods_oop_grotto"
});
