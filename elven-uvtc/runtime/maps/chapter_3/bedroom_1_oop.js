addMap({
    WorldState: function(world,data) {
        const setNoteTableNormal = () => {
            world.setForegroundTile(323,4,2);
        }
        this.load = world => {
            if(data.fromDoorWay) {
                world.addPlayer(5,2,"down");
            } else {
                world.addPlayer(2,4,"up");
                world.playerObject.xOffset = 0.5;
            }
            if(world.globalState.openedLetter) {
                setNoteTableNormal();
            }
        }
        this.doorClicked = async () => {
            if(!world.globalState.openedLetter) {
                await world.say("You should probably read that letter someone left before you go.");
            }
            world.updateMap("house_1_oop");
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.speech([
                        "Some believe that one's shelves are a reflection of themself.",
                        "It would seem that you are hallow, empty, and devoid of speech. Just like this bookcase."
                    ]);
                    break;
                case 9:
                    await world.say("An elf sleeping bag. Standard issue during elven coups.");
                    break;
                case 10:
                    if(!world.globalState.openedLetter) {
                        world.lockPlayerMovement();
                        setNoteTableNormal();
                        await world.showLetter([
                            "Hey. I didn't want to wake you.. You looked like you were having a really intense dream.",
                            "",
                            "It's been a year since.. You know. The town..",
                            "",
                            "Some of us.. We're getting together at Tree Lee's house. I hope you can make it. We need to talk more in person.",
                            "",
                            "-Jim",
                            "",
                            "PS this letter will disintegrate after you finish reading it."
                        ].join("\n"));
                        await delay(500);
                        await world.say("The letter disintegrated.");
                        world.globalState.openedLetter = true;
                        world.unlockPlayerMovement();
                    } else {
                        await world.say("The ashes of the letter still leave a thin film on the table.");
                    }
                    break;
            }
        }
    },
    name: "bedroom_1_oop",
    doors: [
        "to_house_1_oop"
    ]
});
