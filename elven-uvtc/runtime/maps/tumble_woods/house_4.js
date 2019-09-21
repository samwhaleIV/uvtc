addMap({
    WorldState: function(world,data) {
        const clearP3 = () => {
            const x = 15;
            const y = 4;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
        };
        const statusMessage = () => worldMaps.tumble_woods.presentTracker.getRemainingMessage(world);
        this.load = world => {
            if(world.globalState.present3) {
                clearP3();
            }
            world.addPlayer(4,3,"down");
            const jam = world.getCharacter("jam","down");
            world.addObject(jam,8,5,"down");
            jam.interacted = async (x,y,direction) => {
                world.lockPlayerMovement();
                await jam.alert();
                jam.updateDirection(direction);
                if(world.globalState.metJam) {
                    await jam.say("Hey, next time you see Jim be sure to give him a piece of my mind for me.");
                } else {
                    await jam.say("Hey! You're Jim's new roommate!");
                    await jam.say("I've heard such great things about you.");
                    await jam.say("W-what? He didn't even mention me?");
                    await delay(500);
                    await world.showInstantPopup("Yikes. This is awkward.");
                    await delay(300);
                    await jam.say("I... Need a moment.");
                    await delay(300);
                    jam.updateDirection(invertDirection(direction));
                    await delay(700);
                    await jam.say("AHHHHHHHHHHHHHHHHHHHH");
                    await delay(500);
                    jam.updateDirection("down");
                    await delay(500);
                    jam.updateDirection("left");
                    await delay(500);
                    await jam.say("Alright. I'm better now. Welcome to Tumble Town.");
                    world.globalState.metJam = true;
                    await delay(100);
                    jam.updateDirection("down");
                }
                world.unlockPlayerMovement();
            }
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopups([
                        "There's a notecard taped to this shelf.",
                        "'Adults only'",
                        "Hmm... this might be interesting.",
                    ]);
                    const selection = await world.showPrompt("do you want to read an adult book?","yes","no");
                    if(selection === 0) {
                        world.showPopup("Ew. There's more important things you should be doing than reading someone else's smut.");
                    } else {
                        world.showPopup("Ah, I see. Saving yourself for marriage.");
                    }
                    break;
                case 9:
                    world.showPopup("The books appear to have slipped into another dimension.");
                    break;
                case 10:
                    world.showPopup("This table is long, yet, you can't help but feel disappointed by it.");
                    break;
                case 11:
                    world.showPopup("What kind of a heathen has their dryer on the left?");
                    break;
                case 17:
                    world.showPopup("The washer being on the right is making you very uncomfortable.");
                    break;
                case 12:
                    world.showPopup("A lot of people must sleep here.");
                    break;
                case 13:
                    world.showPopup("This sleeping bag doesn't want to be bothered.");
                    break;
                case 14:
                    world.showPopup("This sleeping bag is upset with the other sleeping bags.");
                    break;
                case 15:
                    world.showPopup("Who would want to sleep this close to other people?");
                    break;
                case 16:
                    clearP3();
                    world.globalState.present3 = true;
                    await world.showInstantPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_4",
    doors: [
        "to_tumble_woods"
    ]
});
