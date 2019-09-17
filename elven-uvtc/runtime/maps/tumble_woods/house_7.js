addMap({
    WorldState: function(world,data) {
        const clearP5 = () => {
            const x = 2;
            const y = 6;
            world.changeForegroundTile(0,x,y);
            world.changeCollisionTile(0,x,y);
        };
        const statusMessage = () => worldMaps.tumble_woods.presentTracker.getRemainingMessage(world);
        this.load = world => {
            if(world.globalState.present5) {
                clearP5();
            }
            world.addPlayer(4,2,"down");
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
                    world.showTextPopup("It's important to wash your hands!");
                    break;
                case 16:
                    clearP5();
                    world.globalState.present5 = true;
                    await world.showInstantTextPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_7",
    doors: [
        "to_tumble_woods"
    ]
});
