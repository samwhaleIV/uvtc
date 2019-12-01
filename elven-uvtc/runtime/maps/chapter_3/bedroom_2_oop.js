addMap({
    WorldState: function(world,data) {
        this.load = world => {
            world.addPlayer(5,2,"down");
        }
        this.doorClicked = () => {
            world.updateMap("house_1_oop");
        }
        this.worldClicked = async type => {
            switch(type) {
                case 9:
                    await world.showPopups([
                        "Oh my god! Someone stole all the books.",
                        "What kind of literary savage steals books right off the shelf?"
                    ]);
                    break;
                case 8:
                    await world.showPopups([
                        "All the books are about elves and how awesome they are.",
                        "Some of them seem like they could be a bit controversial."
                    ]);
                    await world.showInstantPopup('"Elf 2: The Musical Fan-Fic"');
                    await world.showInstantPopup('"We Don\'t Like Christmas and Here\'s What We\'re Doing About It"');
                    await world.showPopup("The first line reads: 'Dear humans, we hate you.'");
                    break;
                case 10:
                    await world.showPopup("Your intuition leads you to believe these tables are intended for book club meetings.")
                    break;
            }
        }
    },
    name: "bedroom_2_oop",
    doors: [
        "to_house_1_oop"
    ],
    songParent: "house_1_oop"
});
