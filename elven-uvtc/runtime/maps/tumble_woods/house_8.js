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
                    world.showTextPopupsID(["likes_books_1","likes_books_2"]);
                    break;
            }
        }
    },
    name: "house_8",
    doors: [
        "to_tumble_woods"
    ]
});
