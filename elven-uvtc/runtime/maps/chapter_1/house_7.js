addMap({
    WorldState: function(world,data) {
        const clearP5 = () => {
            const x = 2;
            const y = 6;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
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
                    world.showPopup("It's important to wash your hands!");
                    break;
                case 16:
                    clearP5();
                    world.globalState.present5 = true;
                    await world.showInstantPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_7",
    doors: [
        "to_tumble_woods"
    ]
});
