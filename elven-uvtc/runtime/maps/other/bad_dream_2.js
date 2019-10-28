const LIGHT_SNAP_RANGE = 0.05;
addMap({
    WorldState: function(world) {
        let light;
        let player;

        const moveLight = async (...parameters) => {
            world.lockPlayerMovement();
            await light.move(...parameters);
            world.unlockPlayerMovement();
            let proceed = false;
            while(!proceed) {
                const playerX = player.x + player.xOffset;
                const playerY = player.y + player.yOffset;

                const lightX = light.x + light.xOffset;
                const lightY = light.y + light.yOffset;

                if(Math.abs(playerX - lightX) < LIGHT_SNAP_RANGE && Math.abs(playerY - lightY) < LIGHT_SNAP_RANGE) {
                    player.x = light.x;
                    player.y = light.y;
                    player.xOffset = 0;
                    player.yOffset = 0;
                    proceed = true;
                } else {
                    await world.delay(0);
                }
            }
            world.lockPlayerMovement();
            await delay(300);
        }

        this.load = world => {
            world.addCustomRenderer(world.filmGrainEffect);
            world.addPlayer(1,14,"up",false,"player-dark");
            world.playerObject.offscreenRendering = true;
            world.playerObject.forcedStartPosition = true;
            world.playerObject.tilesPerSecond = 1;
            world.playerObject.animationFrameTime *= 2;

            player = world.playerObject;

            light = world.getLightSprite(8);
            light.offscreenRendering = true;

            world.addObject(light,1,14);

            world.fadeFromBlack(10000);

            this.start = async () => {
                await delay(5000);
                await light.say("Child..");
                await delay(2000);
                await light.say("You must always follow the light, child.");
                await moveLight({y:-3});
                await light.say("Yes.. that's it.");
                await moveLight({x:3});
                await light.say("Yes.. It's been a long time.");
                await moveLight({y:-2});
                await light.say("What do you remember?");
                await moveLight({y:-3});
                await light.say("I remember you.");
                await moveLight({x:-3});
                await light.say("Do you remember, child?");
                await moveLight({y:-2});
                await light.say("Do you remember what you were taught?");
                await moveLight({y:-3});
                await light.say("Perhaps.. You already forgot.");
                await moveLight({x:3});
                await light.say("But try to remember, child.");
                await moveLight({x:3});
                await light.say("Remember purpose, remember reason..");
                await moveLight({y:3});
                await light.say("Just.. remember.");
                await moveLight({y:2});
                await moveLight({x:5});
                world.fadeToBlack(10000);
                await light.say("All great things require great sacrifices.");
                await delay(1000);
                world.updateMap("stair_test");
            }
        }
    },
    fxBackground: function(){
        this.render = () => {
            context.fillStyle = "black";
            context.fillRect(0,0,fullWidth,fullHeight)
        }
    },
    usesLightSprites: true,
    renderScale: 1.5,
    name: "bad_dream_2"
});
