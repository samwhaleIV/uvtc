addMap({
    WorldState: function(world,data) {
        const clearP1 = () => {
            const x = 2;
            const y = 4;
            world.changeForegroundTile(0,x,y);
            world.changeCollisionTile(0,x,y);
        };
        const clearP2 = () => {
            const x = 6;
            const y = 5;
            world.changeForegroundTile(0,x,y);
            world.changeCollisionTile(0,x,y);
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
                    world.showTextPopups([
                        "Some interesting literary choices.",
                        "'The Cold Shoulder - A Visual Novel'"
                    ]);
                    break;
                case 9:
                    world.showTextPopups([
                        "These books look cold.",
                        "The book is titled 'Don't judge a book by its cover - The self motivation book by books for books'"
                    ]);
                    break;
                case 11:
                    world.showTextPopup("This could be an unaligned holiday tree... But it's more likely a Christmas tree.");
                    break;
                case 12:
                    world.showTextPopup("This must be Shiver's bed.");
                    break;
                case 13:
                    world.showTextPopup("This must be Burr's bed.");
                    break;
                case 16:
                    clearP1();
                    world.globalState.present1 = true;
                    await world.showInstantTextPopup(statusMessage());
                    break;
                case 17:
                    clearP2();
                    world.globalState.present2 = true;
                    await world.showInstantTextPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_6",
    doors: [
        "to_tumble_woods"
    ]
});
