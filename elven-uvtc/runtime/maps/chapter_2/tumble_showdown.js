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
                world.changeForegroundTile(866,location.x,location.y);
                if(location.verticalShadow) {
                    world.changeForegroundTileFilter(802,location.x,location.y-1);
                    world.changeForegroundTileFilter(930,location.x,location.y+1);
                } else {
                    world.changeForegroundTileFilter(865,location.x-1,location.y);
                    world.changeForegroundTileFilter(867,location.x+1,location.y);
                }
                await delay(90);
            }
        }

        const createWizardBorderFast = () => {
            wizardBorderLocations.forEach(location => {
                world.changeForegroundTile(866,location.x,location.y);
                if(location.verticalShadow) {
                    world.changeForegroundTileFilter(802,location.x,location.y-1);
                    world.changeForegroundTileFilter(930,location.x,location.y+1);
                } else {
                    world.changeForegroundTileFilter(865,location.x-1,location.y);
                    world.changeForegroundTileFilter(867,location.x+1,location.y);
                }
            });
        }
        
        let wimpyRed;
        let wimpyGreen;
        let wizard;
        this.load = () => {
            wimpyRed = world.getCharacter("wimpy-red-elf","left");
            wimpyGreen = world.getCharacter("wimpy-green-elf","left");
            wizard = world.getCharacter("wizard-elf","down");

            world.addObject(wizard,26,11);
            world.addObject(wimpyRed,28,16);
            world.addObject(wimpyGreen,29,16);

            world.addPlayer(22,14,"down");
            world.playerObject.forcedStartPosition = true;

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

            this.triggerActivated = ID => {
                switch(ID) {
                    case 1:
                        if(!world.globalState.borderCreated) {
                            createBorderScript();
                        }
                        break;
    
                }
            }

            this.doorClicked = async () => {
                if(world.globalState.borderCreated) {
                    await world.showTextPopup("The door is being locked by Wizard Elf's magic!");
                } else {
                    await world.showTextPopup("The people inside are relying on you!");
                }
            }
           
        }
    },
    useCameraPadding: true,
    name: "tumble_showdown",
    doors: ["the_only_home_i_know"]
});
