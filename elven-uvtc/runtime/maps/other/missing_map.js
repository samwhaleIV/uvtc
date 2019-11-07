addMap({
    WorldState: function(world) {
        this.load = () => {
            world.addPlayer(8,10,"right");
            world.playerObject.forcedStartPosition = true;
            this.start = async () => {
                if(world.chapter.startMap) {
                    await delay(500);
                    await world.showPopups([
                        "Hello, player! I've got good news.",
                        `Remember when you wanted to play ${world.chapterName} but it wasn't ready?`,
                        "Well, it's ready now! Come over to me, the sink, when you are ready to start!"
                    ]);
                    this.worldClicked = async () => {
                        await world.showPopup(`Thanks again for stopping by. I hope you enjoy ${world.chapterName}!`);
                        world.updateMap(world.chapter.startMap);
                    }
                    world.unlockPlayerMovement();
                } else {
                    world.unlockPlayerMovement();
                }
            }
        }
        this.worldClicked = async () => {
            if(this.talkedToSink) {
                await world.showPopup(`Thanks again for stopping by ${world.chapterName}!`);
            } else {
                await world.showPopups([
                    "Hey. How's it going?",
                    "I'm here to tell you some bad news..",
                    "Here it goes...",
                    "This chapter isn't made yet, so you can't play it.",
                    "Some day it will be though, and you can stop by here again to play it.",
                ]);
                this.talkedToSink = true;
            }
        }
    },
    useCameraPadding: true,
    name: "missing_map"
});
