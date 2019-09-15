addMap({
    WorldState: function(world,data) {

        this.load = world => {
            world.addPlayer(7,7,"up");
        }
        this.otherClicked = async type => {
            switch(type) {
                //Todo object interactions
            }
        }
        this.triggerActivated = (triggerID,direction) => {
            if(triggerID === 1 && direction === "up") {
                world.updateMap("rebel_base_hall",{fromDoorWay:true});
            } else {
                return PENDING_CODE;
            }
        }
    },
    name: "rebel_base_storage"
});
