addMap({
    WorldState: function(world,data) {
        const clearPresent = () => {
            const x = 9;
            const y = 4;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
        }
        let boxy;
        this.load = world => {
            if(world.globalState.unlockedReturnToSender) {
                clearPresent();
            }
            world.addPlayer(5,7,"up");
            boxy = world.getStaticCharacter("boxy");
        }
        this.worldClicked = async type => {
            switch(type) {
                case 17:
                    world.updateMap("tumble_woods",{fromDoorWay:true});
                    break;
                case 8:
                    world.showPopup("Overpriced office supplies, everyone's favorite!");
                    break;
                case 9:
                    world.showPopup("Paper, paper, paper, oh, and, more paper.");
                    break;
                case 10:
                    world.showPopup("Red paper used to be sold here, but it looks like it sold out for the holidays.");
                    break;
                case 11:
                    world.showPopup("Hey this is interesting. There's paper and stamps on this shelf! Amazing!");
                    break;
                case 12:
                    world.showPopup("You can't sit now, you have important things to do!");
                    break;
                case 13:
                    world.showPopup("This chair looks too big for you.");
                    break;
                case 16:
                    await world.showInstantPopup("Ooh. A present just for you? I wonder what's inside!");
                    clearPresent();
                    world.globalState.unlockedReturnToSender = true;
                    world.unlockMove("Return to Sender");
                    break;
                case 14:
                    if(world.globalState.sentSealedLetter) {
                        await boxy.say("I assure you, your mail has probably already reached its destination.");
                    } else {
                        if(world.globalState.hasSealedLetter) {
                            await boxy.say("m-mail? Someone finally brought mail?");
                            await boxy.say("BLESS YOU. SOMETHING TO DO.");
                            await world.showInstantPopup("You handed the Sealed Mail to Boxy");
                            await boxy.say("Wow. Super-mega-ultimate-express shipping. Don't see too many of those. Important message?");
                            await boxy.say("I'll get this sent out right away. Happy holidays!");
                            world.globalState.sentSealedLetter = true;
                            await world.showInstantPopup("A phone is heard ringing.");
                            await boxy.say("Hey wait, don't go yet.");
                            await world.showInstantPopup("Boxy is talking on the phone and making mhm noises.");
                            await boxy.say("Ahh, okay. I'll relay your message. Take care, Jim.");
                            await world.showInstantPopup("The phone clicks off.");
                            await boxy.say("Jim says he needs you at home right away and that there's an emergency!");
                            await boxy.say("I never thought I'd need to use it but now is as good as time as any.");
                            await boxy.say("TIME FOR THE ULTIMATE INSTANT TELEPORTER-A-TRON.");
                            await boxy.say("Okay... It's not nearly as exciting as it sounds.");
                            await world.showInstantPopup("Boxy pulls out a strange looking device that doesn't look like it belongs in a post office.");
                            await boxy.say("Thanks again for using your local Tumble Town post office as your trusted mail carrier!");
                            await world.showInstantPopup("Boxy slams the button on the INSTANT TELEPORTER-A-TRON.");
                            playSound("energy");
                            world.updateMap("house_1_end");
                        } else {
                            await boxy.say("hello... slow day...");
                            await boxy.say("doesn't look like you have any mail...");
                            await boxy.say("mehhhhhhh.");
                            await boxy.say("come back another time.");
                        }
                    }
                    break;
            }
        }

        this.triggerImpulse = (triggerID,direction) => {
            if(triggerID === 1 && direction === "down") {
                world.updateMap("tumble_woods",{fromDoorWay:true});
                return TRIGGER_ACTIVATED;
            }
        }
    },
    name: "mail",
    fixedCamera: true,
    cameraStart: {
        x: 5,
        y: 4
    }
});
