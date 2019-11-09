addMap({
    WorldState: function(world,data) {
        const clearP1 = () => {
            const x = 2;
            const y = 4;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
        };
        const clearP2 = () => {
            const x = 6;
            const y = 5;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
        };
        const statusMessage = () => worldMaps.tumble_woods.presentTracker.getRemainingMessage(world);
        this.load = world => {
            world.addPlayer(4,2,"down");
            if(world.globalState.present1) {
                clearP1();
            }
            if(world.globalState.present2) {
                clearP2();
            }
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
                    world.showPopups([
                        "Some interesting literary choices.",
                        "'The Cold Shoulder - A Visual Novel'"
                    ]);
                    break;
                case 9:
                    world.showPopups([
                        "These books look cold.",
                        "The book is titled 'Don't judge a book by its cover - The self motivation book by books for books'"
                    ]);
                    break;
                case 11:
                    world.showPopup("This could be an unaligned holiday tree... But it's more likely a Christmas tree.");
                    break;
                case 12:
                    world.showPopup("This must be Shiver's bed.");
                    break;
                case 13:
                    world.showPopup("This must be Burr's bed.");
                    break;
                case 16:
                    clearP1();
                    world.globalState.present1 = true;
                    await world.showInstantPopup(statusMessage());
                    break;
                case 17:
                    clearP2();
                    world.globalState.present2 = true;
                    await world.showInstantPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_6",
    doors: [
        "to_tumble_woods"
    ]
});
