addMap({
    WorldState: function(world,data) {

        this.load = world => {
            world.addPlayer(26,41,"down");
            return;
            if(data.fromDoorWay) {
                switch(data.sourceRoom) {
                }
            } else {
                world.addPlayer(26,41,"down");
            }
        }
        this.doorClicked = doorID => {
            
        }
        this.activeTrigger = null;
        this.triggerActivated = (ID,direction) => {
            if(this.activeTrigger !== null) {
                return;
            }
            switch(ID) {
                case 2:
                case 1:
                    this.activeTrigger = ID;
                    world.showTextPopupID("you_can_never_leave");
                    break;

            }
        }
        this.triggerDeactivated = () => {
            this.activeTrigger = null;
        }
    },
    useCameraPadding: true,
    doors: [
        "to_house_10",
        "to_tavern",
        "to_house_9",
        "to_house_8",
        "to_house_7",
        "to_mail",
        "to_store",
        "to_house_4",
        "to_house_5",
        "to_house_6",
        "to_house_1",
        "to_house_2",
        "to_house_3"
    ],
    name: "tumble_woods_oop"
});
