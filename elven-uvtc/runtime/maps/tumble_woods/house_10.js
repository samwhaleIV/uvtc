addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(5,2,"down");
        }
        this.doorClicked = doorID => {
            if(doorID === "to_tumble_woods") {
                const newMapData = {
                    fromDoorWay: true,
                };
                world.updateMap("tumble_woods",newMapData);
            }
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
    name: "house_10",
    doors: [
        "to_tumble_woods",
        "door_2",
        "door_3",
        "door_4"
    ]
});
