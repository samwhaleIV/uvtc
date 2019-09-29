function delay(time) {
    if(rendererState && rendererState.setTimeout) {
        return new Promise(resolve=>{
            rendererState.setTimeout(resolve,time);
        });
    } else {
        return new Promise(resolve=>{
            setTimeout(resolve,time);
        });
    }
}
function inlineSetTimeout(callback,time) {
    if(rendererState && rendererState.setTimeout) {
        rendererState.setTimeout(callback,time);
    } else {
        setTimeout(callback,time);
    }
}

const scripts = {
    popupFormatTest: async () => {
        let popup = rendererState.showPopup;
        const lock = rendererState.lockPlayerMovement;
        const unlock = rendererState.unlockPlayerMovement;
        if(popup && lock && unlock) {
            const messages = [
                '"This is a test!!!!!"',
                "Is this message choppy? 'We gonna find out!'",
                "'Yeet.'",
                "'Yeet'.",
            ];
            lock();
            for(let i = 0;i<messages.length;i++) {
                await popup(messages[i]);
                await delay(500);
            }
            unlock();
        } else {
            console.log("It doesn't look like this is the world renderer state!");
        }
    },
    table_etch: async world => {
        world.lockPlayerMovement();
        if(world.globalState.etchedNameIntoTable) {
            await world.showPopup("Your name is still etched into the table. You know that was a permanent decision, right?");
        } else {
            await world.showPopup("Someone etched their name into the table. Do you want to add yours?");
            const wantsToEtch = await world.showPrompt("etch your name in the glass?","yes","no") === 0;
            await delay(500);
            if(wantsToEtch) {
                world.globalState.etchedNameIntoTable = true;
                await world.showInstantPopup("Your name is now etched into the table.");
            } else {
                await world.showPopup("Ah, perhaps another time.");
            }
        }
        world.unlockPlayerMovement();
    },
    jim_gets_the_hell_out_of_the_way: async (world,jim) => {
        world.lockPlayerMovement();
        await world.showPrompt("what do you want to whisper?","i love you","please move","uh.. nice panel?");
        await delay(800);
        await jim.say("Oh. My. I'll be getting out of your way, now.");
        await jim.move({y:2},{x:1});
        await delay(300);
        jim.updateDirection("up");
        await delay(700);
        jim.updateDirection("left");
        await delay(800);
        await jim.say("That was quite the journey... You may use the door, now.");
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
        await jim.speech([
            "Oh. Hi there.",
            "If you want to talk with me, come over to me and use your mouth.",
            "...",
            "Oh. You don't know how to use your mouth?",
            "...",
            "Well, this is awkward.",
            "Give me a second.",
            "...",
            "What? You already figured it out?",
        ],"???");
        await jim.say("Well, it's nice to meet you. My name is Jim.");
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
        frogert.say("Ahh! Stranger danger! Get away from me!");
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
        await frogert.say("Who is it?");
        let whoItIs = await world.showPrompt("who are you?","mom","your neighbor","not really sure","knock knock");
        await delay(1000);
        await frogert.say([
            "Mom..? You sound different. Did you start smoking again?",
            "Ohhh, Jim? Long time no see. Come on in!",
            "Sorry 'not really sure', but I can't just let strangers in without a warrant.",
            "Uhh, who's there?"
        ][whoItIs]);
        if(whoItIs === 1) {
            world.globalState.frogertDoorSequenceComplete = true;
        } else if(whoItIs === 3) {
            whoItIs = await world.showPrompt("who are you?","mom","your neighbor","frogert");
            await delay(1000);
            await frogert.say([
                "Mom..? Mom who?",
                "My neighbor who?",
                "Frogert. Huh. Are you my clone? Frogert who?"
            ][whoItIs]);
            whoItIs = await world.showPrompt("punchline","let me in","i'm coming in",[
                "your mom!",
                "your neighbor that wants in",
                "frogert the frog"
            ][whoItIs]);
            await delay(1000);
            switch(whoItIs) {
                case 0:
                    await frogert.say("Only if you ask nicely.");
                    let askingNicely = await world.showPrompt("do you want to ask nicely?","no","yes","bye");
                    await delay(1000);
                    switch(askingNicely) {
                        case 0:
                            await frogert.say("Please leave now. I don't have time for your rudeness.");
                            break;
                        case 1:
                            await frogert.say("See, that's better. You may come in, now.");
                            world.globalState.frogertDoorSequenceComplete = true;
                            break;
                        case 2:
                            await frogert.say("Oh. Okay. Bye then.");
                            break;
                    }
                    break;
                case 1:
                    await frogert.say("What makes you think you can just barge on in here?");
                    let reason = await world.showPrompt("what do you want to say?","my boldness","time constraints","i have a key to the city");
                    await delay(1000);
                    switch(reason) {
                        case 0:
                            frogert.speech([
                                "Yeah, right. 'Boldness'",
                                "You know who else is bold? Crazy people.",
                                "Try again next time. I've got enough of my own crazy in here."
                            ]);
                            break;
                        case 1:
                            frogert.speech([
                                "Alright. That's fair.",
                                "You've got places to be, I get it.",
                                "Really, I do.",
                                "You can come in, now.",
                            ]);
                            world.globalState.frogertDoorSequenceComplete = true;
                            break;
                        case 2:
                            await frogert.speech([
                                "Really? A key to the city?",
                                "What's the mayors name, then?"
                            ]);
                            let mayorName = await world.showPrompt("what is the mayor's name?","john smith","me","frogert","boney elf");
                            await delay(1000);
                            const notTheMayor = "You're not the mayor...";
                            switch(mayorName) {
                                case 0:
                                    await frogert.speech([
                                        notTheMayor,
                                        "John Smith? John Smith at yahoo.com?",
                                        "Well you must have important things to do, John Smith.",
                                        "I'll let you be on your way, now.",
                                        "I only let trusted people in my home."
                                    ]);
                                    break;
                                case 1:
                                    await frogert.speech([
                                        "Hmm. You don't sound like the mayor.",
                                        "In fact, we don't even have a mayor. We just have town meetings.",
                                        "Anyhow, I don't let liars into my home."
                                    ]);
                                    break;
                                case 2:
                                    await frogert.speech([
                                        "Alright, look wise guy. I know you're not Frogert.",
                                        "And I know you think you're sooooooo funny, but I'm not going to let you in my home just because you can make a decent joke."
                                    ])
                                    break;
                                case 3:
                                    await frogert.speech([
                                        notTheMayor,
                                        "Oh. You're that creep that lives next door.",
                                        "I would prefer you not coming in, it took me a week to get the stench of your booze out of here last time.",
                                        "Come back when you've laid off the booze."
                                    ]);
                                    break;
                            }
                            break;
                    }
                    break;
                case 2:
                    await frogert.speech([
                        "Wow. That's a reallllly good joke... *cough*",
                        "If you want in my house you're gonna have to do better than that."
                    ]);
                    break;
            }
        } else if(whoItIs === 0) {
            await frogert.say("Well, now is not a good time, mom. I'm hiding from that stranger outside. You should look out.");
        }
        world.unlockPlayerMovement();
    },
    frogert_lets_be_friends: async (world,frogert,skipStart) => {
        if(!skipStart) {
            await frogert.speech([
                "f- friend? After everything we've been through together? What are you, crazy!",
                "What? It's only been about a minute?",
                "...",
                "Well, at any rate, I suppose. maybe... just maybe, we could be friends.",
                "... just don't touch me, please."
            ]);
        }
        await world.someoneIsNowYourFriend(frogert);
        await frogert.speech([
            "Okay. Now that we're 'friends', why don't you be a pal and get me a beer from the ȴTavern?ȴ",
            "Follow the path and keep north, it's right at the base of ȴGreat Lake Tumble.ȴ",
            "And don't take too long, I want it to be cold when you bring it back."
        ]);
        world.globalState.awaitingBeer = true;
    },
    enter_frogerts_house: async (world,frogert) => {
        world.lockPlayerMovement();
        await delay(400);
        await frogert.alert();
        await delay(200);
        await frogert.speech([
            "Hey! You're the same stranger from outside!",
            "You tricked me!"
        ]);
        let promptResult = await world.showPrompt("explain yourself","hi","be my friend","i was forced here");
        await delay(800);
        switch(promptResult) {
            case 0:
                await frogert.speech([
                    "Uh. Hi. I'm still not okay with you coming in here on false pretenses.",
                    "Explain yourself."
                ]);
                const whyYouLied = await world.showPrompt("why did you lie to frogert?","i want to be his friend","i am a sociopath","just because");
                await delay(800);
                switch(whyYouLied) {
                    case 0:
                        await scripts.frogert_lets_be_friends(world,frogert);
                        break;
                    case 1:
                    case 2:
                        await frogert.speech([
                            "...",
                            "Well. I can't argue with that logic."
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
                await frogert.speech([
                    "Honestly? That is sooo relatable.",
                    "I feel like I understand everything we've been through together so much better now.",
                    "I think we will be the best of pals",
                    "Great pals.",
                    "Pals forever.",
                    "Pals who definitely won't betray each other.",
                    "Ever."
                ]);
                await scripts.frogert_lets_be_friends(world,frogert,true);
                break;
        }
        world.unlockPlayerMovement();
    },
    frogert_downs_some_beer: async (world,frogert) => {
        world.lockPlayerMovement();
        world.globalState.gotBeer = false;
        world.globalState.frogertGotHisBeer = true;
        await world.showInstantPopupSound("You handed the beer to frogert!");
        await frogert.say("...");
        await world.showInstantPopup("Frogert is inspecting the beer.");
        await frogert.say("This isn't poison is it?");
        await world.showPrompt("is this beer poison?","uhh no","sometimes","technically yes");
        await delay(1500);
        await frogert.say("Well, that's a risk I'm willing to take. I'm just sooo thirsty.");
        await world.showInstantPopup("Frogert drank the entire beer.");
        await world.showInstantPopup("Does everyone in this town have an alchohol problem or something?");
        await frogert.speech([
            "Ahhhhhhhhh",
            "That hit the spot.",
            "Thanks again, 'friend.'",
            "Speaking of friends, you should probably go meet more members of the town, don't you think?",
            "My other next door neighbor besides you and Jim is Ice Man. He knows a lot about fighting or something.",
            "Alright. Now leave me in peace to get about as drunk as possible for a frog."
        ]);
        world.unlockPlayerMovement();
    },
    frogert_is_grateful_for_beer: async (world,frogert) => {
        world.lockPlayerMovement();
        await frogert.say("Did you met teh Ice Man yeh? i promes 'es not es intimidorting as he sound.")
        world.unlockPlayerMovement();
    },
    frogert_is_glad_you_came_back: async (world,frogert) => {
        await frogert.alert();
        await frogert.speech([
            "Wow! You actually came back with beer. I wasn't so sure that you would.",
            "... it took long enough.",
            "Now, please bring it over here. I'm so parched I can barely move."
        ]);
        world.unlockPlayerMovement();
    }
};
