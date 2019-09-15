addMap({
    WorldState: function(world,data) {

        this.load = world => {
            switch(data.sourceRoom) {
                case "rebel_base":
                    world.addPlayer(13,3,"down");
                    world.playerObject.xOffset = 0.5;
                    break;
                case "rebel_base_storage":
                    world.addPlayer(34,5,"down");
                    world.playerObject.xOffset = 0.5;
                    break;
                default:
                    world.addPlayer(2,16,"up");
                    break;
            }
        }
        this.otherClicked = async type => {
            switch(type) {
                case 16:
                    world.updateMap("rebel_base");
                    break;
                case 17:
                    world.updateMap("rebel_base_storage");
                    break;
            }
        }
        this.triggerActivated = (triggerID,direction) => {
            if(triggerID === 1 && direction === "up") {
                world.updateMap("house_7_oop",{fromDoorWay:true});
            } else {
                return PENDING_CODE;
            }
        }
    },
    name: "rebel_base_hall"
});
