addMap({
    //Tree Lee House
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(8,2,"down");
        }
        this.doorClicked = ID => {
            world.updateMap("tumble_woods_oop",{fromDoorWay:true});
        }
        this.worldClicked = async type => {
            switch(type) {
                //Todo object interactions
            }
        }
    },
    name: "house_5_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
