addMap({
    //Player home
    WorldState: function(world,data) {

        this.load = world => {
            world.addPlayer(5,8,"up");
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopup("A whiteboard. Every official looking meeting room needs a whiteboard. Someone should probably be writing this down.");
                    break;
                case 9:
                    await world.showPopup("This map looks important but it doesn't appear to be of a real place. In fact, it still has a price tag on the corner.");
                    break;
                case 10:
                case 11:
                    await world.showPopup("A green flag representing the rebellion.");
                    break;
                case 12:
                case 13:
                    await world.showPopup("A red flag representing the rebellion.");
                    break;
            }
        }
        this.triggerImpulse = (triggerID,direction) => {
            if(triggerID === 1 && direction === "down") {
                world.updateMap("rebel_base_hall",{fromDoorWay:true});
                return TRIGGER_ACTIVATED;
            }
        }
    },
    name: "rebel_base"
});
