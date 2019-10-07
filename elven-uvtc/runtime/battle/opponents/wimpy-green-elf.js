import CrazyFlyingShitEffect from "../../../renderers/components/crazy-flying-shit.js";

addOpponent("wimpy-green-elf",function(applicator,...battleParameters) {
    const getTree = posX => {
        return this.getForegroundObject(116,2,4,posX,8);
    }


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
            [
                getTree(0.25),
                getTree(0.75)
            ],
            [
                getTree(0.25),
                getTree(0.75)
            ],
            [
                getTree(0.25),
                getTree(0.75)
            ]
        ],
        effects: {
            background: new CrazyFlyingShitEffect(1,2.5,0.001,80,200,"white")
        },
        opponentSprite: {
            name: "wimpy-green-elf",
            isElf: true,
            customWidth: null,
            customHeight: null,
            yOffset: 0.2,
            impactFrame: 2
        },
        tileset: "tumble-showdown",
        fogColor: null,
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
