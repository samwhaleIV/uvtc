addMap({
    WorldState: function(world,data) {
        let frogert;
        this.load = world => {
            world.addPlayer(4,3,"down");
            if(world.globalState.frogertDoorSequenceComplete) {
                frogert = world.getCharacter("frogert","up");
                frogert.interacted = (x,y,direction) => {
                    if(world.globalState.awaitingBeer) {
                        frogert.updateDirection(invertDirection(direction));
                        frogert.sayID("AUTO_42");
                    }
                }
                world.addObject(frogert,4,5);
                if(!world.globalState.awaitingBeer) {
                    this.start = () => {
                        scripts.enter_frogerts_house(world,frogert);
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
