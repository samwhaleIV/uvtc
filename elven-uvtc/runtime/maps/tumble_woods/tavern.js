addMap({
    WorldState: function(world,data) {
        let mascara;
        let shiver;
        let burr;
        this.load = world => {
            world.addPlayer(10,3,"down");
            mascara = world.getStaticCharacter("mascara");
            shiver = world.getStaticCharacter("shiver");
            burr = world.getStaticCharacter("burr");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.worldClicked = async type => {
            switch(type) {
                case 16:
                    //shiver interacted
                    const moveUnlockSegment = async () => {
                        world.globalState.shiverGaveGift = true;
                        world.globalState.shiverWantsToGiveAGift = false;
                        await shiver.say("You've helped us poor helpless ice cream cones get our booze fix, so consider this a token of our gratitude.");
                        await world.unlockMove("Iced Whiskey");
                    }

                    if(world.globalState.burrGotBeer && world.globalState.shiverGotBeer) {
                        if(world.globalState.shiverWantsToGiveAGift) {
                            moveUnlockSegment();
                            return;
                        } else {
                            shiver.say("Thanks again, bro. Now leave us to drink these beers in peace.");
                            return;
                        }
                    } else if(world.globalState.gotBeer) {
                        if(world.globalState.shiverGotBeer) {
                            shiver.say("Hey, you already gave me a beer. Burr is waiting his still.");
                            return;
                        }
                        world.globalState.shiverGotBeer = true;
                        world.globalState.gotBeer = false;
                        await world.showInstantTextPopupSound("You gave your beer to Shiver.");
                        await shiver.say("Aweee yeah! What a boss!");
                        if(world.globalState.burrGotBeer && world.globalState.shiverGotBeer) {
                            moveUnlockSegment();
                        }
                    } else {
                        if(world.globalState.burrGotBeer) {
                            shiver.say("Why did you give Burr a beer first? Go get another one!");
                        } else {
                            shiver.say("Hey, did you hear that conversation? Wanna be a pal? Go get us some beers.");
                        }
                    }
                    break;
                case 17:
                    //burr interacted
                    if(world.globalState.burrGotBeer && world.globalState.shiverGotBeer) {
                        burr.say("Thank you so much for being a pal and getting us these beers! We are in your debt forever.");
                        return;
                    }
                    if(world.globalState.gotBeer) {
                        if(world.globalState.burrGotBeer) {
                            burr.say("I am so lucky that you gave me a beer first, but don't forget Shiver!");
                            return;
                        }
                        world.globalState.burrGotBeer = true;
                        world.globalState.gotBeer = false;
                        await world.showInstantTextPopupSound("You gave your beer to Burr.");
                        await burr.say("Hey! Thanks a lot dude.");
                        if(world.globalState.burrGotBeer && world.globalState.shiverGotBeer) {
                            world.globalState.shiverWantsToGiveAGift = true;
                            shiver.say("You're awesome! You got us beers out of the goodness of your heart! Come over here, I've got something for your troubles.");
                        }
                    } else {
                        if(world.globalState.shiverGotBeer) {
                            burr.say("You gave Shiver a beer but what about meeee? Go get another one!");
                        } else {
                            burr.say("I would really appreciate you going and getting us some beers. I don't have much to give you but I will spread good word about you.");
                        }
                    }
                    break;
                case 8:
                    //mascara interacted
                    await mascara.say("Hello, how can I help you?");
                    const reason = await world.showPrompt("what are you here for?","relief","friendship","my wife left me","all of the above");
                    world.lockPlayerMovement();
                    await delay(1000);
                    world.unlockPlayerMovement();
                    switch(reason) {
                        case 0:
                            await mascara.say("Ahh. Alchohol. Now THAT I can help you with.");
                            const manner = await world.showPrompt("pick your poison","cold beer","shaken not stirred","anthrax");
                            world.lockPlayerMovement();
                            await delay(1000);
                            world.unlockPlayerMovement();
                            switch(manner) {
                                case 0:
                                    if(world.globalState.gotBeer) {
                                        await mascara.say("You still have the other beer I gave you. How about drinking that one first?");
                                        break;
                                    } else if(world.globalState.chairDrankBeer) {
                                        if(world.globalState.chairDrankBeerKnown) {
                                            await mascara.speech([
                                                "Do you have a drinking problem too? This is going on your tab."
                                            ]);
                                            await world.showInstantTextPopupSound("You received a beer!");
                                            world.globalState.gotBeer = true;
                                        } else {
                                            world.globalState.chairDrankBeerKnown = true;
                                            await mascara.speech([
                                                "What happened to the other beer I gave you?",
                                                "...",
                                                "I swear to god...",
                                                "...",
                                                "You gave it to the chair, didn't you?",
                                                "Just take another one. It's going on your tab."
                                            ]);
                                            await world.showInstantTextPopupSound("You received a beer!");
                                            world.globalState.gotBeer = true;
                                        }

                                    } else if(world.globalState.chairAskedForABeer) {
                                        await mascara.say("Alright, coming right up. I have to ask though.. This isn't for a chair, right?");
                                        const forAChair = await world.showPrompt("is this beer for a chair","no","yes","none of your business");
                                        world.lockPlayerMovement();
                                        await delay(1000);
                                        world.unlockPlayerMovement();
                                        switch(forAChair) {
                                            case 0:
                                                await mascara.say("Okay! Great. Uh, don't ask. There has just been some... 'events' in the past and I have to make sure the chairs stay sober.");
                                                await world.showInstantTextPopupSound("You received a beer!");
                                                world.globalState.gotBeer = true;
                                                break;
                                            case 1:
                                                await mascara.speech([
                                                    "No! No no no a million times NO!",
                                                    "AHHHHHHHHHHHHHHHHH!",
                                                    "You're not allowed to give the chairs beer. EVER. No exceptions."
                                                ]);
                                                break;
                                            case 2:
                                                await mascara.speech([
                                                    "Fine, you're right. It's none of my business what you do with your alchohol after you leave this counter!",
                                                    "I'm totally sure you'll be responsible and not give it to any chairs."
                                                ]);
                                                await world.showInstantTextPopupSound("You received a beer!");
                                                world.globalState.gotBeer = true;
                                                break;
                                        }
                                    } else {
                                        if(world.globalState.friendsWithMascara) {
                                            await mascara.say("Okay, since we're friends, this is on the house!")
                                        } else {
                                            await mascara.say("Alright, I'll put this on your tab.");
                                        }
                                        await world.showInstantTextPopupSound("You received a beer!");
                                        world.globalState.gotBeer = true;
                                    }
                                    break;
                                case 1:
                                    await mascara.say("I would love to do that for you but I don't have hands. Or arms. Or shakers.");
                                    break;
                                case 2:
                                    await mascara.say("Uhhh. That's not the right kind of poison.");
                                    break;
                            }
                            break;
                        case 1:
                            if(world.globalState.friendsWithMascara) {
                                await mascara.say("Are you feeling insecure? I thought we already established our friendship.");
                                await world.someoneIsNowYourFriend(mascara,"Congratulations! {NAME} is still your friend!");
                            } else {
                                world.globalState.friendsWithMascara = true;
                                await mascara.say("Friends? I barely just met you. Well whatever. You only live once, right?");
                                await world.someoneIsNowYourFriend(mascara);
                                await mascara.say("You seem cool, so, all booze is on the house!");
                            }
                            break;
                        case 2:
                            await mascara.say("Ah. Jeez. Sorry, but our policy doesn't cover that. I am an ice cream cone.");
                            break;
                        case 3:
                            await mascara.speech([
                                "Look, I'd love to help you with all your problems but I am a bartender, not a miracle worker.",
                                "The most I can do for you is get you a beer."
                            ]);
                            break;
                    }
                    break;
                case 10:
                    if(world.globalState.chairDrankBeer && world.globalState.gotBeer) {
                        world.globalState.gotBeer = false;
                        await world.showTextPopup("You brought me MOREEEEEE????");
                        await world.showInstantTextPopup("You really should not give this chair beer.");
                        await world.showTextPopup("SHUT IT NARRATOR. FEEED MEEEEE.");
                        await world.showInstantTextPopup("The chair stole the beer from you and drank it all in one sip.");
                        await world.showTextPopup("ReEeeEEeEEEeeEeeEEeEEEee");
                    } else if(world.globalState.gotBeer) {
                        world.globalState.chairDrankBeer = true;
                        world.globalState.gotBeer = false;
                        await world.showTextPopup("HAHAHAHA. YOU IDIOT.");
                        await world.showInstantTextPopup("The chair stole the beer from you and drank it all in one sip.");
                        await world.showTextPopups([
                            "reeeeeEEEEEEEEEEEEE",
                            "REEEEEEEEEEEEEEEEEEEEEEE"
                        ]);
                        await world.showInstantTextPopup("... Clearly you've made a terrible mistake.");
                    } else {
                        world.globalState.chairAskedForABeer = true;
                        world.globalState.gotBeer = false;
                        await world.showTextPopup("Hey. If you bring me back a beer, I'll let you in on a secret.");
                    }
                    break;
                case 11:
                    world.showTextPopups([
                        "Rule number 1 of talking to chairs- Uh, wait. How are you talking to me? I'm a chair!",
                        "GET AWAY FROM ME, WITCH!"
                    ]);
                    break;
                case 14:
                    world.showTextPopups([
                        "When people come here they never sit at these tables. I blame the chairs. They're just so...",
                        "Frigid. Hehe.",
                        "...",
                        "Okaaay, fine. Maaaybe it's my puns."
                    ]);
                    break;
                case 12:
                    world.showTextPopups([
                        "Hey. You should sit on me. I won't bite. I promise.",
                        "What? You don't believe me because I said that in the first place?",
                        "And I'm not making it better for myself?",
                        "... alright. You should go, now."
                    ]);
                    break;
                case 13:
                    world.showTextPopup("Look out for my brother. He gets nervous around new people.");
                    break;
                case 15:
                    world.showTextPopup("Hands off please. I just got washed.");
                    break;
                case 18:
                    world.showTextPopup("That chair around the corner has a huge booze problem. It was quite the scene last time.")
                    break;
                case 9:
                    world.showTextPopup("It gets lonely over here next to the endless void.");
                    break;
            }
        }

        this.triggerActivated = async triggerID => {
            switch(triggerID) {
                case 1:
                    if(world.globalState.tavernEnterTrigger) {
                        return;
                    }
                    await shiver.say(
                        "Man, it would be real convenient if someone came in here right now that could go get us more beers."
                    );
                    await burr.say(
                        "You're so right dude. I would kill for another beer right now."
                    );
                    await shiver.say(
                        "Yeah, but it's just a pipe dream. The odds of someone walking in here right now and hearing this exact conversation are so low."
                    );
                    world.globalState.tavernEnterTrigger = true;
                    break;
            }
        }
    },
    name: "tavern",
    doors: [
        "to_tumble_woods"
    ]
});
