import CrazyFlyingShitEffect from "../../../renderers/components/crazy-flying-shit.js";
import RotatingBackground from "../../../renderers/components/rotating-background.js";

addOpponent("tutorial-burr",function(applicator,...battleParameters) {

    let owMessageIndex = 0;
    let hitCount = 0;
    let hitMessageRate = 4;
    const owMessages = [

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
        layers: [
        ],
        effects: {
            staticBackground: new RotatingBackground("tutorial-place")
        },
        opponentSprite: {
            name: "burr",
            isElf: false,
            customWidth: 16,
            customHeight: 32,
            yOffset: 0.5,
            impactFrame: 0,
            renderScale: 65,
        },
        tileset: "tutorial-place",
        fogColor: "rgba(255,255,255,0)",
        opponentMaxHealth: 10,
        playerMaxHealth: 10,
        opponentHeartID: 0,

        endPoints: {
            gameStart: async function() {
                await delay(1000);

            },
            opponentInjured: async function(amount) {
                if(hitCount++ % hitMessageRate === 0) {
                    await delay(100);
                    this.opponent.say(getNextOwMessage());
                }
            },
            roundEnd: async function(playerWon,roundNumber) {

            },
            gameOver: async function(playerWon,roundNumber) {

            },
            roundStart: function(playerWon,roundNumber) {

            },
        }
    });
});
