addMap({
    WorldState: function(world,data) {

        const rockTiles = [
            1940,1941,2005
        ];

        const elfRockTile = 1942;

        const rockLocations = [
            [7,21],[8,20],[7,23],[9,22],[11,21],
            [11,23],[13,22],

            [4,61],[2,63],[5,64],[7,62],[10,64],
            [12,63],[15,64]
        ];

        const iceHoleLocations = [
            [15,22],[18,11],[18,13],
            [23,15],[26,13],[26,16],
            [31,11],[31,14],[34,12]
        ];

        const brokenIceTile = 2002;
        const noodleIceTile = 2003;
        const noodleIceTileAbove = 1939;

        const iceHoleTile = 1938;

        this.load = world => {
            switch(data.sourceRoom) {
                default:
                case "tumble_woods_oop":
                    world.addPlayer(0,43,"right");
                    break;
                case "east_tumble_woods_oop_grotto":
                    world.addPlayer(41,61,"left");
                    world.playerObject.yOffset = 0.5;
                    break;
            }
        }

        this.triggerImpulse = (ID,direction) => {
            switch(ID) {
                case 1:
                    if(direction === "left") {
                        world.updateMap("tumble_woods_oop");
                        return TRIGGER_ACTIVATED;
                    }
                    break;
                case 2:
                    if(direction === "right") {
                        world.updateMap("east_tumble_woods_oop_grotto");
                        return TRIGGER_ACTIVATED;
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
