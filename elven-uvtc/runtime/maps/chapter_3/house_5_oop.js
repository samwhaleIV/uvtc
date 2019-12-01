addMap({
    //Tree Lee House
    WorldState: function(world,data) {

        let jim;
        let iceman;
        let frogert;
        let spy;

        const paintLamp = () => {
            world.setForegroundTile(1690,14,3);
            world.setForegroundTile(1754,14,4);
        }

        const interactionBase = (target,callback) => {
            target.interacted = (x,y,direction) => {
                target.updateDirection(direction);
                if(callback) {
                    callback(x,y);
                }
            }
        }

        this.load = world => {
            if(world.globalState.paintedLamp) {
                paintLamp();
            }
            world.addPlayer(8,2,"down");

            jim = world.getCharacter("jim","down");
            world.addObject(jim,8,4);

            iceman = world.getCharacter("ice-man","right");
            world.addObject(iceman,7,5);

            frogert = world.getCharacter("frogert","left");
            world.addObject(frogert,13,6);

            spy = world.getCharacter("concealed-spy","down");
            world.addObject(spy,6,7);

            interactionBase(jim,()=>{

            });
            interactionBase(iceman,()=>{

            });
            interactionBase(frogert,()=>{

            });
            interactionBase(spy,()=>{

            });
        }
        this.doorClicked = ID => {
            world.updateMap("tumble_woods_oop",{fromDoorWay:true});
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopups([
                        "This once beautiful tree, now entombed, symbolizes the elven reign affecting Tumble Town.",
                        "But fear not. The tree has grown into something even more beautiful: A plot device."
                    ]);
                    break;
                case 9:
                    await world.showPopup("What's your game? You just expect all the furniture to talk to you because you decided so? Typical.");
                    break;
                case 10:
                    await world.showPopup('If you put your ear close to the couch, you can hear it humming "Painting the Roses Red."');
                    break;
                case 11:
                    await world.showPopup("Yes. We're red couches. Not pink, not green, not aquamarine. We're red.");
                    break;
                case 12:
                    if(world.globalState.paintedLamp) {
                        await world.showPopups([
                            "Thank you again. I finally feel like I belong here. And guess what? The couches are even treating me better, too.",
                            "How's that for a life lesson? If couches are treating you badly for being different, just become exactly like them!"
                        ]);
                    } else if(world.globalState.hasCanOfPaint) {
                        world.lockPlayerMovement();
                        await world.showPopup("Is.. Is that a can of Red Paint? Are you here to fulfil my dream of finally becoming a red lamp?");
                        const readyToPaint = await world.showPrompt("paint the lamp?","yes","no") === 0;
                        await delay(500);
                        if(!readyToPaint) {
                            await world.showPopup("Oh.. I guess today is just gonna be another red-less day, then.. :(");
                        } else {
                            await world.showPopup("Please. Don't hold back.");
                            await delay(1000);
                            playTone(100,0.5);
                            await delay(200);
                            playTone(100,0.5);
                            await delay(200);
                            playTone(100,0.5);
                            await delay(200);
                            playTone(100,0.5);
                            await delay(200);
                            playSound("energy");
                            paintLamp();
                            world.globalState.paintedLamp = true;
                            world.globalState.hasCanOfPaint = false;
                            await delay(1000);
                            await world.showPopups([
                                "Oh. My. Lamp.",
                                "You.. You've made me happier than you'll ever realize.",
                                "Please. I may just be a lamp and don't have much to offer you, but please. Take this. You earned it."
                            ]);
                            await world.unlockSlot("Bright Idea");
                        }
                        world.unlockPlayerMovement();
                    } else {
                        await world.showPopup("I have to listen to these couches preach all day long about being red. I wish they painted me red too..");
                    }
                    break;
            }
        }
    },
    name: "house_5_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
