addMap({
    WorldState: function(world,data) {
        const clearP7 = () => {
            const x = 1;
            const y = 4;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
        };
        const statusMessage = () => worldMaps.tumble_woods.presentTracker.getRemainingMessage(world);
        this.load = world => {
            if(world.globalState.present7) {
                clearP7();
            }
            world.addPlayer(8,8,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    world.showPopup("This is clearly a room of luxury.");
                    break;
                case 9:
                    world.showPopup("Perfectly symmetrical, as all things should be.");
                    break;
                case 10:
                    world.showPopup("sat_lt_2");
                    break;
                case 11:
                    world.showPopups(["There's a book sticking out from under the pillow.","It says something about the French revolution."]);
                    break;
                case 16:
                    clearP7();
                    world.globalState.present7 = true;
                    await world.showInstantPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_9",
    doors: [
        "to_tumble_woods"
    ]
});
