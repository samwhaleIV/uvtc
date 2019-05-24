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
                    world.showTextPopupsID([
                        "bookcase_8_1",
                        "bookcase_8_2",
                        "bookcase_8_3"
                    ]);
                    break;
                case 9:
                    world.showTextPopupID("sleepingbag_1")
                    break;
            }
        }
    },
    name: "house_2",
    doors: [
        "to_tumble_woods"
    ],
});
