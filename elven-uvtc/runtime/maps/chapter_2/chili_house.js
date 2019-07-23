addMap({
    WorldState: function(world,data) {
        this.load = () => {
        
        }
        this.doorClicked = () => {

        }
        this.otherClicked = async type => {
            switch(type) {
                case 8:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 9:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 10:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 11:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 17:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 12:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 13:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 14:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 15:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 16:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 17:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
                case 18:
                    world.showTextPopup("Ah, I see. Saving yourself for marriage.");
                    break;
            }
        }
    },
    name: "chili_house",
    doors: ["main_attraction_door"]
});
