addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(4,3,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.otherClicked = async type => {
            switch(type) {
                case 8:
                    await world.showTextPopups([
                        "There's a notecard taped to this shelf.",
                        "'Adults only'",
                        "Hmm... this might be interesting.",
                    ]);
                    const selection = await world.showPrompt("do you want to read an adult book?","yes","no");
                    if(selection === 0) {
                        world.showTextPopup("Ew. There's more important things you should be doing than reading someone else's smut.");
                    } else {
                        world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    }
                    break;
                case 9:
                    world.showTextPopup("The books appear to have slipped into another dimension.");
                    break;
                case 10:
                    world.showTextPopup("This table is long, yet, you can't help but feel disappointed by it.");
                    break;
                case 11:
                    world.showTextPopup("What kind of a heathen has their dryer on the left?");
                    break;
                case 16:
                    world.showTextPopup("The washer being on the right is making you very uncomfortable.");
                    break;
                case 12:
                    world.showTextPopup("A lot of people must sleep here.");
                    break;
                case 13:
                    world.showTextPopup("This sleeping bag doesn't want to be bothered.");
                    break;
                case 14:
                    world.showTextPopup("This sleeping bag is upset with the other sleeping bags.");
                    break;
                case 15:
                    world.showTextPopup("Who would want to sleep this close to other people?");
                    break;
            }
        }
    },
    name: "house_4",
    doors: [
        "to_tumble_woods"
    ]
});
