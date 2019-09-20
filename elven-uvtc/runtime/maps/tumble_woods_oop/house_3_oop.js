addMap({
    //Ice man house
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
                    await world.showPopup("A glass table in a frozen room. Place objects down carefully.");
                    break;
                case 9:
                    await world.showPopup("Not even Ice Man, champion fighter of Tumble Town and its greater outlying areas, could manage to keep his own, personal sleeping bag.");
                    break;
            }
        }
    },
    name: "house_3_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
