addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(5,7,"up");
        }
        this.otherClicked = type => {
            switch(type) {
                case 8:
                    break;
                case 9:
                    break;
            }
        }
        let didTrigger = false;
        this.triggerActivated = (triggerID,direction) => {
            if(triggerID === 1 && direction === "up" && !didTrigger) {
                didTrigger = true;
                world.updateMap("tumble_woods",{fromDoorWay:true});
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
