addMap({
    WorldState: function(world,data) {
        let objectiveHUD = null;
        const completeObjective = () => {
            if(objectiveHUD) {
                objectiveHUD.markComplete(async()=>{
                    world.globalState.pressedEnterObjective = true;
                    objectiveHUD = null;
                },true);
            }
        }
        const setHUDText = () => {
            const keyName = (Object.entries(keybindings).filter(entry=>entry[1]===kc.accept)[0]||[])[0]||"None";
            objectiveHUD.text = `Press [${keyName}] on an object to interact with it`;
        }
        const keybindWatchID = addKeybindWatch(setHUDText);
        this.load = world => {
            if(!world.globalState.pressedEnterObjective) {
                objectiveHUD = world.setObjectiveHUD("Interact with the world",false);
                setHUDText();
            }
            if(data.fromDoorWay) {
                world.addPlayer(5,2,"down");
            } else {
                world.addPlayer(2,4,"up");
            }
        }
        this.unload = () => {
            removeKeybindWatch(keybindWatchID);
        }
        this.doorClicked = () => {
            completeObjective();
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.worldClicked = (type,x,y) => {
            completeObjective();
            switch(type) {
                case 8:
                    world.showPopup("There are a lot of books on this shelf.");
                    break;
                case 9:
                    world.showPopup("A sleeping bag on a hardwood floor, a fine luxury.");
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
    WorldState: function(world) {
        this.load = world => {
            world.addPlayer(5,2,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.worldClicked = type => {
            switch(type) {
                case 8:
                    world.showPopup("Lots of books here... A lot of them seem to mention some kind of card game?");
                    break;
                case 9:
                    world.showPopup("This bookcase demonstrates that it's okay to be small. Way to go bookcase!");
                    break;
                case 10:
                    world.showPopup("These plastic, foldable tables have seen a lot of life. Are they for parties?");
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
    WorldState: function(world) {
        this.load = world => {
            world.addPlayer(5,2,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.worldClicked = type => {
            switch(type) {
                case 8:
                    world.showPopup("These tables are pretty much everywhere.");
                    break;
                case 9:
                case 11:
                    world.showPopup("This must be a kitchen... Seems to be missing a few things, though.");
                    break;
                case 10:
                    world.showPopup("This is the cleanest kitchen you've seen in your entire life.");
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
                    jim.say("Let's stay in touch. Hehe.");
                    return;
                }
                if(direction === "left") {
                    scripts.jim_gets_the_hell_out_of_the_way(world,jim);
                } else {
                    jim.say("If you whisper something in my right ear I'll get out of your way.");
                }
            }
            if(world.globalState.jimMoved) {
                world.addObject(jim,19,12);
            } else {
                world.addObject(jim,18,10);
            }
        }
        let didTriggerEnterTrigger = false;
        this.triggerImpulse = (triggerID,direction) => {
            switch(triggerID) {
                case 1:
                    if(direction !== "right") {
                        return;
                    }
                    if(!world.globalState.playedEnterTrigger) {
                        if(!didTriggerEnterTrigger) {
                            didTriggerEnterTrigger = true;
                            scripts.how_to_press_enter(world,jim);
                        }
                    }
                    return TRIGGER_ACTIVATED;
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
                            await jim.alert();
                            await jim.say("Oh! Before you go, could you go and meet your neighbor? He doesn't have a lot of friends. Thanks.");
                            world.globalState.goMeetFrogert = true;
                            world.unlockPlayerMovement();
                            return;
                        }
                    }
                    world.updateMap("tumble_woods",{fromDoorWay:true});
                    break;
            }
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    world.showPopup("It's important to wash your hands!");
                    break;
                case 9:
                    world.showPopup("It's important to use toilets!");
                    break;
                case 10:
                    world.showPopup("It's important to wash... yourself.");
                    break;
                case 11:
                    world.showPopup("This bookcase doesn't have very many books on it.");
                    break;
                case 12:
                    world.showPopups([
                        "This bookcase has a few intersting books on it.",
                        "One book is called The Cat Lady Manifesto.",
                        '"If I loved my children as much as I love my cats, I\'d have children"'
                    ]);
                    break;
                case 13:
                    await world.showPopup("This bookcase is trying to be an edgy reflection of society.");
                    world.showNamedPopup("Is it working?",bookcase1Prefix);
                    break;
                case 14:
                    await world.showPopup("This bookcase seems to be more inappropriate than the other bookcases.");
                    world.showNamedPopup("Hey... What're you wearing?",bookcase2Prefix);
                    break;
                case 15:
                    await scripts.table_etch(world);
                    break;
                case 16:
                    world.showPopup("This couch looks too clean to sit on. Who gets a white couch anyways?");
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
