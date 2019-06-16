addMap({
    WorldState: function(world,data) {
        let frogert;
        this.load = world => {
            world.addPlayer(4,3,"down");

            if(world.globalState.frogertDoorSequenceComplete) {
                frogert = world.getCharacter("frogert","up");
                world.addObject(frogert,4,5);
                if(world.globalState.gotBeer || world.globalState.frogertGotHisBeer) {
                    frogert.interacted = (x,y,direction) => {
                        if(world.globalState.frogertGotHisBeer) {
                            frogert.updateDirection(direction);
                            scripts.frogert_is_grateful_for_beer(world,frogert);
                            //already drank beer
                        } else {
                            frogert.updateDirection(direction);
                            scripts.frogert_downs_some_beer(world,frogert);
                            //handing the beer to frogert
                        }
                    }
                    if(!world.globalState.frogertGotHisBeer) {
                        this.start = () => {
                            scripts.frogert_is_glad_you_came_back(world,frogert)
                        }
                    }
                } else {
                    frogert.interacted = (x,y,direction) => {
                        frogert.updateDirection(direction);
                        frogert.sayID("AUTO_42");
                    }
                    if(!world.globalState.awaitingBeer) {
                        this.start = () => {
                            scripts.enter_frogerts_house(world,frogert);
                        }
                    }
                }
            }
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.otherClicked = type => {
            switch(type) {
                case 8:
                    world.showTextPopupsID([
                        "bookcase_8_1",
                        "bookcase_8_2",
                        "bookcase_8_3"
                    ]);
                    break;
                case 9:
                    world.showTextPopupID("sleepingbag_1")
                    break;
            }
        }
    },
    name: "house_2",
    doors: [
        "to_tumble_woods"
    ]
});
