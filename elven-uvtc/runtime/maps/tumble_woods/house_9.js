addMap({
    WorldState: function(world,data) {
        const clearP7 = () => {
            const x = 1;
            const y = 4;
            world.changeForegroundTile(0,x,y);
            world.changeCollisionTile(0,x,y);
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
                case 16:
                    clearP7();
                    world.globalState.present7 = true;
                    await world.showInstantTextPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_9",
    doors: [
        "to_tumble_woods"
    ]
});
