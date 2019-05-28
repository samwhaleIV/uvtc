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
                    world.showTextPopupID("rudetable");
                    break;
                case 9:
                    world.showTextPopupID("sleepingbag_2");
                    break;
            }
        }
    },
    name: "house_3",
    doors: [
        "to_tumble_woods"
    ]
});
