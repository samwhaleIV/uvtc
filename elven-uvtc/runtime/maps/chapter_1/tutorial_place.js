addMap({
    WorldState: function(world,data) {
        let iceman;
        let burr;
        const informSlotting = async () => {
            const keyName = (Object.entries(keybindings).filter(entry=>entry[1]===kc.cancel)[0]||[])[0]||"None";
            await world.showInstantPopup(`To change your attack slot press [${keyName}] to access the menu, click the "slot" button, then select the attack slot.`);
        }
        const tutorialSpeech = async () => {
            await iceman.say("There's only a few things you must know before you can fight.");

            await world.showInstantPopup("Number 1: The basics");
            await iceman.say("Each battler has 3 lives. If one if you reaches 0, that battler loses.");
            await iceman.say("Each round each battler's health is restored. If it becomes empty, you lose a life.");

            await world.showInstantPopup("Number 2: Combat");
            await iceman.say("There are many different types of attacks in the world of fighting, but today we are going to focus on hand to hand combat.");
            await iceman.say("Your attacks can be changed by selecting a different slot.");
            await iceman.say("Likewise, there are also defense slots and even special slots you may someday come across to aid you in your battles.");
            await iceman.say("Oh! You don't know about slots yet?");

            await world.unlockSlot("Wimpy");
            await iceman.say("Here, I just gave you an attack slot called Wimpy! Now you can fight!");
            await iceman.say("But before you can fight, you will need to select your attack slot first.");
            await informSlotting();
            await iceman.say("If you are ready to battle, talk to Burr and you two can battle.");
            if(!world.globalState.icemanBattlePreamble) {
                await burr.say("What! You said I wasn't part of this!");
                await iceman.say("Do it and I'll get you some beer later.");
                await burr.say("Okay, fineeeee.");
                world.globalState.icemanBattlePreamble = true;
            }
        }
        this.load = world => {
            world.addPlayer(6,6,"right");
            iceman = world.getCharacter("ice-man","down");
            world.addObject(iceman,7,4);
            burr = world.getStaticCharacter("burr");
            iceman.interacted = async () => {
                const shouldRepeat = await world.showPrompt("hear the battle speech?","yes","no") === 0;
                if(shouldRepeat) {
                    await delay(500);
                    await tutorialSpeech();
                }
            }

            this.start = async () => {
                if(world.globalState.completedTutorialBattle) {
                    await delay(600);
                    if(world.globalState.failedTutorialBattle) {
                        await iceman.say("Wow. You failed your first battle against a drunk ice cream cone.");
                        await iceman.say("A drunk ice cream cone that didn't even fight back, I should add.");
                    } else {
                        await iceman.say("Wow. That battle was... Truly remarkable.");
                        await iceman.say("I've never witnessed a battle quite like that before.");
                    }
                    await iceman.say("Just when I thought I saw it all.");
                    await burr.say("Can we please leave now? I have important business to attend to.");
                    await iceman.say("...");
                    await burr.say("What?");
                    await iceman.say("Alchohol isn't important business to attend to, Burr.");
                    await burr.say("When will you learn, Ice Man?");
                    await iceman.say("Anyways, Burr is right. We should get going.");
                    await iceman.say("The ventilation here is terrible.");
                    await delay(500);
                    await iceman.say("Alright, off we go!");
                    world.updateMap("house_3");
                    world.unlockPlayerMovement();
                    return;
                }
                if(world.globalState.battleTutorialPreamble) {
                    world.unlockPlayerMovement();
                    return;
                }
                await iceman.say("WELCOME TO THE BATTLE DOJO.");
                await burr.say("...");
                await iceman.say("Uh, how did you get here Burr?");
                await burr.say("I, I, uh- I DON'T KNOW. I'M SCARED.");
                await iceman.say("Okay he's, uh, not part of your lesson... moving on.");
                await iceman.say("I believe the best way to teach is to dump a massive load of information on you all at once.");
                await iceman.say("So, alright, HERE IT GOES.");
                await tutorialSpeech();
                await iceman.say("Well, that was my speech about battling. If you want to hear it again, just ask.");
                world.globalState.battleTutorialPreamble = true;
                world.unlockPlayerMovement();
            }
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    world.lockPlayerMovement();
                    if(world.movesManager.hasSlotType("attack")) {
                        await iceman.say("Okay Burr, you know how to fight, right?");
                        await burr.say("Uhh, yeah. Totally dude.");
                        if(!world.globalState.icemanDidGetYourName) {
                            await iceman.say("Okay! Great. You will be the perfect sparring partner for, uh- Well, I never got your name.");
                        } else {
                            await iceman.say("Okay! Great. You will be the perfect sparring partner for Jim!");
                            await iceman.say("Even though that's not your real name..");
                        }
                        await iceman.say("ONWARDS AND UPWARDS!");
                        world.startBattle("tutorial-burr",()=>{
                            world.globalState.completedTutorialBattle = true;
                        },()=>{
                            world.globalState.completedTutorialBattle = true;
                            world.globalState.failedTutorialBattle = true;
                        });
                    } else {
                        await iceman.say("Whoops. It looks like you don't have an attack slot. Do you remember how to set it?");
                        await informSlotting();
                    }
                    world.unlockPlayerMovement();
                    break;
            }
        }
    },
    name: "tutorial_place"
});
