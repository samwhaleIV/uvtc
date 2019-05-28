addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(10,3,"down");
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
    },
    name: "tavern",
    doors: [
        "to_tumble_woods"
    ]
});
