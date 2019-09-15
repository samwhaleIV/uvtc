import { SecretDoorSound, DoorCloseSound, DoorOpenSound } from "../../tones.js";

addMap({
    //Bathroom house / secret lair
    WorldState: function(world,data) {
        let secretDoorOpen = false;

        const closeSecretDoor = (withSound=true) => {
            secretDoorOpen = false;
            world.globalState.secretDoorOpen = false;
            world.changeForegroundTile(67,2,1);
            if(withSound) {
                DoorCloseSound();
            }
        }
        const openSecretDoor = (withSound=true) => {
            secretDoorOpen = true;
            world.globalState.secretDoorOpen = true;
            world.changeForegroundTile(259,2,1);
            if(withSound) {
                if(!world.globalState.openedSecretDoor) {
                    SecretDoorSound();
                    world.globalState.openedSecretDoor = true;
                } else {
                    DoorOpenSound();
                }
            }
        }

        this.load = world => {
            if(world.globalState.secretDoorOpen) {
                openSecretDoor(false);
            }    
            switch(data.sourceRoom) {
                case "rebel_base_hall":
                    world.addPlayer(2,2,"down");
                    break;
                default:
                    world.addPlayer(4,2,"down");
                    break;
            }

        }
        this.doorClicked = ID => {
            switch(ID) {
                case "secret_base_entrance":
                    if(secretDoorOpen) {
                        world.updateMap("rebel_base_hall",{fromDoorWay:true});
                    }
                    break;
                default:
                    world.updateMap("tumble_woods_oop",{fromDoorWay:true});
                    break;
            }
        }
        const toggleDoorScript = async () => {
            const pressButton = await world.showPrompt("press the button?","yes","no") === 0 ? true : false;
            if(pressButton) {
                await delay(500);
                if(secretDoorOpen) {
                    closeSecretDoor();
                } else {
                    openSecretDoor();
                }
                await delay(100);
            }

        }
        this.otherClicked = async type => {
            switch(type) {
                case 8:
                    world.lockPlayerMovement();
                    if(!world.globalState.openedSecretDoor) {
                        if(false) {
                            //todo some early condition maybe?
                            return;
                        }
                        await world.showTextPopup("The sink seems to have been tampered with.");
                        await world.showTextPopup("There's a small button on the bottom, do you want to press it?");
                        await toggleDoorScript();
                    } else {
                        await toggleDoorScript();
                    }
                    world.unlockPlayerMovement();
                    break;
                case 9:
                    world.showTextPopup("Someone decided to take this poster down, yet no one lives here.");
                    break;
            }
        }
    },
    name: "house_7_oop",
    doors: [
        "secret_base_entrance",
        "to_tumble_woods_oop"
    ]
});
