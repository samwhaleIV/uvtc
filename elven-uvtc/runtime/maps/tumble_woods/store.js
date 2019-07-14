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

        this.triggerActivated = (triggerID,direction) => {
            if(triggerID === 1 && direction === "up") {
                world.updateMap("tumble_woods",{fromDoorWay:true});
            } else {
                return PENDING_CODE;
            }
        }
    },
    fixedCamera: true,
    cameraStart: {
        x: 5,
        y: 4
    },
    name: "store"
});
