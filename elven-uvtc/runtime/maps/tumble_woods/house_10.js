addMap({
    WorldState: function(world,data) {
        const presentMaxCount = worldMaps.tumble_woods.presentTracker.maxCount;
        const hasAllPresents = () => {
            return worldMaps.tumble_woods.presentTracker.hasAllPresents(world);
        };
        const getPresentCount = () => {
            return worldMaps.tumble_woods.presentTracker.getPresentCount(world);
        }
        this.load = world => {
            world.addPlayer(5,2,"down");
            const chili = world.getCharacter("chili");
            const chiliWife = world.getCharacter("chili-wife");
            world.addObject(chili,7,2,"down");
            world.addObject(chiliWife,5,5,"up");
            if(!world.globalState.chiliIntro) {
                this.start = async () => {
                    await delay(300);
                    await chiliWife.alert();
                    await chiliWife.say("Why hello! You must be, uh, that new guy!");
                    await chili.say("Darling! I'm sure 'the new guy' has a name.");
                    await chiliWife.say("Hey! Chill!");
                    await chili.say("Are you flirting with me or making a pun?");
                    await world.showInstantTextPopup("...");
                    await chili.alert();
                    await chili.say("Excuse us! Where are our manners.");
                    await delay(300);
                    await chili.updateDirection("left");
                    world.autoCameraOff();
                    world.followObject = chili;
                    await chili.say("Hi. I'm Chili!");
                    world.followObject = chiliWife;
                    await chiliWife.say(`Hello. I'm Chillene!`);
                    world.followObject = chili;
                    await chili.say("And together we-");
                    await delay(200);
                    chili.updateDirection("down");
                    await delay(200);
                    world.followObject = chiliWife;
                    await chiliWife.say("-are the Chilis!");
                    world.followObject = null;
                    world.autoCameraOn();
                    await delay(800);
                    await chili.say("Look at him darling. He's overwhelemed!");
                    await chiliWife.say("Okay perhaps our intro was a bit much.");
                    await chiliWife.say("We're kind of the socialites of Tumble Town.");
                    await chili.say("Well, the sexy socialites.");
                    await chiliWife.say("Hehehehe that's right, babe.");
                    await world.showInstantTextPopup("...");
                    await world.showInstantTextPopup("As the narrator, I am going to puke.");
                    await chili.say("We actually need a big favor from you.");
                    await chiliWife.say("Want me to explain?");
                    await chili.say("Sure babe.");
                    world.autoCameraOff();

                    world.followObject = chiliWife;
                    await chiliWife.say("So we're throwing this big Christmas Party for the town soon.");
                    await chiliWife.say("Most of the town is getting ready, as I'm sure you know, but there's one problem.");
                    world.followObject = chili;
                    await chili.say("Oh no! A problem?");
                    world.followObject = chiliWife;
                    await chiliWife.say("Yes dear... You already know this.");
                    await chiliWife.say("We need someone to bring the red presents from around town to us so we can finish setting up the party.");
                    await chiliWife.say("Do you think you could get them for us? It would mean a lot to us.");
                    if(hasAllPresents) {
                        await chiliWife.say("Oh my. You already got them all? You're a huge life saver!");
                        await chiliWife.say("Wait, you weren't stealing them were you?");
                        await world.showPrompt("are you a thief?","uhhhh","of course not!");
                        await delay(800);
                        await chiliWife.say("Well, either way, you're a real life saver! Come over here and I'll take them off your hands.");
                    } else {
                        const result = await chiliWife.showPrompt("will you get the red presents?","sure","i am busy","get a room you two");
                        await delay(800);
                        switch(result) {
                            case 1:
                                await chiliWife.say("That's fantastic! You're gonna be a great friend, I just know it!");
                                await chiliWife.say("After you've collected all the presents, come talk to me or Chili and we'll take them off your hands.");
                                break;
                            case 2:
                                await chiliWife.say("Hmm. Excuses excuses. I'm sure you'll come around.");
                                await chiliWife.say("When you do, come talk to me or Chili and we will track your progress.");
                                break;
                            case 3:
                                await chiliWife.say("Uh we did. Need I remind you that you came into our house, which consists of exactly one room?");
                                await chiliWife.say("Well, when you get the presents, come talk to me our Chili and we will track your progress.");
                                break;
    
                        }
                        await chiliWife.say("There are " + presentMaxCount + " presents in total.");
                    }
                    world.followObject = null;
                    world.autoCameraOn();
                    world.unlockPlayerMovement();
                    world.globalState.chiliIntro = true;
                }
            }
            const interacted = async (target,direction) => {
                if(world.globalState.gotAllPresents) {
                    if(world.globalState.sentSealedLetter) {
                        target.say("Wow! You sent that sealed letter? Thanks a ton. I hope our special guests arrive on time for the party!");
                    } else {
                        target.say("Be sure to get that letter to the post office as soon as possible!");
                    }
                } else {
                    if(hasAllPresents()) {
                        world.globalState.gotAllPresents = true;
                        world.lockPlayerMovement();
                        await target.say("Woohoo! You got all the red presents. You are an absolute life saver!");
                        await target.say("Now we just need you to do one more thing from us!");
                        await world.showInstantTextPopup("You received a sealed letter.");
                        world.globalState.hasSealedLetter = true;
                        await target.say("We just need you to bring this to the post office for us. It's an invitation to some very special guests.");
                        world.unlockPlayerMovement();
                    } else {
                        const morePresentsNeeded = presentMaxCount - getPresentCount();
                        if(morePresentsNeeded === 1) {
                            target.updateDirection(direction);
                            target.say("Looks like you only need to find one more red present! You're almost there!");
                        } else if(morePresentsNeeded === presentMaxCount) {
                            target.say("Still haven't got any red presents? Be sure to check in every house!");
                        } else {
                            target.say(morePresentsNeeded + " more red presents to go!");
                        }
                    }
                }
            }
            chili.interacted = (x,y,direction) => interacted(chili,direction);
            chiliWife.interacted = (x,y,direction) => interacted(chiliWife,direction);
        }
        this.doorClicked = doorID => {
            if(doorID === "to_tumble_woods") {
                const newMapData = {
                    fromDoorWay: true,
                };
                world.updateMap("tumble_woods",newMapData);
            }
        }
        this.otherClicked = type => {
            switch(type) {
                case 8:
                    world.showTextPopup("The small glass table. A staple in any modern interior design.");
                    break;
                case 9:
                    world.showTextPopup("Longgggg, longgg, tableee.");
                    break;
                case 10:
                    world.showTextPopup("Why don't Christmas trees have stars on their anymore?");
                    break;
                case 11:
                    world.showTextPopup("The Chilis are probably wondering why you're jamming your face into their lamp.");
                    break;
                case 12:
                    world.showTextPopup("What is your obsession with touching everyone's furniture?");
                    break;
                case 13:
                case 14:
                    world.showTextPopup("It's not only rude to put your grimey hands all over everyone's beds, but it's weird, too.");
                    break;
                case 16:
                    world.showInstantTextPopup("You can't take this present, it belongs to the Chilis!");
                    break;
            }
        }
    },
    name: "house_10",
    doors: [
        "to_tumble_woods",
        "door_2",
        "door_3",
        "door_4"
    ]
});
