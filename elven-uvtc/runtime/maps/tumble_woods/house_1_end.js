
addMap({
    WorldState: function(world,data) {
        this.load = world => {
            const jim = world.getCharacter("jim","down");
            world.addPlayer(18,12,"up");
            world.addObject(jim,18,10);
            this.start = async () => {
                await delay(500);
                await jim.alert();
                await jim.say("Wow! You got here really fast.");
                await jim.say("I was waiting at the door for you... But I guess you didn't even need to use it!");
                await jim.say("The emergency is, you've been gone for hours and hours! I was worried sick about you!");
                await jim.say("W-what? It's only been about 20 minutes?");
                await jim.say("Oh.");
                await delay(1000);
                await jim.say("Annnnyways. I've been hearing from the town and they all had a great time meeting you!");
                await jim.say("They're so glad you're going to a party.");
                await jim.move({y:1});
                await jim.say("I'm glad, too. Welcome to Tumble Town. You're gonna like it a whole lot here.");
                world.chapterComplete();
            }
        }
        this.triggerActivated = (triggerID,direction) => {

        }
        this.doorClicked = async doorID => {

        }
        this.otherClicked = async type => {

        }
    },
    doors: [],
    name: "house_1_end"
});
