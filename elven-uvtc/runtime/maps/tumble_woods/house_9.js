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
                    world.showTextPopup("This is clearly a room of luxury.");
                    break;
                case 9:
                    world.showTextPopup("Perfectly symmetrical, as all things should be.");
                    break;
                case 10:
                    world.showTextPopup("sat_lt_2");
                    break;
                case 11:
                    world.showTextPopups(["There's a book sticking out from under the pillow.","It says something about the French revolution."]);
                    break;
            }
        }
    },
    name: "house_9",
    doors: [
        "to_tumble_woods"
    ]
});
