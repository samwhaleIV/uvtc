addMap({
    WorldState: function(world,data) {
        const clearP6 = () => {
            const x = 4;
            const y = 3;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
        };
        const statusMessage = () => worldMaps.tumble_woods.presentTracker.getRemainingMessage(world);
        this.load = world => {
            if(world.globalState.present6) {
                clearP6();
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
                    world.showPopups(["Wow. This person sure likes books.","You can't grab any books or else the whole house might fall apart."]);
                    break;
                case 16:
                    clearP6();
                    world.globalState.present6 = true;
                    await world.showInstantPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_8",
    doors: [
        "to_tumble_woods"
    ]
});
