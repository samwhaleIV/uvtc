addMap({
    WorldState: function(world,data) {
        this.load = world => {
            if(data.fromDoorWay) {
                switch(data.sourceRoom) {
                    case "house_1":
                        world.addPlayer(11,55,"down");
                        break;
                    case "house_2":
                        world.addPlayer(19,55,"down");
                        break;
                    case "house_3":
                        world.addPlayer(27,55,"down");
                        break;
                    case "house_4":
                        world.addPlayer(11,44,"down");
                        break;
                    case "house_5":
                        world.addPlayer(16,44,"down");
                        break;
                    case "house_6":
                        world.addPlayer(21,44,"down");
                        break;
                    case "house_7":
                        world.addPlayer(14,32,"down");
                        break;
                    case "house_8":
                        world.addPlayer(36,30,"down");
                        break;
                    case "house_9":
                        world.addPlayer(18,25,"down");
                        break;
                    case "house_10":
                        world.addPlayer(22,19,"down");
                        break;
                    case "tavern":
                        world.addPlayer(33,19,"down");
                        break;
                    case "store":
                        world.addPlayer(32,36,"down");
                        break;
                    case "mail":
                        world.addPlayer(24,34,"down");
                        break;
                }
            } else {
                world.addPlayer(26,41,"down");
            }
        }
        this.doorClicked = doorID => {
            world.updateMap(doorID.substring(3),{fromDoorWay:true});
        }
        this.otherClicked = (type,x,y) => {
        }
    },
    useCameraPadding: true,
    doors: [
        "to_house_10",
        "to_tavern",
        "to_house_9",
        "to_house_8",
        "to_house_7",
        "to_mail",
        "to_store",
        "to_house_4",
        "to_house_5",
        "to_house_6",
        "to_house_1",
        "to_house_2",
        "to_house_3"
    ],
    name: "tumble_woods"
});
