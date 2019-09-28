addMap({
    WorldState: function(world,data) {
        let iceman;
        let burr;
        const informSlotting = async () => {
            const keyName = (Object.entries(keybindings).filter(entry=>entry[1]===kc.cancel)[0]||[])[0]||"None";
            await world.showInstantPopup(`To slot your move press [${keyName}] to access the menu, click the "moves" button, then select a malice slot.`);
        }
        const tutorialSpeech = async () => {
            await iceman.say("There's only a few things you must know before you can fight.");
            await world.showInstantPopup("Number 1: Moves");
            await iceman.speech([
                "There are three types of moves in fighting: Logical ones, malicious ones, and moves of cowardice/fear.",
                "True, in the right situation, being fearful could be logical, but moves generally belong to one category.",
                "Logic moves come from the mind. Malice moves come from the fist. Fear comes from emotion.",
                "In this world, you may find moves that can help you in your future battles.",
                "Master your moves and their functions and you will begin to find certain synergies between them."
            ]);
            await world.showInstantPopup("Number 2: Winning");
            await iceman.speech([
                "To win a battle, you must bring your opponent's health all the way down.",
                "If that happens to you, you will lose. What that means depends on the situation you are in.",
                "There may sometimes be a way to bargain or bribe your way into winning, but that all depends on you and your opponent."
            ]);
            await world.showInstantPopup("Number 3: Your turn");
            await iceman.speech([
                "Once it is your turn, you select which type of move you are going to use. (Malice, fear, or logic)",
                "Then, you will choose one of your moves that have in your slots.",
                "Oh! You don't know about slots yet!",
                "Here, I will teach you."
            ]);
            await world.unlockMove("Wimpy Punch");
            await iceman.say("I just gave you a malice move called Wimpy Punch! Now you can fight!");
            await iceman.say("But first, you will need to slot your move.");
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
                    if(world.movesManager.hasSlotType("malice")) {
                        await iceman.say("Okay Burr, you know how to fight, right?");
                        await burr.say("Uhh, yeah. Totally dude.");
                        await iceman.say("Okay! Great. You will be the perfect sparring partner for, uh- Well, I never got your name. ONWARDS AND UPWARDS.");
                        world.startBattle("tutorial-burr",()=>{
                            world.globalState.completedTutorialBattle = true;
                        },()=>{
                            world.globalState.completedTutorialBattle = true;
                            world.globalState.failedTutorialBattle = true;
                        });
                    } else {
                        await iceman.say("Whoops. It looks like you don't have any malice moves slotted. Do you remember how?");
                        await informSlotting();
                    }
                    world.unlockPlayerMovement();
                    break;
            }
        }
    },
    name: "tutorial_place"
});
