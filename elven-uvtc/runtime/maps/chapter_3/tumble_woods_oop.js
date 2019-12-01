addMap({
    WorldState: function(world,data) {
        const tryForceTreeLee = customMessage => {
            if(world.globalState.goneToTreeLees) {
                return false;
            } else {
                (async () => {
                    let message;
                    if(customMessage) {
                        message = customMessage;
                    } else {
                        message = "Aren't you supposed to be going to Tree Lee's house?"
                    }
                    await world.say(message);
                })();
                return true;
            }
        }
        this.load = world => {
            if(data.fromDoorWay) {
                switch(data.sourceRoom) {
                    case "house_1_oop":
                        world.addPlayer(11,55,"down");
                        break;
                    case "house_2_oop":
                        world.addPlayer(19,55,"down");
                        break;
                    case "house_3_oop":
                        world.addPlayer(27,55,"down");
                        break;
                    case "house_5_oop":
                        world.addPlayer(16,44,"down");
                        break;
                    case "house_6_oop":
                        world.addPlayer(21,44,"down");
                        break;
                    case "house_7_oop":
                        world.addPlayer(14,32,"down");
                        break;
                    case "house_8_oop":
                        world.addPlayer(36,29,"down");
                        break;
                    case "house_9_oop":
                        world.addPlayer(18,25,"down");
                        break;
                }
            } else {
                if(data.sourceRoom === "east_tumble_woods_oop") {
                    world.addPlayer(41,41,"left");
                } else {
                    world.addPlayer(28,24,"down");
                }
            }
        }
        this.doorClicked = async doorID => {
            switch(doorID) {
                case "to_house_1_oop":
                    world.updateMap("house_1_oop",{fromDoorWay:true});
                    break;
                case "to_house_2_oop":
                    world.updateMap("house_2_oop",{fromDoorWay:true});
                    break;
                case "to_house_3_oop":
                    world.updateMap("house_3_oop",{fromDoorWay:true});
                    break;
                case "to_house_5_oop":
                    world.updateMap("house_5_oop",{fromDoorWay:true});
                    break;
                case "to_house_6_oop":
                    world.updateMap("house_6_oop",{fromDoorWay:true});
                    break;
                case "to_house_7_oop":
                    if(!tryForceTreeLee()) {
                        world.updateMap("house_7_oop",{fromDoorWay:true});
                    }
                    break;
                case "to_house_8_oop":
                    world.updateMap("house_8_oop",{fromDoorWay:true});
                    break;
                case "to_house_9_oop":
                    world.updateMap("house_9_oop",{fromDoorWay:true});
                    break;
            }
        }

        this.triggerImpulse = (ID,direction) => {
            switch(ID) {
                case 2:
                    if(direction === "right") {
                        if(!tryForceTreeLee()) {
                            world.updateMap("east_tumble_woods_oop");
                        }
                        return TRIGGER_ACTIVATED;
                    }
                    break;
                case 1:
                    if(direction === "down") {
                        world.showPopup("There appears to be a plot blockage just outside the gate and it's not going to budge until a later time.");
                        return TRIGGER_ACTIVATED;
                    }
                    break;

            }
        }
    },
    useCameraPadding: true,
    doors: [
        "<unused house 10>",
        "<unused tavern>",
        "to_house_9_oop",
        "to_house_8_oop",
        "to_house_7_oop",
        "<unused mail>",
        "<unused store>",
        "<unused house 4>",
        "to_house_5_oop",
        "to_house_6_oop",
        "to_house_1_oop",
        "to_house_2_oop",
        "to_house_3_oop"
    ],
    name: "tumble_woods_oop"
});
