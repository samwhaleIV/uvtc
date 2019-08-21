addMap({
    WorldState: function(world,data) {
        let wimpyRed;
        let wimpyGreen;
        let wizard;
        this.load = () => {
            wimpyRed = world.getCharacter("wimpy-red-elf","down");
            wimpyRed.offscreenRendering = true;

            wimpyGreen = world.getCharacter("wimpy-green-elf","down");
            wizard = world.getCharacter("wizard-elf","down");

            wimpyRed.convoyAdd(wimpyGreen,wizard);
            world.addObject(wimpyRed,9,-1);
            wimpyRed.yOffset = 0;

            world.followObject = wimpyRed;   
            this.start = async () => {
                await wimpyRed.move({y:9});
                await delay(1000);
                await wimpyGreen.say("Are we there yet?");
                await delay(600);
                await wimpyRed.say("No. Not yet.");
                await delay(200);
                await wimpyRed.move({y:3});
                await delay(500);
                await wimpyGreen.say("What about now? Are we there yet?");
                await delay(500);
                await wimpyRed.say("...");
                await wimpyRed.say("No.");
                await wimpyRed.move({y:5});
                await delay(200);
                await wimpyGreen.say("So... I was thinking...");
                await delay(200);
                await wimpyRed.say("I. Swear. To. God.");
                await wimpyGreen.say("...");
                await wimpyGreen.say("Uh. Nevermind.");
                await delay(800);
                await wimpyRed.move({
                    y: world.renderMap.verticalUpperBound - wimpyRed.y + 4
                });
                fadeOutSongs(2500);
                await world.fadeToBlack(3000);
                world.updateMap("chili_house");
            }
        }
    },
    useCameraPadding: true,
    name: "north_pole_preview"
});
