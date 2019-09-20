addMap({
    WorldState: function(world,data) {

        const removePoolNoodle = () => {
            const x = 7;
            const y = 3;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
        }

        this.load = world => {
            if(world.globalState.hasPoolNoodle) {
                removePoolNoodle();
            }
            world.addPlayer(7,7,"up");
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopup("It's a green container. It contains Christmas decorations.");
                    break;
                case 9:
                    await world.showPopup("It's a vertical beige container. It contains confidential information.");
                    break;
                case 10:
                    await world.showPopup("It's vertical beige container. It contains a Christmas tree.");
                    break;
                case 11:
                    await world.showPopup("A square beige container. It contains Chemical X.");
                    break;
                case 12:
                    await world.showPopup("A square beige container. It contains bottles of disappointment.");
                    break;
                case 13:
                    await world.showPopup("A barrel of liquid. It contains expired eggnog. Drinking it is not recommended.");
                    break;
                case 14:
                    await world.showPopup("It's a box of socks.");
                    break;
                case 15:
                    await world.showPopup("The box has a label on it that says it's bigger on the inside.");
                    break;
                case 16:
                    await world.showPopup("It's a barrel of 100-proof whiskey. Brutal.");
                    break;
                case 17:
                    await world.showPopups([
                        "There are some good reads on this shelf.",
                        'One book is called "Surviving and Rebelling Against a Tyrannical Dictatorship For Dummies"'
                    ]);
                    break;
                case 18:
                    await world.showPopups([
                        "This barrel has a warning label on it.",
                        '"WARNING: Contents may contain chemicals known to the state of California to cause cancer, birth defects, or other reproductive harm"'
                    ]);
                    break;
                case 19:
                    await world.showPopups([
                        "This container is in the Christmas spirit.",
                        "Inside are cans of red paint, do you want to take one?"
                    ]);
                    const wantsToTakeOne = world.showPrompt("take a can of Red Paint?","yes","no") === 0 ? "yes" : "no";
                    world.lockPlayerMovement();
                    await delay(500);
                    if(wantsToTakeOne) {
                        if(world.globalState.hasCanOfPaint) {
                            await world.showPopups(["Hey. Wait. I've seen you before!","Don't be greedy. You already got your can of Red Paint!"]);
                        } else {
                            await world.showInstantPopupSound("You received one can of Red Paint.");
                            world.globalState.hasCanOfPaint = true;
                        }
                    } else if(!world.globalState.hasCanOfPaint) {
                        await world.showPopup("Okay well if you change your mind you know where to find me!");
                    }
                    world.unlockPlayerMovement();
                    break;
                case 20:
                    await world.showPopup("It's a box. This box wants you to know it's different from all the other boxes in the room.");
                    break;
                case 21:
                    await world.showTextPopusp([
                        "There are some.. interesting holiday books on the shelf.",
                        'Most notable is a dissertation titled "Die Hard is a Christmas Movie, Accept it"'
                    ]);
                    break;
                case 22:
                    if(!world.globalState.hasPoolNoodle) {
                        world.lockPlayerMovement();
                        await world.showPopup("It's a pool noodle. Do you want to take it?");
                        const wantToTake = world.showPrompt("take pool noodle?","yes","no") === 0;
                        await delay(500);
                        if(wantToTake) {
                            removePoolNoodle();
                            await world.showInstantPopupSound("The pool noodle is now yours!");
                            world.globalState.hasPoolNoodle = true;
                        }
                        world.unlockPlayerMovement();
                    }
                    break;
            }
        }
        this.triggerImpulse = (triggerID,direction) => {
            if(triggerID === 1 && direction === "down") {
                world.updateMap("rebel_base_hall",{fromDoorWay:true});
                return TRIGGER_ACTIVATED;
            }
        }
    },
    name: "rebel_base_storage"
});
