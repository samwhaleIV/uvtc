addMap({
    //Bathtub house
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(8,8,"down");
        }
        this.doorClicked = ID => {
            world.updateMap("tumble_woods_oop",{fromDoorWay:true});
        }
        this.otherClicked = async type => {
            switch(type) {
                //Todo object interactions
            }
        }
    },
    name: "house_9_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
