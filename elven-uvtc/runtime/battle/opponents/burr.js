import RotatingBackground from "../../../renderers/components/rotating-background.js";

addOpponent("tutorial-burr",function(applicator,...battleParameters) {

    let owMessageIndex = 0;
    let hitCount = 2;
    let hitMessageRate = 2;
    const owMessages = [
        "Ouch! Yes that's it!",
        "Be gentle!",
        "Ow.",
        "Take it easy, you're still learning!"
    ];
    const getNextOwMessage = () => {
        const message = owMessages[owMessageIndex];
        owMessageIndex = (owMessageIndex + 1) % owMessages.length;
        return message;
    }

    const attack = async damage => {
        this.opponent.sprite.setSpecialFrame(0);
        await delay(200);
        this.opponent.sprite.setSpecialFrame(1);
        this.damagePlayer(damage);
        await delay(100);
        this.opponent.sprite.setSpecialFrame(-1);
    }

    applicator({
        effects: {
            staticBackground: new RotatingBackground("tutorial-place")
        },
        opponentSprite: {
            name: "burr",
            isElf: false,
            customWidth: 16,
            customHeight: 32,
            yOffset: 0.55,
            impactFrame: 0,
            renderScale: 65,
        },
        tileset: "tutorial-place",
        fogColor: "rgba(255,255,255,0)",
        opponentMaxHealth: 4,
        playerMaxHealth: 10,
        opponentHeartID: 0,

        endPoints: {
            gameStart: async function() {
                await delay(1000);
                await this.opponent.say("I guess I'll be helping you learn to fight today.");
            },
            opponentInjured: async function(amount) {
                if(hitCount++ % hitMessageRate === 0) {
                    await delay(100);
                    this.opponent.say(getNextOwMessage());
                }
            },
            roundEnd: async function(playerWon,roundNumber) {
                switch(roundNumber) {
                    case 1:
                        await delay(500);
                        await this.opponent.say("Okay! Hold.");
                        await this.opponent.say("First person to lose all their lives LOSES.");
                        await this.opponent.say("It's not nearly as scary as it sounds.");
                        break;
                    case 2:
                        await delay(500);
                        await this.opponent.say("I didn't sign up for this.");
                        break;
                }
            },
            gameOver: async function(playerWon,roundNumber) {
                this.opponent.sprite.setSpecialFrame(1);
                await delay(2000);
                await this.opponent.say("You did it! You saved us all from this quasi-limbo hell!");
                await this.opponent.say("I mean, uh, you learned how to fight.");
                await this.opponent.say("Congratulations... Let's go home. It's beer time.");
            },
            roundStart: async function(playerWon,roundNumber) {
                switch(roundNumber) {
                    case 1:
                        await this.opponent.say("In order to punch me, you'll have to get in range first. Try moving closer!");
                        break;
                    case 3:
                        await this.opponent.say("Man, I'm gonna be feeling this tomorrow.");
                        break;
                }
            },
        }
    });
});
