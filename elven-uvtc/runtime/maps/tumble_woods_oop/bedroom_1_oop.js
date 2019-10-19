addMap({
    WorldState: function(world,data) {
        this.load = world => {
            if(data.fromDoorWay) {
                world.addPlayer(5,2,"down");
            } else {
                world.addPlayer(2,4,"up");
                world.playerObject.xOffset = 0.5;
            }

        }
        this.doorClicked = () => {
            world.updateMap("house_1_oop");
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopups([
                        "Some believe that one's shelves are a reflection of themself.",
                        "It would seem that you are hallow, empty, and devoid of speech. Just like this bookcase."
                    ]);
                    break;
                case 9:
                    await world.showPopup("An elf sleeping bag. Standard issue during elven coups.");
                    break;
                case 10:
                    //Todo table note interaction
                    break;
            }
        }
    },
    name: "bedroom_1_oop",
    doors: [
        "to_house_1_oop"
    ]
});
