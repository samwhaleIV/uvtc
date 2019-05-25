addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(4,3,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.otherClicked = async type => {
            switch(type) {
                case 8:
                    await world.showTextPopupsID([
                        "bookcase_9_1",
                        "bookcase_9_2",
                        "bookcase_9_3",
                    ]);
                    const selection = await world.showPrompt("do you want to read an adult book?",["yes","no"]);
                    if(selection === 0) {
                        world.showTextPopupID("bookcase_9_4_1");
                    } else {
                        world.showTextPopupID("bookcase_9_4_2");
                    }
                    break;
                case 9:
                    world.showTextPopupID("emptyshelf");
                    break;
                case 10:
                    world.showTextPopupID("longtable");
                    break;
                case 11:
                    world.showTextPopupID("dryer_1");
                    break;
                case 16:
                    world.showTextPopupID("washer_1");
                    break;
                case 12:
                    world.showTextPopupID("sb_1");
                    break;
                case 13:
                    world.showTextPopupID("sb_2");
                    break;
                case 14:
                    world.showTextPopupID("sb_3");
                    break;
                case 15:
                    world.showTextPopupID("sb_4");
                    break;
            }
        }
    },
    name: "house_4",
    doors: [
        "to_tumble_woods"
    ],
});
