const delay = time => new Promise(resolve => setTimeout(resolve,time));

const scripts = {
    jim_gets_the_hell_out_of_the_way: async (world,jim) => {
        world.lockPlayerMovement();
        await world.showPrompt("what do you want to whisper?","i love you","please move","uh.. nice panel?");
        await delay(800);
        await jim.sayID("jims_intrigue");
        await jim.move({y:2},{x:1});
        await delay(300);
        jim.updateDirection("up");
        await delay(700);
        jim.updateDirection("left");
        await delay(800);
        await jim.sayID("jims_journey");
        world.globalState.jimMoved = true;
        world.unlockPlayerMovement();
        await delay(250);
        jim.updateDirection("up");
        world.globalState.jimsDirection = "up";
    },
    how_to_press_enter: async (world,jim) => {
        world.lockPlayerMovement();
        await delay(400);
        jim.updateDirection("left");
        await delay(200);
        await jim.alert();
        await delay(200);
        jim.updateDirection("down");
        await delay(400);
        jim.updateDirection("left");
        await delay(400);
        await jim.speechID([
            "jims_help_1",
            "jims_help_2",
            "jims_help_3",
            "jims_help_4",
            "jims_help_5",
            "jims_help_6",
            "jims_help_7",
            "jims_help_8",
            "jims_help_9",
        ],"???");
        await jim.sayID("jims_help_10");
        world.unlockPlayerMovement();
        world.globalState.playedEnterTrigger = true;
        await delay(200);
        jim.updateDirection("down");
    },
    meeting_frogert: async (world,frogert) => {
        world.lockPlayerMovement();
        await delay(500);
        world.autoCameraOff();
        await world.moveCamera(...frogert.location,700);
        frogert.updateDirection("left");
        await delay(200);
        world.playerObject.updateDirection("right");
        await frogert.alert();
        world.popupProgressEnabled = false;
        frogert.sayID("stranger_danger");
        frogert.speed *= 1.25;
        world.followObject = frogert;
        world.autoCameraOn();
        await frogert.move({x:4});
        await delay(500);
        frogert.updateDirection("up");
        await delay(400);
        frogert.hidden = true;
        await delay(1000);
        await world.moveCamera(...world.playerObject.location,700);
        world.followObject = null;
        world.removeObject(frogert.ID);
        await delay(300);
        world.unlockPlayerMovement();
        world.clearTextPopup();
        world.popupProgressEnabled = true;
        world.globalState.metFrogert = true;
    },
    frogert_doorway: async (world,frogert) => {
        world.lockPlayerMovement();
        await delay(100);
        await frogert.sayID("AUTO_2");
        let whoItIs = await world.showPrompt("who are you?","mom","your neighbor","not really sure","knock knock");
        await delay(1000);
        await frogert.sayID([
            "AUTO_3",
            "AUTO_4",
            "AUTO_5",
            "AUTO_6"
        ][whoItIs]);
        if(whoItIs === 1) {
            world.globalState.frogertDoorSequenceComplete = true;
        } else if(whoItIs === 3) {
            whoItIs = await world.showPrompt("who are you?","mom","your neighbor","frogert");
            await delay(1000);
            await frogert.sayID([
                "AUTO_7",
                "AUTO_8",
                "AUTO_9"
            ][whoItIs]);
            whoItIs = await world.showPrompt("punchline","let me in","i'm coming in",[
                "your mom!",
                "your neighbor that wants in",
                "frogert the frog"
            ][whoItIs]);
            await delay(1000);
            switch(whoItIs) {
                case 0:
                    await frogert.sayID("AUTO_10");
                    let askingNicely = await world.showPrompt("do you want to ask nicely?","no","yes","bye");
                    await delay(1000);
                    switch(askingNicely) {
                        case 0:
                            await frogert.sayID("AUTO_11");
                            break;
                        case 1:
                            await frogert.sayID("AUTO_12");
                            world.globalState.frogertDoorSequenceComplete = true;
                            break;
                        case 2:
                            await frogert.sayID("AUTO_13");
                            break;
                    }
                    break;
                case 1:
                    await frogert.sayID("AUTO_14");
                    let reason = await world.showPrompt(strings["AUTO_15"],"my boldness","time constraints","i have a key to the city");
                    await delay(1000);
                    switch(reason) {
                        case 0:
                            frogert.speechID([
                                "AUTO_16",
                                "AUTO_17",
                                "AUTO_18"
                            ]);
                            break;
                        case 1:
                            frogert.speechID([
                                "AUTO_19",
                                "AUTO_20",
                                "AUTO_21",
                                "AUTO_22",
                            ]);
                            world.globalState.frogertDoorSequenceComplete = true;
                            break;
                        case 2:
                            await frogert.speechID([
                                "AUTO_23",
                                "AUTO_24"
                            ]);
                            let mayorName = await world.showPrompt("what is the mayor's name?","john smith","me","frogert","boney elf");
                            await delay(1000);
                            const notTheMayor = "AUTO_25";
                            switch(mayorName) {
                                case 0:
                                    await frogert.speechID([
                                        notTheMayor,
                                        "AUTO_26",
                                        "AUTO_27",
                                        "AUTO_28",
                                        "AUTO_29"
                                    ]);
                                    break;
                                case 1:
                                    await frogert.speechID([
                                        "AUTO_30",
                                        "AUTO_31",
                                        "AUTO_32"
                                    ]);
                                    break;
                                case 2:
                                    await frogert.speechID([
                                        "AUTO_33",
                                        "AUTO_34"
                                    ])
                                    break;
                                case 3:
                                    await frogert.speechID([
                                        notTheMayor,
                                        "AUTO_35",
                                        "AUTO_36",
                                        "AUTO_37"
                                    ]);
                                    break;
                            }
                            break;
                    }
                    break;
                case 2:
                    await frogert.speechID([
                        "AUTO_38",
                        "AUTO_39"
                    ]);
                    break;
            }
        } else if(whoItIs === 0) {
            await frogert.sayID("AUTO_40");
        }
        world.unlockPlayerMovement();
    },
    frogert_lets_be_friends: async (world,frogert,skipStart) => {
        if(!skipStart) {
            await frogert.speechID([
                "AUTO_43",
                "AUTO_44",
                "AUTO_45",
                "AUTO_46",
                "AUTO_47"
            ]);
        }
        playSound("energy");
        await world.showInstantTextPopup("Congratulations! Frogert is now your friend!");
        await frogert.speechID([
            "AUTO_48",
            "AUTO_49",
            "AUTO_50"
        ]);
        world.globalState.awaitingBeer = true;
    },
    enter_frogerts_house: async (world,frogert) => {
        world.lockPlayerMovement();
        await delay(400);
        await frogert.alert();
        await delay(200);
        await frogert.speechID([
            "AUTO_51",
            "AUTO_52"
        ]);
        let promptResult = await world.showPrompt("explain yourself","hi","be my friend","i was forced here");
        await delay(800);
        switch(promptResult) {
            case 0:
                await frogert.speechID([
                    "AUTO_53",
                    "AUTO_54"
                ]);
                const whyYouLied = await world.showPrompt("why did you lie to frogert?","i want to be his friend","i am a sociopath","just because");
                await delay(800);
                switch(whyYouLied) {
                    case 0:
                        await scripts.frogert_lets_be_friends(world,frogert);
                        break;
                    case 1:
                    case 2:
                        await frogert.speechID([
                            "AUTO_55",
                            "AUTO_56"
                        ]);
                        await scripts.frogert_lets_be_friends(world,frogert,true);
                        break;
                    case 2:
                        break;
                }
                break;
            case 1:
                await scripts.frogert_lets_be_friends(world,frogert);
                break;
            case 2:
                await frogert.speechID([
                    "AUTO_57",
                    "AUTO_58",
                    "AUTO_59",
                    "AUTO_60",
                    "AUTO_61",
                    "AUTO_62",
                    "AUTO_63"
                ]);
                await scripts.frogert_lets_be_friends(world,frogert,true);
                break;
        }
        world.unlockPlayerMovement();
    }
};
