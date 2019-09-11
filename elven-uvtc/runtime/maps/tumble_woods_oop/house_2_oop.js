addMap({
    //Frogert house
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(4,3,"down");
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
    name: "house_2_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
