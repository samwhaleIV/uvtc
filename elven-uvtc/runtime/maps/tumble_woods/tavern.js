addMap({
    WorldState: function(world,data) {
        let frogert;
        this.load = world => {
            world.addPlayer(10,3,"down");
            if(world.globalState.metFrogert) {
                frogert = world.getCharacter("frogert","down");
                world.addObject(frogert,4,6);
                frogert.interacted = () => {

                }
            }
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.otherClicked = type => {
            switch(type) {
                case 8:
                    break;
                case 9:
                    break;
            }
        }
        this.triggerActivated = triggerID => {
          
        }
        this.triggerDeactivated = triggerID => {
            
        }
    },
    name: "tavern",
    doors: [
        "to_tumble_woods"
    ]
});
