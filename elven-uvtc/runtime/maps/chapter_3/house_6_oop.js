addMap({
    //Burr and Shiver's house
    WorldState: function(world,data) {
        let chiliWife;
        this.load = world => {
            world.addPlayer(4,2,"down");
            chiliWife = world.getCharacter("chili-wife","down");
            chiliWife.interacted = async (x,y,direction) => {
                chiliWife.updateDirection(direction);
                await chiliWife.speech([
                    "Ever since I lost him, things just haven't been the same.",
                    "I even started living here.. I keep telling myself things will get better."
                ]);
            }
            world.addObject(chiliWife,6,5);
        }
        this.doorClicked = ID => {
            world.updateMap("tumble_woods_oop",{fromDoorWay:true});
        }
        this.worldClicked = async type => {
            switch(type) {
                case 8:
                    await world.showPopup("The elves replaced all the books with their own.");
                    await world.showInstantPopup('"Rudolph the Red-Nosed Reindeer Overthrows the Means of Production"');
                    break;
                case 9:
                    await world.showPopup("The elves have their own book clearing house.");
                    await world.showInstantPopup('"Finding Your Elf-Worth: Jingling All The Way"');
                    break;
                case 11:
                    await world.showPopup("This is where Shiver and Burr's Christmas tree used to be.. Is it inside this box?");
                    break;
                case 12:
                    await world.showPopup("In this new world, not even an ice cream cone's bed is spared the elven hammer.");
                    break;
                case 13:
                    await world.showPopup("Elves are so peculiar about their branding that they even make sure their labels always face South.");
                    break;
            }
        }
    },
    name: "house_6_oop",
    doors: [
        "to_tumble_woods_oop"
    ]
});
