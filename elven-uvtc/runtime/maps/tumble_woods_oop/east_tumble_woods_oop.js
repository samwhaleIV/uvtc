addMap({
    WorldState: function(world,data) {

        console.log(world.renderMap);
        this.load = world => {
            switch(data.sourceRoom) {
                default:
                case "tumble_woods_oop":
                    world.addPlayer(0,43,"right");
                    break;
                case "east_tumble_woods_oop_grotto":
                    world.addPlayer(41,61);
                    world.playerObject.yOffset = 0.5;
                    break;
            }
        }

        this.triggerActivated = (ID,direction) => {
            switch(ID) {
                case 1:
                    if(direction === "right") {
                        world.updateMap("tumble_woods_oop");
                    } else {
                        return PENDING_CODE;
                    }
                    break;
                case 2:
                    if(direction === "left") {
                        world.updateMap("east_tumble_woods_oop_grotto");
                    } else {
                        return PENDING_CODE;
                    }
                    break;
                case 3:
                    break;

            }
        }
    },
    useCameraPadding: true,
    name: "east_tumble_woods_oop"
});
