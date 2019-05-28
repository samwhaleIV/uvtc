addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(8,2,"down");
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
                    world.showTextPopupID("indoor_tree");
                    break;
                case 9:
                    world.showTextPopupID("nice_envo");
                    break;
                case 10:
                    world.showTextPopupID("couch_2");
                    break;
                case 11:
                    world.showTextPopupID("couch_3");
                    break;
                case 12:
                    world.showTextPopupID("bright_idea");
                    break;
            }
        }
    },
    name: "house_5",
    doors: [
        "to_tumble_woods"
    ]
});
