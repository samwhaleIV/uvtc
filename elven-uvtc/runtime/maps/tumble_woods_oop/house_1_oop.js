addMap({
    //Player home
    WorldState: function(world,data) {

        this.load = world => {
            switch(data.sourceRoom) {
                case "bedroom_1_oop":
                    world.addPlayer(3,2,"down");
                    break;
                case "bedroom_2_oop":
                    world.addPlayer(7,2,"down");
                    break;
                case "bedroom_3_oop":
                    world.addPlayer(11,2,"down");
                    break;
                default:
                    world.addPlayer(18,10,"down");
                    break;
            }
        }
        this.doorClicked = ID => {
            switch(ID) {
                case "to_bedroom_1_oop":
                    world.updateMap("bedroom_1_oop",{fromDoorWay:true});
                    break;
                case "to_bedroom_2_oop":
                    world.updateMap("bedroom_2_oop");
                    break;
                case "to_bedroom_3_oop":
                    world.updateMap("bedroom_3_oop");
                    break;
                case "to_tumble_woods_oop":
                    console.log(ID);
                    world.updateMap("tumble_woods_oop",{fromDoorWay:true});
                    break;
            }
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopup("You can wash your hands all your want, but it won't clean the elves from your mind.");
                    break;
                case 9:
                    await world.showPopup("The elves may have gone a bit overboard, but they at least respected you and Jim enough not to paint your toilet red.")
                    break;
                case 10:
                    await world.showPopup("Even during a hostile government takeover, it's still important to wash yourself.")
                    break;
                case 11:
                case 12:
                case 13:
                case 14:
                    await world.showPopup("The books are all cleared out. Even the famous book about the cat lady is gone.");
                    break;
                case 15:
                    await scripts.table_etch(world);
                    break;
            }
        }
    },
    name: "house_1_oop",
    doors: [
        "to_bedroom_1_oop",
        "to_bedroom_2_oop",
        "to_bedroom_3_oop",
        "to_tumble_woods_oop"
    ]
});
