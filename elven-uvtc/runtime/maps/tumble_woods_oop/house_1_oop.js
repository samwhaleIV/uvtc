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
                    world.updateMap("bedroom_1_oop");
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
        this.otherClicked = async type => {
            switch(type) {
                //Todo object interactions
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
