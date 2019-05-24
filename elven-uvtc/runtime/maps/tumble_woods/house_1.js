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
});
addMap({
    WorldState: function(world,data) {
        let jim;
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
                world.addPlayer(18,10,"down");
            }
            jim = new world.sprite(world.globalState.jimsDirection||"down","jim");
            jim.prefix = "Bjim:B ";
            jim.interacted = (x,y,direction) => {
                if(world.globalState.jimMoved) {
                    jim.updateDirection(direction);
                    world.globalState.jimsDirection = direction;
                    world.showNamedTextPopupID("jims_postop",jim.prefix);
                    return;
                }
                if(direction === "left") {
                    world.showPrompt("what do you want to whisper?",["i love you","please move","uh.. nice panel?"],()=>{
                        world.lockPlayerMovement();
                        setTimeout(()=>{
                            world.showNamedTextPopupID("jims_intrigue",jim.prefix,()=>{
                                world.moveSprite(this.JIM_ID,[{y:2},{x:1}],()=>{
                                    setTimeout(()=>{
                                        jim.updateDirection("up");
                                        setTimeout(() => {
                                            jim.updateDirection("left");
                                            world.globalState.jimsDirection = "left";
                                            setTimeout(()=>{
                                                world.showNamedTextPopupID("jims_journey",jim.prefix,()=>{
                                                    world.globalState.jimMoved = true;
                                                    world.unlockPlayerMovement();
                                                    finalThread = setTimeout(()=>{
                                                        jim.updateDirection("up");
                                                        world.globalState.jimsDirection = "up";
                                                    },100);
                                                });
                                            },800);
                                        },700);
                                    },300);
                                });
                            });
                        },800);
                    });
                } else {
                    world.showNamedTextPopupID("jims_kink",jim.prefix);
                }
            }
            if(world.globalState.jimMoved) {
                this.JIM_ID = world.addObject(jim,19,12);

            } else {
                this.JIM_ID = world.addObject(jim,18,10);
            }
        }
        this.triggerActivated = (triggerID,direction) => {
            switch(triggerID) {
                case 1:
                    if(direction !== "left") {
                        return;
                    }
                    if(!world.globalState.playedEnterTrigger) {
                        world.lockPlayerMovement();
                        setTimeout(()=>{
                            jim.updateDirection("left");
                            setTimeout(()=>{                             
                                setTimeout(()=>{
                                    jim.updateDirection("down");
                                    setTimeout(()=>{
                                        jim.updateDirection("left");
                                        setTimeout(()=>{
                                            world.showNamedTextPopupsID([
                                                "jims_help_1",
                                                "jims_help_2",
                                                "jims_help_3",
                                                "jims_help_4",
                                                "jims_help_5",
                                                "jims_help_6",
                                                "jims_help_7",
                                                "jims_help_8",
                                                "jims_help_9",
                                            ],"B???:B ",()=>{
                                                world.showNamedTextPopupID("jims_help_10",jim.prefix,()=>{
                                                    world.unlockPlayerMovement();
                                                    world.globalState.playedEnterTrigger = true;
                                                    setTimeout(()=>{
                                                        jim.updateDirection("down");
                                                    },100);
                                                });
                                            });
                                        },400);
                                    },400);
                                },400);
                            },400);
                        },200);
                    }
                    break;
            }
        }
        this.doorClicked = doorID => {
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
                    world.updateMap("tumble_woods",{fromDoorWay:true});
                    break;
            }
        }
        this.otherClicked = (type,x,y) => {
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
                    world.showTextPopupID(
                        "bookcase_6_1",world.showNamedTextPopupID,"bookcase_6_2","Bedgy bookcase:B "
                    );
                    break;
                case 14:
                    world.showTextPopupID(
                        "bookcase_7_1",world.showNamedTextPopupID,"bookcase_7_2","Bnaugthy bookcase:B "
                    );
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
