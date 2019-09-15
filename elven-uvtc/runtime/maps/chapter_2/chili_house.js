addMap({
    requiredSongs: [
        ScriptedSongLinkingManifest["oops-wrong-song"],
        ScriptedSongLinkingManifest["party-song"],
        ScriptedSongLinkingManifest["lights-off-meet-elves"]
    ],
    WorldState: function(world,data) {

        let objectiveHUD = null;

        let burr;
        let shiver;

        let jim;
        let frogert;
        let iceMan;
        let jam;
        let treeLee;
        let chili;
        let chiliWife;

        let wimpyRed;
        let wimpyGreen;
        let wizard;

        const getMingleCount = () => {
            let count = 0;
            for(let i = 1;i < 9;i++) {
                if(world.globalState[`mingle${i}`]) {
                    count++;
                }
            }
            return count;
        }

        const updateMingleCount = () => {
            if(!objectiveHUD) {
                return;
            }
            const mingleCount = getMingleCount();
            objectiveHUD.text = `Mingle With Partygoers: ${mingleCount}/8`;
            if(mingleCount === 8) {
                objectiveHUD.markComplete(async()=>{
                    await world.showInstantTextPopup("You are now socially exhausted.");
                    await world.showInstantTextPopup("Maybe you should take a step outside?");
                    world.globalState.metAll = true;
                });
            }
        }

        const createObjectiveHUD = isNew => {
            if(world.globalState.metAll) {
                return;
            }
            objectiveHUD = world.setObjectiveHUD("Mingle with all of the partygoers!",isNew);
            updateMingleCount();
        }

        const partyInteraction = async (target,direction) => {
            if(world.globalState.elfChaseRequired) {
                await world.showInstantTextPopup("There's no time to talk! Go get those elves!");
                return;
            }
            target.updateDirection(direction);
            await target.say(target.message);
            if(target.mingleID) {
                world.globalState[`mingle${target.mingleID}`] = true;
                updateMingleCount();
            }
        }
        const bindPartyInteraction = target => {
            target.interacted = (x,y,direction) => partyInteraction(target,direction);
        }

        const removeIcePeople = () => {
            const locations = [{x:8,y:1},{x:8,y:2},{y:1,x:10},{y:2,x:10}];
            locations.forEach(location => {
                world.changeCollisionTile(0,location.x,location.y);
                world.changeForegroundTile(0,location.x,location.y);
            });
        }

        const clearPresentMove = () => {
            world.changeForegroundTile(0,10,5);
            world.changeCollisionTile(0,10,5);
        }

        this.load = () => {

            if(world.globalState.chiliMovePresent) {
                clearPresentMove();
            }

            shiver = world.getStaticCharacter("shiver");
            burr = world.getStaticCharacter("burr");

            jim = world.getCharacter("jim","down");
            world.addObject(jim,3,3);

            jam = world.getCharacter("jam","down");
            world.addObject(jam,4,3);

            iceMan = world.getCharacter("ice-man","up");
            world.addObject(iceMan,6,7);


            frogert = world.getCharacter("frogert","up");
            world.addObject(frogert,5,7);


            treeLee = world.getCharacter("tree-lee","right");
            world.addObject(treeLee,2,6);


            chili = world.getCharacter("chili","down");
            world.addObject(chili,5,6);

            chiliWife = world.getCharacter("chili-wife","down");
            world.addObject(chiliWife,6,6);

            frogert.message = "Thanks a ton for getting me that beer, friend.";
            iceMan.message = "Have you been practicing your fighting skills?";
            jam.message = "Hi. Hi. Hi. Hi... I'm not good at parties.";
            treeLee.message = "This party is okay, I guess.";
            chili.message = "Thank you soooo much for getting the presents together! The party had a major turnout!";
            chiliWife.message = "If there's ever anything you need, Chili and I are always here for you! Make yourself at home.";

            frogert.mingleID = 1;
            iceMan.mingleID = 2;
            jam.mingleID = 3;
            treeLee.mingleID = 4;
            chili.mingleID = 5;
            chiliWife.mingleID = 6;

            jim.interacted = () => {
                if(world.globalState.elfChaseRequired) {
                    jim.say("Jam is missing! Please! Stop those elves!");
                    return;
                }
                if(world.globalState.metAll) {
                    jim.say("Hey! You met everyone. You look beat. You should get some fresh air.");
                } else {
                    jim.say("Go on! Mingle with the rest of the partygoers!");
                }
            }
            bindPartyInteraction(frogert);
            bindPartyInteraction(iceMan);
            bindPartyInteraction(jam);
            bindPartyInteraction(treeLee);
            bindPartyInteraction(chili);
            bindPartyInteraction(chiliWife);

            if(data.sourceRoom === "tumble_showdown") {
                world.addPlayer(5,2,"down");
            } else {
                world.addPlayer(3,4,"up");
            }

            if(world.globalState.jimToldYouToMingle) {
                createObjectiveHUD(false);
            }

            if(world.globalState.elfChaseRequired) {
                world.removeObject(chili.ID);
                world.removeObject(jam.ID);
                world.moveObject(jim.ID,8,4,false);
                jim.updateDirection("left");
                removeIcePeople();
                world.moveObject(frogert.ID,4,7);
                frogert.updateDirection("up");
                world.moveObject(iceMan.ID,7,6);
                iceMan.updateDirection("up");
                chiliWife.updateDirection("up");
            }

            this.start = async () => {
                if(data.fromNorthPolePreview) {
                    if(!musicMuted) {
                        world.playSong(
                            ScriptedSongLinkingManifest["oops-wrong-song"]
                        );
                    } else {
                        world.playSong(
                            ScriptedSongLinkingManifest["party-song"]
                        );
                    }
                    await world.fadeFromBlack(2000);
                    world.popCustomRenderer();
                    if(!musicMuted) {
                        await delay(1500);
                        world.stopMusic();
                        await world.showTextPopup("Uhhhh! WRONG SONG!");
                        await world.playSong(
                            ScriptedSongLinkingManifest["party-song"]
                        );
                        await world.showTextPopup("Ah, yes. That's better. Less impending doom.");
                    }
                } else {
                    world.playSong(
                        ScriptedSongLinkingManifest["party-song"]
                    );
                }
                if(!world.globalState.jimToldYouToMingle) {
                    await delay(700);
                    await jim.say("I'm so glad you're here at the party.");
                    await jim.say("I know you're having a difficult time adjusting to this new town...");
                    await jim.say("I think now's your chance. You should go and say hello to everyone here!");
                    createObjectiveHUD(true);
                    world.globalState.jimToldYouToMingle = true;
                }
                world.unlockPlayerMovement();
            }
        }
        this.doorClicked = async () => {
            if(world.globalState.elfChaseRequired) {
                world.updateMap("tumble_showdown");
                return;
            }
            if(!world.globalState.metAll) {
                await world.showTextPopup("Are you really trying to leave? The party is just getting started!");
                await world.showTextPopup("Say hello to more people!");
            } else {
                world.stopMusic();
                world.lockPlayerMovement();

                await world.showInstantTextPopup("Someone knocked on the door right as you tried to open it!");
                await world.showNamedTextPopup("Hey! We're here for the party!","???: ");

                world.autoCameraOff();

                await delay(200);
                chili.updateDirection("up");
                await world.moveCamera(...chili.location,500);
                await delay(200);

                await chili.say("Okay! Everyone! The special guests have arrived!");

                await delay(200);
                await world.moveCamera(...jim.location,400);
                await delay(200);

                await jim.say("Uhh. What special guests?");

                await delay(200);
                await world.moveCamera(...chili.location,400);
                await delay(200);

                await chili.say("You know.. The VERY special ones.");

                await delay(200);
                await world.moveCamera(...world.playerObject.location,400);
                await delay(200);
                chili.updateDirection("down");

                world.autoCameraOn();
                
                await delay(200);

                await chili.say("Hit the lights!");
                world.pushCustomRenderer({render:()=>{
                    context.fillStyle = "black";
                    context.fillRect(0,0,fullWidth,fullHeight);
                }});       

                await world.showInstantTextPopup("...");
                await world.showInstantTextPopup("Light footsteps are heard entering through the door.");


                await burr.say("Ahh! What are you doing!");
                await shiver.say("W-what? What're you doing here!");

                await jam.say("OH GOD PLEASE DON'T TOUCH ME I AM ALLERGIC TO BEING TOUCHED!");

                await world.showInstantTextPopup("Bottles are heard breaking.");

                await chili.say("Chillene!");

                await chiliWife.say("Chili! Noooo!");

                await world.showInstantTextPopup("Chili's shouting fades into distant mumbling.");


                await iceMan.say("You won't have me so easy!");
                await world.showInstantTextPopup("Lots of punches are heard.");

                world.removeObject(chili.ID);
                world.removeObject(jam.ID);

                await iceMan.say("Quick! Somebody get the lights back on!");
                await world.showNamedTextPopup("Oh. As you wish.","???: ");

                world.moveObject(world.playerObject.ID,5,4,false);
                world.playerObject.xOffset = 0;
                world.playerObject.yOffset = 0;
                world.moveObject(jim.ID,8,4,false);
                jim.updateDirection("left");
                world.playerObject.updateDirection("up");

                wimpyGreen = world.getCharacter("wimpy-green-elf","down");
                wizard = world.getCharacter("wizard-elf","down");
                wimpyRed = world.getCharacter("wimpy-red-elf","down");

                world.addObject(wimpyGreen,4,2);
                world.addObject(wimpyRed,5,2);
                world.addObject(wizard,6,2);

                removeIcePeople();

                world.moveObject(frogert.ID,4,7);

                frogert.updateDirection("up");
                world.moveObject(iceMan.ID,7,6);
                iceMan.updateDirection("up");

                chiliWife.updateDirection("up");

                await delay(600);
                world.playSong(
                    ScriptedSongLinkingManifest["lights-off-meet-elves"]
                );
                world.popCustomRenderer();
                await delay(800);
                await wimpyRed.say("Why... Hello there.");
                await wimpyRed.say("Pleasure to meet you all.");
                await wimpyRed.say("Allow us to introduce ourselves.");
                world.autoCameraOff();
                await world.moveCamera(...wimpyGreen.location,300);
                await wimpyGreen.say("I'm Wimpy Green Elf.");
                await world.moveCamera(...wimpyRed.location,300);
                await wimpyRed.say("Me? That's easy. Wimpy Red Elf.");
                await world.moveCamera(...wizard.location,300);
                await wizard.say("And me. Wizard Elf. Everyone's favorite.");
                await world.moveCamera(...world.playerObject.location,300);
                await world.autoCameraOn();
                await delay(400);
                wimpyRed.updateDirection("up");
                await delay(500);
                await wimpyRed.say("The pain and suffering of elves has gone on long enough...");
                await wimpyRed.say("Us elves can't live this way anymore. Never once did you even think about us... Did you?");
                await delay(500);
                wimpyRed.updateDirection("down");
                await delay(600);

                await wimpyRed.say("Well. It's time for a change.");
                world.autoCameraOff();

                await world.moveCamera(...wimpyGreen.location,300);
                await wimpyGreen.say("A new era.");
                await world.moveCamera(...wizard.location,300);
                await wizard.say("A new world.");
                await world.moveCamera(...world.playerObject.location,300);

                await delay(400);
                await wimpyRed.say("Let those we have taken from you burn in your mind!");
                await wimpyGreen.say("Let it burn every day!");
                await wizard.say("Burn. Every. Second.");
                await delay(400);
                await wimpyRed.say("Let us share our pain with you.");
                
                await delay(200);
                await world.moveCamera(...iceMan.location,400);
                await iceMan.say("Do you really think we're just gonna let you steal our friends?");
                await delay(200);
                await world.moveCamera(...wimpyRed.location,400);
                await delay(200);
                await wimpyRed.say("Haha! Look here everyone we've got a comedian.");
                await wimpyRed.say("Of course we are, Ice Man.");
                await delay(200);
                await world.moveCamera(...iceMan.location,400);
                await delay(200);
                await iceMan.say("How do you know my name?");
                await delay(200);
                await world.moveCamera(...wimpyRed.location,400);
                await delay(200);
                await wimpyRed.say("Imagine that. The Ice Man doesn't know why an elf would know his name?");
                await wimpyRed.say("You all truly are disgraces.");
                await wimpyRed.say("Every. Single. One of you.");
                await delay(200);
                await world.moveCamera(...iceMan.location,400);
                await delay(200);
                
                await iceMan.say("We aren't just gonna let you get away without a fight.");
                await delay(200);
                await world.moveCamera(...wimpyRed.location,400);
                await delay(200);
                await wimpyRed.say("Oh really? Is that so?");
                await delay(500);
                wimpyRed.updateDirection("up");
                await delay(500);
                world.removeObject(wimpyRed.ID);
                await wimpyGreen.move({x:1});
                await delay(300);
                wimpyGreen.updateDirection("up");
                await delay(300);
                world.removeObject(wimpyGreen.ID);
                await wizard.move({x:-1});
                await delay(300);
                wizard.updateDirection("up");
                await delay(300);
                world.removeObject(wizard.ID);
                await delay(200);
                await world.moveCamera(...iceMan.location,400);
                await iceMan.say("Someone quick! After them!");
                await world.moveCamera(...world.playerObject.location,200);
                world.autoCameraOn();
                world.unlockPlayerMovement();
                world.globalState.elfChaseRequired = true;
            }
        }
        this.otherClicked = async type => {
            switch(type) {
                case 8:
                    world.showTextPopup("Burr and Shiver are keeping their beers under the table out of sight.");
                    break;
                case 9:
                    if(world.globalState.talkedToShiver) {
                        await shiver.say("Who throws a party without booze?");
                        await shiver.say("The Chilis. That's who.");
                    } else {
                        await shiver.say("Hey.. I'm a bit drunk, but don't tell anyone. The Chilis are MASSIVE teetotalers.");
                        world.globalState.talkedToShiver = true;
                    }
                    world.globalState.mingle8 = true;
                    updateMingleCount();
                    break;
                case 10:
                    await burr.say("Hey! I remember that time I didn't know where the hell I was and we sparred! Good times.");
                    world.globalState.mingle7 = true;
                    updateMingleCount();
                    break;
                case 11:
                    world.showTextPopup("Are you trying to open someone else's present?");
                    break;
                case 12:
                    if(!world.globalState.chiliMovePresent) {
                        if(world.globalState.gotWrongPresentAnswer) {
                            await world.showTextPopup("Look buddy, you had your chance! Come back another time.");
                            break;
                        }
                        world.lockPlayerMovement();
                        await world.showTextPopup("Oh. Are you wondering who this present is for?");
                        const amCurious = await world.showPrompt("are you curious?","yes","no") === 0 ? true : false;
                        await delay(500);
                        if(amCurious) {
                            await world.showTextPopup("Interesting.");
                            await world.showTextPopup("How about this, if you can solve my riddle, you can have me.");
                            await world.showTextPopup("Can a present be opened tomorrow? Answer carefully, I don't give second chances!");
                            const correctAnswer = await world.showPrompt("can a present be opened tomorrow?","yes","no") === 0 ? false : true;
                            await delay(500);
                            if(correctAnswer) {
                                world.globalState.chiliMovePresent = true;
                                await world.showTextPopup("Yep! That's right. A present can only be opened in the present!");
                                await world.showTextPopup("Open me carefully. Please be gentle.");
                                clearPresentMove();
                                world.unlockMove("Jingle Bells");
                            } else {
                                world.globalState.gotWrongPresentAnswer = true;
                                await world.showTextPopup("Hmm. Nope. A present can only be opened in the present.");
                            }
                        } else {
                            await world.showTextPopup("Ah, well, perhaps we can do this another time.");
                        }
                        world.unlockPlayerMovement();
                    }
                    break;
                case 13:
                    world.showTextPopup("Aren't Christmas trees supposed to have stars on them?");
                    break;
                case 14:
                    world.showTextPopup("I'm a bit of a wallflower at parties.");
                    break;
                case 15:
                    world.showTextPopup("Don't go towards the light if you're not ready for it.");
                    break;
                case 16:
                    world.showTextPopup("This is Chillene's bed.");
                    break;
                case 17:
                    world.showTextPopup("This is Chili's bed.");
                    break;
                case 18:
                    world.showTextPopup("There's a high probability that this table came from somewhere that sells tables.");
                    break;
            }
        }
    },
    name: "chili_house",
    doors: ["main_attraction_door"]
});
