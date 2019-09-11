addMap({
    //Book house
    WorldState: function(world,data) {
        
        const startX = 36;//Todo
        const startY = 29;//Todo

        this.load = world => {
            world.addPlayer(startX,startY,"down");
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
    name: "house_8_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
