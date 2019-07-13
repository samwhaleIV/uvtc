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
                    world.showTextPopup("An indoor tree? Finally, something unique in one of these houses.");
                    break;
                case 9:
                    world.showTextPopup("There's a nice atmosphere to do things at this table.");
                    break;
                case 10:
                    world.showTextPopup("The couch has some light stains on it.");
                    break;
                case 11:
                    world.showTextPopup("The couch is so bright it's hard to look at.");
                    break;
                case 12:
                    world.showTextPopup("What a bright idea putting a lamp next to two windows.");
                    break;
            }
        }
    },
    name: "house_5",
    doors: [
        "to_tumble_woods"
    ]
});
