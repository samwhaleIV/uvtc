addMap({
    WorldState: function(world,data) {
        let iceman;
        this.load = world => {
            world.addPlayer(4,3,"down");
            iceman = world.getCharacter("ice-man","down");

            const readyToFight = async () => {
                const ready = await world.showPrompt("are you ready to learn to fight?","yes","another time") === 0;
                await delay(700);
                if(ready) {
                    world.updateMap("tutorial_place");
                } else {
                    await iceman.sayID("AUTO_142");
                }
            }
            iceman.interacted = async () => {
                world.lockPlayerMovement();

                if(world.globalState.completedTutorialBattle) {
                    await iceman.sayID("AUTO_194");
                    world.unlockPlayerMovement();
                    return;
                }

                if(world.globalState.icemanFightPreampleComplete) {
                    await readyToFight();   
                    world.unlockPlayerMovement();
                    return;
                }

                if(!world.globalState.icemanPreambleComplete) {
                    await iceman.speechID([
                        "AUTO_143",
                        "AUTO_144",
                        "AUTO_145"
                    ]);
    
                    const name = await world.showPrompt("what is your name?","jim","i forgot","none of your business");
                    let firstMessage;
                    switch(name) {
                        case 0:
                            firstMessage = "AUTO_146";
                            break;
                        case 1:
                            firstMessage = "AUTO_147";
                            break;
                        case 2:
                            firstMessage = "AUTO_148";
                            break;
                        default:
                            firstMessage = "AUTO_149";
                            break;
                    }
                    await delay(800);
                    await iceman.sayID(firstMessage);
                    await iceman.sayID("AUTO_189");
                    world.globalState.icemanPreambleComplete = true;
                }
                
                const reason = await world.showPrompt("what are you here for?","to learn to fight","a frog told me to","elflix and chill");
                await delay(800);
                switch(reason) {
                    case 0:
                        await iceman.speechID([
                            "AUTO_150",
                            "AUTO_151",
                            "AUTO_152",
                            "AUTO_153",
                            "AUTO_154"
                        ]);
                        const startTime = Date.now();
                        await world.showPrompt("indulge ice man?","*sigh* sure..");
                        const endTime = (Date.now() - startTime) / 1000;
                        if(endTime > 3) {
                            await delay(500);
                            await iceman.sayID("AUTO_155");
                        } else {
                            await iceman.sayID("AUTO_156");
                        }
                        await iceman.sayID("AUTO_157");
                        world.globalState.icemanFightPreampleComplete = true;
                        await readyToFight();
                        break;
                    case 1:
                        await iceman.sayID("AUTO_158");
                        await iceman.sayID("AUTO_159");
                        break;
                    case 2:
                        await iceman.sayID("AUTO_190");
                        await iceman.sayID("AUTO_159");
                        break;
                }

                world.unlockPlayerMovement();
            }
            world.addObject(iceman,3,3);
            if(!world.globalState.metIceman) {
                this.start = () => {
                    world.globalState.metIceman = true;
                    world.lockPlayerMovement();
                    delay(500);
                    iceman.sayID("AUTO_160");
                    world.unlockPlayerMovement();
                }
            } else if(world.globalState.completedTutorialBattle) {
                if(!world.globalState.cameBackToIceman) {
                    this.start = async () => {
                        world.lockPlayerMovement();
                        world.playerObject.updateDirection("left");
                        world.globalState.cameBackToIceman = true;
                        await delay(700)
                        await iceman.sayID("AUTO_195");
                        await iceman.sayID("AUTO_196");
                        await iceman.sayID("AUTO_197");
                        await iceman.sayID("AUTO_198");
                        await rendererState.showInstantTextPopup("(Not a chance)");
                        await iceman.sayID("AUTO_199");
                        await iceman.sayID("AUTO_200");
                        await iceman.sayID("AUTO_201");
                        await iceman.sayID("AUTO_202");
                        world.unlockPlayerMovement();
                    }
                }
            }
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.otherClicked = type => {
            switch(type) {
                case 8:
                    world.showTextPopupID("rudetable");
                    break;
                case 9:
                    world.showTextPopupID("sleepingbag_2");
                    break;
            }
        }
    },
    name: "house_3",
    doors: [
        "to_tumble_woods"
    ]
});
