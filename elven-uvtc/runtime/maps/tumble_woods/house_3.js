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
                    await iceman.say("Ah, okay, come talk to me when you're ready. I am the best and always will be.");
                }
            }
            iceman.interacted = async () => {
                world.lockPlayerMovement();

                if(world.globalState.completedTutorialBattle) {
                    await iceman.say("Did you meet more people in the town yet? I'm sure they're dying to meet you!");
                    world.unlockPlayerMovement();
                    return;
                }

                if(world.globalState.icemanFightPreampleComplete) {
                    await readyToFight();   
                    world.unlockPlayerMovement();
                    return;
                }

                if(!world.globalState.icemanPreambleComplete) {
                    await iceman.speech([
                        "Well, you're a new face.",
                        "Even though you have no manners, it's nice to meet you, I guess. I'm Ice Man.",
                        "And who would you be?"
                    ]);
    
                    const name = await world.showPrompt("what is your name?","jim","i forgot","none of your business");
                    let firstMessage;
                    switch(name) {
                        case 0:
                            firstMessage = "Jim? You look... different. New diet?";
                            break;
                        case 1:
                            firstMessage = "You forgot your own name? Fine, whatever, don't tell me.";
                            break;
                        case 2:
                            firstMessage = "None of my business? Look, we run a tight-knit community here. Everybody knows everybody.";
                            break;
                        default:
                            firstMessage = "Ah, I see. Your name is cheater. Got it.";
                            break;
                    }
                    await delay(800);
                    await iceman.say(firstMessage);
                    await iceman.say("So, what brings you uninvited into my house?");
                    world.globalState.icemanPreambleComplete = true;
                }
                
                const reason = await world.showPrompt("what are you here for?","to learn to fight","a frog told me to","elflix and chill");
                await delay(800);
                switch(reason) {
                    case 0:
                        await iceman.speech([
                            "Ah. Fighting. I know a thing or two about fighting.",
                            "Some would say I am an expert.",
                            "Some would say I am the best.",
                            "Surely you must know that I am the greatest fighter in all of Tumble Town.",
                            "But of course you knew that.",
                            "Everyone knows that.",
                            "Right? You knew that? Right?"
                        ]);
                        const startTime = Date.now();
                        await world.showPrompt("indulge ice man?","*sigh* sure..");
                        const endTime = (Date.now() - startTime) / 1000;
                        if(endTime > 3) {
                            await delay(500);
                            await iceman.say("Hmm... you hesitated. No matter.. BECAUSE I AM THE BEST AND YOU KNOW IT NOW.");
                        } else {
                            await iceman.say("YEAH THAT'S RIGHT I AM THE BEST MHUAHAHAHAHAHAHA.");
                        }
                        await iceman.say("Okay. Well, if you're ready, we can begin your training right now!");
                        world.globalState.icemanFightPreampleComplete = true;
                        await readyToFight();
                        break;
                    case 1:
                        await iceman.say("Oh. Frogert? That frog has a serious drinking problem. He was probably drunk when he told you to come here.");
                        await iceman.say("Well if you need help with anything else, like fighting, you know where to find me.");
                        break;
                    case 2:
                        await iceman.say("That's... Disgusting. Or is this a pun? ha.. ha..");
                        await iceman.say("Well if you need help with anything else, like fighting, you know where to find me.");
                        break;
                }

                world.unlockPlayerMovement();
            }
            world.addObject(iceman,3,3);
            if(!world.globalState.metIceman) {
                this.start = () => {
                    world.globalState.metIceman = true;
                    delay(500);
                    iceman.say("Jeez. Don't you knock? I could have been doing something you might not have wanted to see.");
                    world.unlockPlayerMovement();
                }
            } else if(world.globalState.completedTutorialBattle) {
                if(!world.globalState.cameBackToIceman) {
                    this.start = async () => {
                        world.playerObject.updateDirection("left");
                        world.globalState.cameBackToIceman = true;
                        await delay(700)
                        await iceman.say("Ah. Fresh air.");
                        await iceman.say("I'm glad I was able to help you.");
                        await iceman.say("You proved yourself to be a great fighter back there.");
                        await iceman.say("Maybe someday we can fight? Haha.");
                        await rendererState.showInstantPopup("(Not a chance)");
                        await iceman.say("Well, you should probably start meeting more of the townspeople.");
                        await iceman.say("I heard the Chilis are throwing a Christmas party soon and you might put people at ease if they meet you ahead of time.");
                        await iceman.say("The Chilis live West of the tavern in the big, tall house.");
                        await iceman.say("They're a great couple, I'm sure they'd love to meet you.");
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
        this.worldClicked = type => {
            switch(type) {
                case 8:
                    world.showPopup("Someone didn't bring the chair back to the table. How rude!");
                    break;
                case 9:
                    world.showPopup("Whoever lives here also has a blue sleeping bag... It must be a popular color.");
                    break;
            }
        }
    },
    name: "house_3",
    doors: [
        "to_tumble_woods"
    ]
});
