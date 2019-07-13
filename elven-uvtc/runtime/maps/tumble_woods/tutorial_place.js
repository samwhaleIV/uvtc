addMap({
    WorldState: function(world,data) {
        let iceman;
        let burr;
        const informSlotting = async () => {
            const keyName = (Object.entries(keyBindings).filter(entry=>entry[1]===kc.cancel)[0]||[])[0]||"None";
            await world.showInstantTextPopup(`To slot your move press [${keyName}] to access the menu, click the "moves" button, then select a malice slot.`);
        }
        const tutorialSpeech = async () => {
            await iceman.sayID("AUTO_161");
            await world.showInstantTextPopup("Number 1: Moves");
            await iceman.speechID([
                "AUTO_162",
                "AUTO_163",
                "AUTO_164",
                "AUTO_165",
                "AUTO_166"
            ]);
            await world.showInstantTextPopup("Number 2: Winning");
            await iceman.speechID([
                "AUTO_167",
                "AUTO_168",
                "AUTO_169"
            ]);
            await world.showInstantTextPopup("Number 3: Your turn");
            await iceman.speechID([
                "AUTO_170",
                "AUTO_171",
                "AUTO_172",
                "AUTO_173"
            ]);
            await world.unlockMove("Wimpy Punch");
            await iceman.sayID("AUTO_174");
            await iceman.sayID("AUTO_175");
            await informSlotting();
            await iceman.sayID("AUTO_176");
            if(!world.globalState.icemanBattlePreamble) {
                await burr.sayID("AUTO_177");
                await iceman.sayID("AUTO_178");
                await burr.sayID("AUTO_179");
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
                    await tutorialSpeech();
                }
            }

            this.start = async () => {
                world.lockPlayerMovement();
                if(world.globalState.completedTutorialBattle) {
                    await delay(faderTime + 1000);
                    if(world.globalState.failedTutorialBattle) {
                        await iceman.sayID("AUTO_203");
                        await iceman.sayID("AUTO_204");
                    } else {
                        await iceman.sayID("AUTO_205");
                        await iceman.sayID("AUTO_206");
                    }
                    await iceman.sayID("AUTO_207");
                    await burr.sayID("AUTO_208");
                    await iceman.sayID("AUTO_209");
                    await burr.sayID("AUTO_210");
                    await iceman.sayID("AUTO_211");
                    await burr.sayID("AUTO_212");
                    await iceman.sayID("AUTO_213");
                    await iceman.sayID("AUTO_214");
                    await delay(500);
                    await iceman.sayID("AUTO_215");
                    world.updateMap("house_3");
                    world.unlockPlayerMovement();
                    return;
                }
                if(world.globalState.battleTutorialPreamble) {
                    world.unlockPlayerMovement();
                    return;
                }
                await iceman.sayID("AUTO_180");
                await burr.sayID("AUTO_181");
                await iceman.sayID("AUTO_182");
                await burr.sayID("AUTO_183");
                await iceman.sayID("AUTO_184");
                await iceman.sayID("AUTO_185");
                await iceman.sayID("AUTO_186");
                await tutorialSpeech();
                await iceman.sayID("AUTO_187");
                world.globalState.battleTutorialPreamble = true;
                world.unlockPlayerMovement();
            }
        }
        this.otherClicked = async type => {
            switch(type) {
                case 8:
                    world.lockPlayerMovement();
                    if(world.movesManager.hasSlotType("malice")) {
                        await iceman.sayID("AUTO_191");
                        await burr.sayID("AUTO_192");
                        await iceman.sayID("AUTO_193");
                        world.startBattle("tutorial-burr",()=>{
                            world.globalState.completedTutorialBattle = true;
                        },()=>{
                            world.globalState.completedTutorialBattle = true;
                            world.globalState.failedTutorialBattle = true;
                        });
                    } else {
                        await iceman.sayID("AUTO_188");
                        await informSlotting();
                    }
                    world.unlockPlayerMovement();
                    break;
            }
        }
    },
    name: "tutorial_place"
});
