addMap({
    WorldState: function(world,data) {
        let louis;
        const question = async (ID,question,correct,...options) => {
            await world.showInstantTextPopup("Question " + ID);
            const q1 = await world.showPrompt(question,...options);
            await delay(400);
            if(q1 === correct || correct === "any") {
                await louis.say("Correct!");
                return true;
            } else {
                await louis.say("Sorry, that's incorrect!");
                return false;
            }
        }
        const treeCoGame = async () => {
            let correct = 0;
            await louis.say("Alright! Here we go! If you get at least 3 out of 4 questions right, you get my prize! If not, you can try again.");

            if(await question(1,"what is this place called?",2,"store","tree place","tree-co")) {
                correct++;
            }
            if(await question(2,"how many trees are in this room?",1,"3","8","7")) {
                correct++;
            }
            if(await question(3,"do apples come from trees?",0,"yes","no","not sure")) {
                correct++;
            }
            if(await question(4,"trees are an important part of:","any","paper","life","christmas")) {
                correct++;
            }

            if(correct >= 3) {
                await louis.say("You did it! You won the game!");
                await louis.say("Thank you so much for your interest in Tree-Co.");
                await louis.say("Now, as promised, your reward.");
                await world.unlockMove("Red Apple");
                world.globalState.beatTreeCoGame = true;
            } else {
                await louis.say("Ah, man. You were so close. You can try again another time for my sweet, sweet reward.");
            }
        }
        this.load = world => {
            world.addPlayer(5,7,"up");
            louis = world.getStaticCharacter("louis");
        }
        this.worldClicked = async type => {
            switch(type) {
                case 17:
                    world.updateMap("tumble_woods",{fromDoorWay:true});
                    break;
                case 8:
                case 9:
                case 10:
                case 11:
                    const applesMessage = "Apples. APPLES. apples!";
                    if(!world.globalState.talkedToStoreTrees) {
                        await world.showNamedTextPopup("Why are you spending your time trying to talk to trees?","ȹTree:ȹ ");
                        await world.showNamedTextPopup("Yeah, it's kind of weird.","ȹOther Tree:ȹ ");
                        await world.showNamedTextPopup("Hey, don't judge the dude, I like the company.","ȹOther Other Tree:ȹ ");
                        await world.showNamedTextPopup(applesMessage,"ȹOther Other Other Tree:ȹ ");
                        await world.showNamedTextPopup("This is why we don't invite you place, ȹOther Other Other Tree...ȹ","ȹTree:ȹ ");
                        world.globalState.talkedToStoreTrees = true;
                    } else {
                        await world.showNamedTextPopup(applesMessage,"ȹOther Other Other Tree:ȹ ");
                    }
                    break;
                case 13:
                    world.lockPlayerMovement();
                    if(world.globalState.metLouis) {
                        if(world.globalState.beatTreeCoGame) {
                            await louis.say("Hey again. Welcome to our town again. I'm sure we'll meet again, again.");
                        } else {
                            await louis.say("Hey again! Are you here to play the Tree-Co holiday special? I think you'll love it!");
                            const wantToPlay = await world.showPrompt("want to play the tree-co game?","yes","no") === 0 ? true : false;
                            await delay(500);
                            if(wantToPlay) {
                                await treeCoGame();
                            } else {
                                await louis.say("You're really breaking my heart today, man! I do hope you'll change your mind someday.");
                            }
                        }
                    } else {
                        world.globalState.metLouis = true;
                        await louis.say("Welcome to Tree-Co. Are you here to buy my trees? They drive me MAD.");
                        await louis.say("My name is Louis. I sell trees. If you can answer some questions about trees, I'll give you a present.");
                        await louis.say("It's a new holiday special we're running called 'if you're smarter than a tree.'");
                        const wantToTry = await world.showPrompt("want to play?","yes","no") === 0 ? true : false;
                        await delay(500);
                        if(wantToTry) {
                            await treeCoGame();
                        } else {
                            await louis.say("Ah. Darn. Well if you change your mind, I'll bear here!");
                            await louis.say("I make puns to try to put people at ease since I'm a giant brown bear...");
                            await louis.say("I hope it helped...");
                            await louis.say("I really hope you'll change your mind about the game.");
                        }
                    }
                    world.unlockPlayerMovement();
                    break;
            }
        }

        this.triggerActivated = (triggerID,direction) => {
            if(triggerID === 1 && direction === "up") {
                world.updateMap("tumble_woods",{fromDoorWay:true});
            } else {
                return PENDING_CODE;
            }
        }
    },
    fixedCamera: true,
    cameraStart: {
        x: 5,
        y: 4
    },
    name: "store"
});
