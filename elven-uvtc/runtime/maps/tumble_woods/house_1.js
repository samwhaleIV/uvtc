addMap({
    WorldState: function(world,data) {
        this.load = world => {
            if(data.fromDoorWay) {
                world.addPlayer(5,2,"down");
            } else {
                world.addPlayer(2,4,"up");
            }
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.otherClicked = (type,x,y) => {
            switch(type) {
                case 8:
                    world.showTextPopupID("bookcase_1");
                    break;
                case 9:
                    world.showTextPopupID("bed_1");
                    break;
            }
        }
    },
    name: "bedroom_1",
    doors: [
        "to_main"
    ],
    songParent: "house_1"
});
addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(5,2,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.otherClicked = (type,x,y) => {
            switch(type) {
                case 8:
                    world.showTextPopupID("bookcase_2");
                    break;
                case 9:
                    world.showTextPopupID("bookcase_3");
                    break;
                case 10:
                    world.showTextPopupID("table_1");
                    break;
            }
        }
    },
    name: "bedroom_2",
    doors: [
        "to_main"
    ],
    songParent: "house_1"
});
addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(5,2,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.otherClicked = (type,x,y) => {
            switch(type) {
                case 8:
                    world.showTextPopupID("table_2");
                    break;
                case 9:
                case 11:
                    world.showTextPopupID("counter_1");
                    break;
                case 10:
                    world.showTextPopupID("counter_2");
                    break;
            }
        }
    },
    name: "bedroom_3",
    doors: [
        "to_main"
    ],
    songParent: "house_1"
});
addMap({
    WorldState: function(world,data) {
        let jim;
        const bookcase1Prefix = "ȴEdgy Bookcase:ȴ ";
        const bookcase2Prefix = "ȴNaugthy Bookcase:ȴ ";
        this.load = world => {
            if(data.fromDoorWay) {
                switch(data.sourceRoom) {
                    case "bedroom_1":
                        world.addPlayer(3,2,"down");
                        break;
                    case "bedroom_2":
                        world.addPlayer(7,2,"down");
                        break;
                    case "bedroom_3":
                        world.addPlayer(11,2,"down");
                        break;
                    case "tumble_woods":
                        world.addPlayer(18,10,"down");
                        break;
                }
            } else {
                world.addPlayer(12,11,"down");
            }
            jim = world.getCharacter("jim",world.globalState.jimsDirection||"down");
            jim.interacted = (x,y,direction) => {
                if(world.globalState.jimMoved) {
                    jim.updateDirection(direction);
                    world.globalState.jimsDirection = direction;
                    jim.sayID("jims_postop");
                    return;
                }
                if(direction === "left") {
                    scripts.jim_gets_the_hell_out_of_the_way(world,jim);
                } else {
                    jim.sayID("jims_kink");
                }
            }
            if(world.globalState.jimMoved) {
                world.addObject(jim,19,12);
            } else {
                world.addObject(jim,18,10);
            }
        }
        let didTriggerEnterTrigger = false;
        this.triggerActivated = (triggerID,direction) => {
            switch(triggerID) {
                case 1:
                    if(direction !== "left") {
                        return;
                    }
                    if(!world.globalState.playedEnterTrigger) {
                        if(!didTriggerEnterTrigger) {
                            didTriggerEnterTrigger = true;
                            scripts.how_to_press_enter(world,jim);
                        }
                    }
                    break;
            }
        }
        this.doorClicked = async doorID => {
            switch(doorID) {
                case "to_bedroom_1":
                    world.updateMap("bedroom_1",{fromDoorWay:true});
                    break;
                case "to_bedroom_2":
                    world.updateMap("bedroom_2",{fromDoorWay:true});
                    break;
                case "to_bedroom_3":
                    world.updateMap("bedroom_3",{fromDoorWay:true});
                    break;
                case "to_tumble_woods":
                    if(!world.globalState.goMeetFrogert) {
                        if(jim) {
                            world.lockPlayerMovement();
                            await delay(500);
                            await jim.sayID("AUTO_41");
                            world.globalState.goMeetFrogert = true;
                            world.unlockPlayerMovement();
                            return;
                        }
                    }
                    world.updateMap("tumble_woods",{fromDoorWay:true});
                    break;
            }
        }
        this.otherClicked = async (type,x,y) => {
            switch(type) {
                case 8:
                    world.showTextPopupID("sink_1");
                    break;
                case 9:
                    world.showTextPopupID("toilet_1");
                    break;
                case 10:
                    world.showTextPopupID("bathtub_1");
                    break;
                case 11:
                    world.showTextPopupID("bookcase_4");
                    break;
                case 12:
                    world.showTextPopupsID([
                        "bookcase_5_1",
                        "bookcase_5_2",
                        "bookcase_5_3"
                    ]);
                    break;
                case 13:
                    await world.showTextPopupID("bookcase_6_1");
                    world.showNamedTextPopupID("bookcase_6_2",bookcase1Prefix);
                    break;
                case 14:
                    await world.showTextPopupID("bookcase_7_1");
                    world.showNamedTextPopupID("bookcase_7_2",bookcase2Prefix);
                    break;
                case 15:
                    break;
                case 16:
                    world.showTextPopupID("couch_1");
                    break;
            }
        }
    },
    doors: [
        "to_bedroom_1",
        "to_bedroom_2",
        "to_bedroom_3",
        "to_tumble_woods"
    ],
    name: "house_1"
});
