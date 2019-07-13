addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(4,2,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.otherClicked = type => {
            switch(type) {
                case 8:
                    world.showTextPopups(["Wow. this person sure likes books.","You can't grab any books or else the whole house might fall apart."]);
                    break;
            }
        }
    },
    name: "house_8",
    doors: [
        "to_tumble_woods"
    ]
});
