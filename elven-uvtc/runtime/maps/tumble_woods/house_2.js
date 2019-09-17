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
                        frogert.say("Go get me some beer, dude. Ah, I mean, uh, 'friend'.");
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
        this.worldClicked = type => {
            switch(type) {
                case 8:
                    world.showTextPopups([
                        "There's not many books on this shelf, but there are a few interesting ones.",
                        "ȸOwning Two Pieces of Furniture for Dummiesȸ",
                        "It seems to be a book about minimalism."
                    ]);
                    break;
                case 9:
                    world.showTextPopup("Hmm... Sleeping bags seem to be in style in this town.")
                    break;
            }
        }
    },
    name: "house_2",
    doors: [
        "to_tumble_woods"
    ]
});
