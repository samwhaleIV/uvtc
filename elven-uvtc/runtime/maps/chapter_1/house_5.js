addMap({
    WorldState: function(world,data) {
        const clearP4 = () => {
            const x = 1;
            const y = 7;
            world.setForegroundTile(0,x,y);
            world.setCollisionTile(0,x,y);
        };
        const statusMessage = () => worldMaps.tumble_woods.presentTracker.getRemainingMessage(world);
        this.load = world => {
            if(world.globalState.present4) {
                clearP4();
            }
            world.addPlayer(8,2,"down");
            const treelee = world.getCharacter("tree-lee","left");
            world.addObject(treelee,4,6);
            treelee.interacted = async (x,y,direction) => {
                world.lockPlayerMovement();
                if(world.globalState.metTreeLee) {
                    await treelee.say("You know, you really should get in the habit of knocking...");
                    await treelee.say("You shouldn't just barge into people's homes.");
                    await treelee.say("What if I wasn't even here and you just started snooping around my house?");
                } else {
                    await treelee.alert();
                    await delay(400);
                    await treelee.say("Do you ever get the feeling someone is breathing on your neck?");
                    await delay(800);
                    treelee.updateDirection(direction);
                    await delay(800);
                    await treelee.say("Hey. I'm Tree Lee.");
                    await delay(800);
                    treelee.updateDirection("left");
                    await delay(1600);
                    treelee.updateDirection(direction);
                    await delay(800);
                    await treelee.say("It's a beautiful Tree, isn't it?");
                    await delay(800);
                    await treelee.say("... Don't answer that. I already know it's a beautiful tree.");
                    await delay(400);
                    treelee.updateDirection("left");
                    world.globalState.metTreeLee = true;
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
                    world.showPopup("An indoor tree? Finally, something unique in one of these houses.");
                    break;
                case 9:
                    world.showPopup("There's a nice atmosphere to do things at this table.");
                    break;
                case 10:
                    world.showPopup("The couch has some light stains on it.");
                    break;
                case 11:
                    world.showPopup("The couch is so bright it's hard to look at.");
                    break;
                case 12:
                    world.showPopup("What a bright idea putting a lamp next to two windows.");
                    break;
                case 16:
                    clearP4();
                    world.globalState.present4 = true;
                    await world.showInstantPopup(statusMessage());
                    break;
            }
        }
    },
    name: "house_5",
    doors: [
        "to_tumble_woods"
    ]
});
