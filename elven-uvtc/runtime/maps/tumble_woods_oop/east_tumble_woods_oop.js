import { RockMoveStartSound, RockMoveEndSound, IceSmashSound, AlertSound } from "../../tones.js";

addMap({
    WorldState: function(world,data) {

        let iceSpy;

        let rockTileIndex = 0;

        const rockTiles = [
            1940,1941,2005
        ];

        const elfRockTile = 1942;

        const rockLocations = [
            [7,21],[8,20],[7,23],[9,22],[11,21],
            [11,23],[13,22],

            [4,61],[2,63],[5,64],[7,62,true],[10,64],
            [12,63],[15,64]
        ];

        const brokenIceTile = 2002;
        const noodleIceTile = 2003;
        const noodleIceTileAbove = 1939;

        const noodleIceTileLeft = 2131;
        const noodleIceTileAboveLeft = 2067;

        const iceHoleTile = 1938;

        const iceHoleCollisionType = 20;
        const noodleReadyCollisionType = 21;
        const hasNoodleCollisionType = 22;
        const elfInIceCollisionType = 23;

        const regularIceTile = 85;

        const iceElfSpyTile = 2130;
        const iceElfSpyTileTop = 2066;

        const getRockSprite = location => {
            const rock = world.getTileSprite(location[2] ? elfRockTile : rockTiles[rockTileIndex++%rockTiles.length]);
            rock.tilesPerSecond = 1.5;
            world.addObject(rock,location[0],location[1]);
            return rock;
        }

        const moveRock = async (rock,xDelta,yDelta) => {
            if(xDelta) {
                await rock.move({x:xDelta});
            } else if(yDelta) {
                await rock.move({y:yDelta});
            }
        }

        const rockInteraction = async (rock,direction) => {
            world.lockPlayerMovement();
            let xDelta = 0, yDelta = 0;
            switch(direction) {
                case "up":
                    yDelta++;
                    break;
                case "down":
                    yDelta--;
                    break;
                case "left":
                    xDelta++;
                    break;
                case "right":
                    xDelta--;
                    break;
            }

            let hitX = rock.x+xDelta;
            let hitY = rock.y+yDelta;
            const collisionState = world.getCollisionState(hitX,hitY,false);
            if(collisionState.map === iceHoleCollisionType) {
                RockMoveStartSound();
                await moveRock(rock,xDelta,yDelta);
                const isElfRock = rock.tileID === elfRockTile;
                world.changeBackgroundTile(brokenIceTile,hitX,hitY);
                if(isElfRock) {
                    await delay(500);
                    IceSmashSound();
                    world.removeObject(rock.ID);
                    await delay(1000);
                    world.changeBackgroundTile(iceElfSpyTile,hitX,hitY);
                    world.changeBackgroundTile(iceElfSpyTileTop,hitX,hitY-1);
                    world.setCollisionTile(elfInIceCollisionType,hitX,hitY);
                    AlertSound();
                    await delay(1000);
                    await iceSpy.say("Hey! You broke my rock! Just when I thought I had the perfect disguise..");
                    await iceSpy.say("I don't imagine you're gonna help me get of this hole, on account of the whole elf thing..");
                    await iceSpy.say("If you at least tell an Elf Guard that I'm stuck down here I'll try to make it worth your while.");
                } else {
                    world.setCollisionTile(noodleReadyCollisionType,hitX,hitY);
                    await delay(500);
                    IceSmashSound();
                    world.removeObject(rock.ID);
                }
            } else if(!collisionState.object && !collisionState.map) {
                RockMoveStartSound();
                await moveRock(rock,xDelta,yDelta);
                RockMoveEndSound();
            } else {
                await world.showInstantPopup("The rock cannot move this way.");
            }

            world.unlockPlayerMovement();
        }

        this.load = world => {
            iceSpy = world.getStaticCharacter("rock-elf-spy");
            const rocks = rockLocations.map(getRockSprite);
            rocks.forEach(rock => {
                rock.interacted = (x,y,direction) => {
                    rockInteraction(rock,direction);
                }
            });
            switch(data.sourceRoom) {
                default:
                case "tumble_woods_oop":
                    world.addPlayer(0,43,"right");
                    break;
                case "east_tumble_woods_oop_grotto":
                    world.addPlayer(41,61,"left");
                    world.playerObject.yOffset = 0.5;
                    break;
            }
        }

        this.worldClicked = async (ID,x,y,direction) => {
            switch(ID) {
                case 8:
                    await world.showPopup("These elves.. It feels like they're always watching.");
                    break;
                case elfInIceCollisionType:
                    //todo globalState stuff
                    await iceSpy.say("Were you able to tell an Elf Guard about my situation yet? It's getting quite cold down here.");
                    break;
                case iceHoleCollisionType:
                    await world.showPopup("The ice appears thinner here.");
                    break;
                case noodleReadyCollisionType:
                    const hasNoodle = world.globalState.hasPoolNoodle;
                    const hasWaterBottle = true; //todo implement water bottle handling
                    if(hasNoodle) {
                        if(!hasWaterBottle) {
                            await world.showPopup("You may be able to collect the water with your pool noodle, but you'll have nowhere to put it.");
                            break;
                        }
                        world.lockPlayerMovement();
                        await world.showPopup("You may be able to use your pool noodle to collect some water, do you want to try?");
                        const wantsToTry = await world.showPrompt("try to get some water?","yes","no") === 0;
                        await delay(600);
                        if(wantsToTry) {
                            let t1 = noodleIceTile;
                            let t2 = noodleIceTileAbove;
                            if(direction === "right") {
                                t1 = noodleIceTileLeft;
                                t2 = noodleIceTileAboveLeft;
                            }
                            world.changeBackgroundTile(t1,x,y);
                            world.changeBackgroundTile(t2,x,y-1);
                            const shouldPass = Math.random() > 0.5;
                            await delay(1000);
                            playTone(100,0.5);
                            await delay(1000);
                            playTone(100,0.5);
                            await delay(1000);
                            playTone(100,0.5);
                            await delay(1000);
                            playTone(shouldPass ? 150 : 80,0.5);
                            await delay(1200);
                            if(shouldPass) {
                                await world.showPopup("Success! You filled one water bottle.");
                                //todo add one filled bottle from state and clear one empty bottle
                            } else {
                                await world.showPopup("Darn! The water was too shy. Try again later.");
                            }
                            world.changeBackgroundTile(brokenIceTile,x,y);
                            world.changeBackgroundTile(regularIceTile,x,y-1);
                        }
                        world.unlockPlayerMovement();
                    } else {
                        await world.showPopup("The water is too far to reach.");
                    }
                    break;
            }
        }

        this.triggerImpulse = (ID,direction) => {
            switch(ID) {
                case 1:
                    if(direction === "left") {
                        world.updateMap("tumble_woods_oop");
                        return TRIGGER_ACTIVATED;
                    }
                    break;
                case 2:
                    if(direction === "right") {
                        world.updateMap("east_tumble_woods_oop_grotto");
                        return TRIGGER_ACTIVATED;
                    }
                    break;
                case 3:
                    break;
            }
        }
    },
    useCameraPadding: true,
    name: "east_tumble_woods_oop"
});
