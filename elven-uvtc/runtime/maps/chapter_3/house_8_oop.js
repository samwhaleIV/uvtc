addMap({
    //Book house
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(4,2,"down");
        }
        this.doorClicked = ID => {
            world.updateMap("tumble_woods_oop",{fromDoorWay:true});
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopup("It seems that the elves have redesignated this book hoarder's home into a warehouse for their propaganda.");
                    break;
                case 9:
                    await world.showPopups([
                        "I can't take these books anymore.",
                        "Please.. Kill me."
                    ]);
                    break;
            }
        }
    },
    name: "house_8_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
