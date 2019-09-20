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
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    break;
                case 9:
                    break;
                case 10:
                    break;
                case 11:
                    break;
                case 12:
                    break;
                case 13:
                    break;
                case 14:
                    break;
                case 15:
                    break;
                case 16:
                    world.updateMap("rebel_base");
                    break;
                case 17:
                    world.updateMap("rebel_base_storage");
                    break;
            }
        }
        this.triggerImpulse = (triggerID,direction) => {
            if(triggerID === 1 && direction === "down") {
                world.updateMap("house_7_oop",{fromDoorWay:true});
                return TRIGGER_ACTIVATED;
            }
        }
    },
    name: "rebel_base_hall"
});
