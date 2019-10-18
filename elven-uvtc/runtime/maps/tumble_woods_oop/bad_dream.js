addMap({
    WorldState: function(world) {
        const createTable = () => {
            world.setForegroundTile(2053,8,6);
            world.setForegroundTile(2054,9,6);
            world.setCollisionTile(8,8,6);
            world.setCollisionTile(8,9,6);
        }
        const createBurr = () => {
            world.setForegroundTile(519,10,7)
            world.setForegroundTile(583,10,8);
        }
        const createShiver = () => {
            world.setForegroundTile(520,7,7)
            world.setForegroundTile(584,7,8);
        }
        const removeBurr = () => {
            world.setForegroundTile(0,10,7)
            world.setForegroundTile(0,10,8);
        }
        const removeShiver = () => {
            world.setForegroundTile(0,7,7)
            world.setForegroundTile(0,7,8);
        }
        const enigma = world.getStaticCharacter("enigma");
        const quickDelay = delay => {
            return new Promise(resolve => setTimeout(resolve,delay));
        }

        let backgroundRemovalDone = false;
        const removeBackground = async () => {
            for(let y = 0;y<world.renderMap.rows;y++) {
                for(let x = 0;x<world.renderMap.columns;x++) {
                    world.setBackgroundTile(1217,x,y);
                    if(world.getLightingTile(x,y) !== 0) {
                        world.setLightingTile(0,x,y);
                    }
                    if(world.getForegroundTile(x,y) !== 0) {
                        world.setForegroundTile(0,x,y);
                    }
                    if(x !== 0 && x !== world.renderMap.finalColumn && y !== 0 && y !== world.renderMap.finalRow) {
                        world.setCollisionTile(0,x,y);
                    }
                    await quickDelay(25);
                }
            }
            backgroundRemovalDone = true;
        }
        this.worldClicked = async ID => {
            if(ID === 8) {
                await enigma.say("The journey is long.");
                await delay(500);
                world.disableTileRendering();
                await delay(500);
                await enigma.say("The road is longer.");
                await delay(1000);
                world.updateMap("bedroom_1_oop");
            }
        }
        this.load = world => {
            world.autoCameraOff();
            world.camera.x = 8;
            world.camera.y = 7;
            world.camera.xOffset = 0.5;
            world.addPlayer(8,10,"up");
            world.playerObject.xOffset = 0.5;
            this.start = async () => {
                await delay(1000);
                await enigma.say("Did you really think you could forget?");
                await delay(1000);
                await enigma.say("Did you really think you could forget?");
                await delay(1000);
                await enigma.say("Did you?");
                await delay(1000);
                await enigma.say("Did you?");
                await delay(2000);
                await enigma.say("You did.");
                await delay(1000);
                playSound("magic");
                createShiver();
                await delay(1000);
                playSound("magic");
                createBurr();
                await delay(2000);
                removeBackground();
                await enigma.say("You're too late, anyway.");
                while(!backgroundRemovalDone) {
                    await world.delay(0);
                };
                await enigma.say("Try to remember.");
                await delay(1000);
                playSound("magic");
                createTable();
                world.unlockPlayerMovement();
            }
        }
    },
    name: "bad_dream"
});
