addMap({
    //Player home
    WorldState: function(world,data) {

        this.load = world => {
            world.addPlayer(5,8,"up");
        }
        this.worldClicked = async type => {
            switch(type) {
                //Todo object interactions
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
