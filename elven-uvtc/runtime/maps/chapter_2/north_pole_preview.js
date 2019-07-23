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
            world.addObject(wimpyRed,9,-2);
            wimpyRed.yOffset = 0;

            world.followObject = wimpyRed;    
            this.start = async () => {
                await wimpyRed.move({y:25});
            }
        }
    },
    useCameraPadding: true,
    name: "north_pole_preview"
});
