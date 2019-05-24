addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(8,8,"down");
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
                    world.showTextPopupID("bathtub_getaway");
                    break;
                case 9:
                    world.showTextPopupID("sat_lt_1");
                    break;
                case 10:
                    world.showTextPopupID("sat_lt_2");
                    break;
                case 11:
                    world.showTextPopupsID(["french_rev_1","french_rev_2"]);
                    break;
            }
        }
    },
    name: "house_9",
    doors: [
        "to_tumble_woods"
    ],
});
