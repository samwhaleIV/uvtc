addMap({
    WorldState: function(world,globalState,data) {
        this.load = world => {
            if(data.fromDoorWay) {
                world.addPlayer(5,2,"down");
            } else {
                world.addPlayer(2,4,"up");
            }
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.otherClicked = (type,x,y) => {
            switch(type) {
                case 8:
                    world.showTextPopupID("bookcase_1");
                    break;
                case 9:
                    world.showTextPopupID("bed_1");
                    break;
            }
        }
    },
    name: "bedroom_1",
    doors: [
        "to_main"
    ],
});
addMap({
    WorldState: function(world,globalState,data) {
        this.load = world => {
            world.addPlayer(5,2,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.otherClicked = (type,x,y) => {
            switch(type) {
                case 8:
                    world.showTextPopupID("bookcase_2");
                    break;
                case 9:
                    world.showTextPopupID("bookcase_3");
                    break;
                case 10:
                    world.showTextPopupID("table_1");
                    break;
            }
        }
    },
    name: "bedroom_2",
    doors: [
        "to_main"
    ],
});
addMap({
    WorldState: function(world,globalState,data) {
        this.load = world => {
            world.addPlayer(5,2,"down");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("house_1",newMapData);
        }
        this.otherClicked = (type,x,y) => {
            switch(type) {
                case 8:
                    world.showTextPopupID("table_2");
                    break;
                case 9:
                case 11:
                    world.showTextPopupID("counter_1");
                    break;
                case 10:
                    world.showTextPopupID("counter_2");
                    break;
            }
        }
    },
    name: "bedroom_3",
    doors: [
        "to_main"
    ],
});
addMap({
    WorldState: function(world,globalState,data) {
        this.load = world => {
            if(data.fromDoorWay) {
                switch(data.sourceRoom) {
                    case "bedroom_1":
                        world.addPlayer(3,2,"down");
                        break;
                    case "bedroom_2":
                        world.addPlayer(7,2,"down");
                        break;
                    case "bedroom_3":
                        world.addPlayer(11,2,"down");
                        break;
                    case "tumble_woods":
                        world.addPlayer(18,10,"down");
                        break;
                }
            } else {
                world.addPlayer(18,10,"down");
            }
            const jim = new SpriteRenderer("down","jim");
            jim.interacted = (x,y,direction) => {
                if(direction === "left") {
                    world.lockPlayerMovement();
                    world.moveSprite(this.JIM_ID,[{y:2},{x:1}],()=>{
                        setTimeout(()=>{
                            world.showNamedTextPopup("that was quite the journey...\nnow you may use the door","Bjim:B ",()=>{
                                world.unlockPlayerMovement();
                            });
                        },1000);
                    });
                } else {
                    jim.updateDirection(direction);
                    world.showNamedTextPopup(`you touched me from my ${direction} direction.\nthat tickles!`,"Bjim:B ");
                }
            }
            this.JIM_ID = world.addObject(jim,18,10);
        }
        this.doorClicked = doorID => {
            switch(doorID) {
                case "to_bedroom_1":
                    world.updateMap("bedroom_1",{fromDoorWay:true});
                    break;
                case "to_bedroom_2":
                    world.updateMap("bedroom_2",{fromDoorWay:true});
                    break;
                case "to_bedroom_3":
                    world.updateMap("bedroom_3",{fromDoorWay:true});
                    break;
                case "to_tumble_woods":
                    world.updateMap("tumble_woods",{fromDoorWay:true});
                    break;
            }
        }
        this.otherClicked = (type,x,y) => {
            switch(type) {
                case 8:
                    world.showTextPopupID("sink_1");
                    break;
                case 9:
                    world.showTextPopupID("toilet_1");
                    break;
                case 10:
                    world.showTextPopupID("bathtub_1");
                    break;

                case 11:
                    world.showTextPopupID("bookcase_4");
                    break;
                case 12:
                    world.showTextPopupsID([
                        "bookcase_5_1",
                        "bookcase_5_2",
                        "bookcase_5_3"
                    ]);
                    break;
                case 13:
                    world.showTextPopupID(
                        "bookcase_6_1",world.showNamedTextPopupID,"bookcase_6_2","Bedgy bookcase:B "
                    );
                    break;
                case 14:
                    world.showTextPopupID(
                        "bookcase_7_1",world.showNamedTextPopupID,"bookcase_7_2","Bnaugthy bookcase:B "
                    );
                    break;
                case 15:
                    //todo
                    break;
                case 16:
                    world.showTextPopupID("couch_1");
                    break;
                case 17:
                    world.showNamedTextPopupID("tv_1","Bcreepy tv:B ");
                    break;
            }
        }
    },
    doors: [
        "to_bedroom_1",
        "to_bedroom_2",
        "to_bedroom_3",
        "to_tumble_woods"
    ],
    name: "house_1"
});