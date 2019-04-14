addMap({
    WorldState: function(world,globalState,data) {
        this.load = world => {
            if(data.fromDoorWay) {
                switch(data.sourceRoom) {
                    case "house_1":
                        world.addPlayer(11,55,"down");
                        break;
                }
            } else {
                world.addPlayer(26,41,"down");
            }
        }
        this.doorClicked = doorID => {
            switch(doorID) {
                case "to_house_1":
                    world.updateMap("house_1",{fromDoorWay:true});
                    break;
            }
        }
        this.otherClicked = (type,x,y) => {
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
    name: "tumble_woods"
});
