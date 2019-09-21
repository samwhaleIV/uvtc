addMap({
    //Bathtub house
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(8,8,"down");
        }
        this.doorClicked = ID => {
            world.updateMap("tumble_woods_oop",{fromDoorWay:true});
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopup("The water won't turn on, but that's a good thing. You seem like the kind of person who would turn it on and never come back.");
                    break;
                case 9:
                    await world.showPopup("The elves didn't seem to mind this lamp. Minimalist furniture 1, elves 0.");
                    break;
                case 10:
                    await world.showPopups([
                        "Do you have any idea how expensive it is to have these lights on 24/7 when no one even lives here?",
                        "I'm bright, but I have no idea.",
                        ".. But that's a good thing. Ideas are particularly dangerous if you're a lamp. It's like ripping your heart out and dropping it on your head."
                    ]);
                    break;
                case 11:
                    await world.showPopup("All these sleeping bags seem unnecessarily painful. Why couldn't the town just spring for elves? It would seem even the elves missed the mark on this one.");
                    break;
            }
        }
    },
    name: "house_9_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
