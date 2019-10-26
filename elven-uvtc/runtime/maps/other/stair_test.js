addMap({
    WorldState: function(world) {
        this.load = () => {
            world.addPlayer(3,10,"up");
        }
    },
    useCameraPadding: false,
    name: "stair_test"
});
