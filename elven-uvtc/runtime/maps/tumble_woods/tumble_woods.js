import "./house_1.js";
import "./house_2.js";
import "./house_3.js";
import "./house_4.js";
import "./house_5.js";
import "./house_6.js";
import "./house_7.js";
import "./house_8.js";
import "./house_9.js";
import "./house_10.js";
import "./mail.js";
import "./store.js";
import "./tavern.js";
addMap({
    WorldState: function(world,data) {
        let frogert;
        this.load = world => {
            stopMusic();
            if(data.fromDoorWay) {
                switch(data.sourceRoom) {
                    case "house_1":
                        world.addPlayer(11,55,"down");
                        if(!world.globalState.metFrogert) {
                            frogert = world.getCharacter("frogert","down");
                            world.addObject(frogert,15,55);
                            scripts.meeting_frogert(world,frogert);
                        }
                        break;
                    case "house_2":
                        world.addPlayer(19,55,"down");
                        break;
                    case "house_3":
                        world.addPlayer(27,55,"down");
                        break;
                    case "house_4":
                        world.addPlayer(11,44,"down");
                        break;
                    case "house_5":
                        world.addPlayer(16,44,"down");
                        break;
                    case "house_6":
                        world.addPlayer(21,44,"down");
                        break;
                    case "house_7":
                        world.addPlayer(14,32,"down");
                        break;
                    case "house_8":
                        world.addPlayer(36,30,"down");
                        break;
                    case "house_9":
                        world.addPlayer(18,25,"down");
                        break;
                    case "house_10":
                        world.addPlayer(22,19,"down");
                        break;
                    case "tavern":
                        world.addPlayer(33,19,"down");
                        break;
                    case "store":
                        world.addPlayer(32,36,"down");
                        break;
                    case "mail":
                        world.addPlayer(24,34,"down");
                        break;
                }
            } else {
                world.addPlayer(26,41,"down");
            }
        }
        this.doorClicked = doorID => {
            if(world.globalState.metFrogert) {
                if(doorID !== "to_house_1") {
                    world.updateMap("house_1",{fromDoorWay:true});
                } else if(doorID !== "to_house_2") {
                    if(world.globalState.frogertDoorSequenceComplete) {
                        world.updateMap("house_2",{fromDoorWay:true});
                        return;
                    }
                    if(!frogert) {
                        frogert = world.getCharacter("frogert","down");
                    }
                    scripts.meeting_frogert(this,frogert);
                } else {
                    world.showTextPopupID('you should probably go check if that frog you scared is okay first.');
                }
            }
            world.updateMap(doorID.substring(3),{fromDoorWay:true});
        }
        this.activeTrigger = null;
        this.triggerActivated = (ID,direction) => {
            if(this.activeTrigger === ID) {
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
    name: "tumble_woods"
});
