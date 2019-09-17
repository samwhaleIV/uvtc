addMap({
    WorldState: function(world,data) {
        this.load = world => {
            if(data.fromDoorWay) {
                world.addPlayer(5,2,"down");
            } else {
                world.addPlayer(3,4,"up");
            }

        }
        this.doorClicked = () => {
            world.updateMap("house_1_oop");
        }
        this.worldClicked = async type => {
            switch(type) {
                //Todo object interactions
            }
        }
    },
    name: "bedroom_1_oop",
    doors: [
        "to_house_1_oop"
    ]
});
