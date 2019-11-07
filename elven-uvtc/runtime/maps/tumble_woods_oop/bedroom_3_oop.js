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
                case 8:
                    await world.showPopup("It would seem that someone had an accident while putting up these posters.");
                    break;
                case 9:
                    await world.showPopup("There is some candy cane meat cooking on the stove.")
                    break;
                case 10:
                    await world.showPopup("Candy cane meat. Everyone's favorite.");
                    break;
                case 11:
                    await world.showPopups([
                        "Ooooh. This is green candy cane meat.",
                        "It tastes just like red candy cane meat except it's green.",
                        "Elves really know how to spice things up.",
                        "Bless elves."
                    ]);
                    break;
                case 12:
                    await world.showPopup("Plates.. or bowls? Doesn't matter! You can candy cane meat anywhere.");
                    break;
            }
        }
    },
    name: "bedroom_3_oop",
    doors: [
        "to_house_1_oop"
    ]
});
