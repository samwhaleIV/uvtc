addMap({
    WorldState: function(world,data) {
        const wizardBorderLocations = (function(){
            const locations = [];
            for(let x = 25;x<32;x++) {
                locations.push({
                    x: x,
                    y: 13,
                    verticalShadow: true,
                });
            }
            for(let x = 21;x<32;x++) {
                locations.push({
                    x: x,
                    y: 19,
                    verticalShadow: true
                });
            }
            for(let y = 14;y<19;y++) {
                locations.push({
                    x: 32,
                    y: y,
                    verticalShadow: false
                });
            }
            return locations;
        })();

        const createWizardBorder = async () => {
            await delay(80);
            for(let i = 0;i<wizardBorderLocations.length;i++) {
                playSound("magic");
                const location = wizardBorderLocations[i];
                world.setForegroundTile(866,location.x,location.y);
                if(location.verticalShadow) {
                    world.setForegroundTileFilter(802,location.x,location.y-1);
                    world.setForegroundTileFilter(930,location.x,location.y+1);
                } else {
                    world.setForegroundTileFilter(865,location.x-1,location.y);
                    world.setForegroundTileFilter(867,location.x+1,location.y);
                }
                await delay(90);
            }
        }

        const createWizardBorderFast = () => {
            wizardBorderLocations.forEach(location => {
                world.setForegroundTile(866,location.x,location.y);
                if(location.verticalShadow) {
                    world.setForegroundTileFilter(802,location.x,location.y-1);
                    world.setForegroundTileFilter(930,location.x,location.y+1);
                } else {
                    world.setForegroundTileFilter(865,location.x-1,location.y);
                    world.setForegroundTileFilter(867,location.x+1,location.y);
                }
            });
        }
        const createWimpyRedBorder = () => {
            world.setCollisionTile(1,28,14);
            world.setCollisionTile(1,28,15);
            world.setCollisionTile(1,28,17);
            world.setCollisionTile(1,28,18);
        }
        const clearWimpyRedBorder = () => {
            world.setCollisionTile(0,28,14);
            world.setCollisionTile(0,28,15);
            world.setCollisionTile(0,28,17);
            world.setCollisionTile(0,28,18);
        }
        
        let wimpyRed;
        let wimpyGreen;
        let wizard;
        this.load = () => {
            wimpyRed = world.getCharacter("wimpy-red-elf","left");
            wimpyGreen = world.getCharacter("wimpy-green-elf","left");
            wizard = world.getCharacter("wizard-elf","down");

            wimpyRed.interacted = async (x,y,direction) => {
                wimpyRed.updateDirection(direction);
                if(!world.globalState.wimpyRedDefeated) {
                    await wimpyRed.say("It's too late to save your friends.");
                    await wimpyRed.say("You're going down.");
                    world.startBattle("wimpy-red-elf",()=>{
                        world.globalState.justWonToWimpyRed = true;
                    },()=>{
                        world.globalState.justLostToWimpyRed = true;
                    },world.renderMap.name);
                } else {
                    await wimpyRed.say("A non-elf abusing an elf... Typical.");
                }
            }
            wimpyGreen.interacted = async (x,y,direction) => {
                wimpyGreen.updateDirection(direction);
                if(!world.globalState.wimpyRedDefeated) {
                    await wimpyGreen.say("Wow. Not only are you elf hating scum, you also cheat at video games.");
                } else {
                    await wimpyGreen.say("I won't let you down, Wimpy Red.");
                    world.startBattle("wimpy-green-elf",()=>{
                        world.globalState.justWonToWimpyGreen = true;
                    },()=>{
                        world.globalState.justLostToWimpyGreen = true;
                    },world.renderMap.name);
                }
            }

            world.addObject(wizard,26,11);
            if(world.globalState.wimpyRedDefeated) {
                world.addObject(wimpyRed,28,18);
                wimpyRed.updateDirection("up");
                clearWimpyRedBorder();
            } else {
                world.addObject(wimpyRed,28,16);
                createWimpyRedBorder();
            }

            world.addObject(wimpyGreen,29,16);

            world.addPlayer(22,14,"down");

            if(world.globalState.justLostToWimpyGreen) {
                this.start = async () => {
                    await delay(800);
                    await wimpyGreen.say("I never let Wimpy Red down.");
                    await wimpyGreen.say("The future is ours.");
                    world.gameOver();
                }
                delete world.globalState.justLostToWimpyGreen;
            } else if(world.globalState.justWonToWimpyGreen) {
                this.start = async () => {
                    await delay(800);
                    await wimpyGreen.say("Uh. Wimpy Red? I seem to have lost.");
                    await delay(800);
                    world.autoCameraOff();
                    await world.moveCamera(...wimpyRed.location,400);
                    await delay(800);
                    await wimpyRed.say("Crap.");
                    await delay(600);
                    wimpyRed.updateDirection("down")
                    await delay(800);
                    await wimpyRed.say("Well.. no one ever established an entire tyrannical dictatorship over the entire world in just twenty minutes.");
                    await delay(200);
                    await world.moveCamera(...wimpyGreen.location,400);
                    await delay(200);
                    await wimpyGreen.say("Uh, yeah. I guess not.");
                    await delay(800);
                    await wimpyGreen.say("Anyways.. You haven't seen the last of us, and, we are still taking your friends.");
                    await delay(800);
                    await wimpyGreen.say("What? Don't look at me like that. You really thought some light sparring would make wizard elf take down this barrier?");
                    await wimpyGreen.say("You haven't seen the last of us. Changes are coming.. Spread the word.");
                    await delay(600);
                    await wimpyGreen.say("And in case you forget about your friends, here's another reminder.");
                    await world.unlockMove("Submission");
                    await delay(300);
                    await world.moveCamera(...wimpyRed.location,400);
                    await delay(1000);
                    wimpyRed.updateDirection("up");
                    await delay(1000);
                    await wimpyRed.say("The new world is coming.");
                    await delay(1000);
                    wimpyRed.updateDirection("down");
                    await delay(2000);
                    await wimpyRed.say("This is only the beginning.");
                    await delay(2000);
                    await world.fadeToBlack(4000);
                    await delay(1000);
                    await world.chapterComplete();
                }
                delete world.globalState.justWonToWimpyGreen;
            } else if(world.globalState.justLostToWimpyRed) {
                this.start = async () => {
                    await delay(800);
                    await wimpyRed.say("Just as I expected. A loser.");
                    world.gameOver();
                }
                delete world.globalState.justLostToWimpyRed;
            } else if(world.globalState.justWonToWimpyRed) {
                this.start = async () => {
                    await delay(800);
                    await wimpyRed.say("You may have bested me... but I still my have wingman.");
                    await delay(400);
                    wimpyRed.updateDirection("down");
                    await delay(400);
                    await wimpyRed.move({y:2});
                    await delay(400);
                    wimpyRed.updateDirection("up");
                    world.globalState.wimpyRedDefeated = true;
                    clearWimpyRedBorder();
                    world.unlockPlayerMovement();
                }
                delete world.globalState.justWonToWimpyRed;
            } else {
                world.playerObject.forcedStartPosition = true;
            }

            const createBorderScript = async () => {
                world.lockPlayerMovement();
                world.playerObject.walkingOverride = true;
                world.autoCameraOff();
                await delay(200);
                await world.moveCamera(28,16,0,0,600);
                await delay(200);
                await wimpyRed.say("Hm? And who might you be?");
                await wimpyRed.say("...");
                await wimpyRed.say("You're a quiet one, aren't you?");
                await wimpyRed.say("I don't trust quiet people. They ALWAYS try to trick you. No chances.");
                await delay(400);
                wimpyRed.updateDirection("up");
                await delay(400);
                await wimpyRed.say("Wizard Elf, now!");
                await delay(100);
                await createWizardBorder();
                await delay(300);
                wimpyRed.updateDirection("left");
                await delay(300);
                await wimpyRed.say("Ha! You're ours now, quiet punk!");
                await delay(200);
                await world.moveCamera(...world.playerObject.location,600);
                world.autoCameraOn();
                world.globalState.borderCreated = true;
                world.unlockPlayerMovement();
            }

            if(world.globalState.borderCreated) {
                createWizardBorderFast();
            }

            this.triggerImpulse = ID => {
                switch(ID) {
                    case 1:
                        if(!world.globalState.borderCreated) {
                            createBorderScript();
                        }
                        return TRIGGER_ACTIVATED;
                }
            }

            this.doorClicked = () => {
                world.updateMap("chili_house");
            }
           
        }
    },
    useCameraPadding: true,
    name: "tumble_showdown",
    doors: ["the_only_home_i_know"]
});
