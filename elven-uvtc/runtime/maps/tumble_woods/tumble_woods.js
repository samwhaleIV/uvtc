"1";"2";"3";"4";"5";"6";"7";"8";"9";"10";
addMap({
    WorldState: function(world,data) {
        let frogert;
        this.load = world => {
            if(data.fromDoorWay) {
                switch(data.sourceRoom) {
                    case "house_1":
                        world.addPlayer(11,55,"down");
                        if(!world.globalState.metFrogert) {
                            frogert = world.getCharacter("frogert","down");
                            world.addObject(frogert,15,55);
                            this.start = () => {
                                scripts.meeting_frogert(world,frogert);
                            }
                        }
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
            if(world.globalState.metFrogert && !world.globalState.frogertGotHisBeer) {
                if(doorID === "to_house_1") {
                    world.updateMap("house_1",{fromDoorWay:true});
                } else if(doorID === "to_house_2") {
                    if(world.globalState.frogertDoorSequenceComplete) {
                        world.updateMap("house_2",{fromDoorWay:true});
                        return;
                    }
                    if(!frogert) {
                        frogert = world.getCharacter("frogert","down");
                    }
                    scripts.frogert_doorway(world,frogert);
                } else if(world.globalState.awaitingBeer) {
                    if(world.globalState.gotBeer) {
                        if(doorID === "to_tavern") {
                            world.updateMap("tavern",{fromDoorWay:true});
                        } else {
                            world.showTextPopup("You need to get that beer back to Frogert while it's still cold. Just like a friend should.")
                        }
                    } else {
                        if(doorID === "to_tavern") {
                            world.updateMap("tavern",{fromDoorWay:true});
                        } else {
                            world.showTextPopup("You should be a good friend and get a beer from the ȴTavernȴ for Frogert. You can go here later.");
                        }
                    }
                } else {
                    world.showTextPopup("You should probably go check if that frog you scared is okay first.");
                }
                return;
            }
            if(!world.globalState.completedTutorialBattle) {
                if(doorID === "to_house_1" || doorID === "to_house_2" || doorID === "to_house_3") {
                    world.updateMap(doorID.substring(3),{fromDoorWay:true});
                } else {
                    world.showTextPopup("You should go learn some fighting skills from Ice Man. Tumble Town can be a dangerous place.");
                }
                return;
            }
            world.updateMap(doorID.substring(3),{fromDoorWay:true});
        }

        this.triggerActivated = ID => {
            switch(ID) {
                case 2:
                case 1:
                    world.showTextPopup("You can't leave ȹTumble Townȹ yet! You have important things to do!");
                    break;

            }
        }
    },
    presentTracker: {
        maxCount: 7,
        getPresentCount: function(world) {
            let count = 0;
            for(let i = 0;i<this.maxCount;i++) {
                if(world.globalState["present"+(i+1)]) {
                    count++;
                }
            }
            return count;
        },
        hasAllPresents: function(world) {
            return this.getPresentCount(world) === this.maxCount;
        },
        getRemainingMessage: function(world) {
            const count = this.getPresentCount(world);
            const remaining = this.maxCount - count;
            playSound("energy");
            if(remaining === 0) {
                return "You found the last present! You found them all!";
            } else {
                return "You found a present! " + remaining + " more to go!";
            }
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
