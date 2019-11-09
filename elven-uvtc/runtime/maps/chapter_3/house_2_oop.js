addMap({
    //Frogert house
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(4,3,"down");
        }
        this.doorClicked = ID => {
            world.updateMap("tumble_woods_oop",{fromDoorWay:true});
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopup("This bookshelf is filled with elf propaganda.");
                    await world.showInstantPopup('"Frosty the Snowman and the Proletariat"');
                    break;
                case 9:
                    await world.showPopup("Froget seems to have sewn over his bed's signature elf label.");
                    break;
            }
        }
    },
    name: "house_2_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
