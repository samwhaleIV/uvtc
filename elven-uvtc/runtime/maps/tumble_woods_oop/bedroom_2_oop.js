addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(5,2,"down");
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
    name: "bedroom_2_oop",
    doors: [
        "to_house_1_oop"
    ]
});
