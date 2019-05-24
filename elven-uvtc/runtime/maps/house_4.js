addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(4,3,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.otherClicked = type => {
            switch(type) {
                case 8:
                    break;
                case 9:
                    break;
            }
        }
    },
    name: "house_4",
    doors: [
        "to_tumble_woods"
    ],
});
