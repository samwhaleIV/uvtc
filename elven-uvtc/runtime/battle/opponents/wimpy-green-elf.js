import CrazyFlyingShitEffect from "../../../renderers/components/crazy-flying-shit.js";

addOpponent("wimpy-green-elf",function(applicator,...battleParameters) {


    let runLoop = false;
    let punchDelay = 750;

    const awaitFrames = async frames => {
        for(let i = 0;i<frames;i++) {
            await this.delay(0);
        }
    }
    const attack = async damage => {
        this.lockMovement();
        this.opponent.sprite.setSpecialFrame(0);
        await delay(200);
        this.opponent.sprite.setSpecialFrame(1);
        this.damagePlayer(damage);
        await delay(100);
        this.opponent.sprite.setSpecialFrame(-1);
        if(runLoop) {
            this.unlockMovement();
        }
    }

    let movementIndex = 0;
    const elfMovementDistance = 0.5;
    let movementOrder = [
        -elfMovementDistance,elfMovementDistance,
        elfMovementDistance,-elfMovementDistance
    ];

    const runBattleLoop = async () => {
        runLoop = true;
        while(runLoop) {
            if(!rendererState.showingMessage && this.getPlayerOpponentDistance().inRange) {
                if(Math.random() < 0.25) {
                    const xChange = movementOrder[movementIndex];
                    movementIndex = (movementIndex + 1) % movementOrder.length;
                    await this.opponent.move(xChange,0);
                } else {
                    if(Math.random() > 0.66) {
                        await delay(350);
                    } else {
                        await attack(1);
                        await delay(punchDelay);
                    }
            }}

            await awaitFrames(2);
        }
    }

    const getTree = posX => {
        return this.getForegroundObject(116,2,4,posX,8);
    }
    let owMessageIndex = 0;
    let hitCount = 0;
    let hitMessageRate = 10;
    const owMessages = [
        "Ow!",
        "Ouch!",
        "Please don't cry!",
        "(I'm really trying not to cry.)"
    ];
    const getNextOwMessage = () => {
        const message = owMessages[owMessageIndex];
        owMessageIndex = (owMessageIndex + 1) % owMessages.length;
        return message;
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
        playerMaxHealth: 5,
        opponentHeartID: 0,

        endPoints: {
            gameStart: async function() {
                await delay(500);
                await this.opponent.say("This is just the beginning of what's to come.");
                await this.opponent.say("I will always defend the honor of elves, no matter the cost.");
            },
            opponentInjured: async function(amount) {
                if(hitCount++ % hitMessageRate === 0) {
                    await delay(100);
                    this.opponent.say(getNextOwMessage());
                }
            },
            roundEnd: async function(playerWon,roundNumber) {
                runLoop = false;
                switch(roundNumber) {
                    case 1:
                        if(playerWon) {
                            await this.opponent.say("... Typical.");
                        } else {
                            await this.opponent.say("Ha. Where did you learn to fight?");
                        }
                        break;
                    case 2:
                        await this.opponent.say("Things are heating up now.");
                        break;
                    case 3:
                        await this.opponent.say("Let these bruises reminds you of what your world did to us.")
                        break;
                    case 4:
                        await this.opponent.say("You were never going to get away without a fight.");
                        break;
                    case 5:
                        await this.opponent.say("Please don't cry.");
                        break;
                }
            },
            gameOver: async function(playerWon,roundNumber) {
                runLoop = false;
                if(playerWon) {
                    await this.opponent.say("You may have won this, but the game is just getting started.");
                } else {
                    await this.opponent.say("Elves one, you zero.");
                }
            },
            roundStart: async function(playerWon,roundNumber) {
                switch(roundNumber) {
                    case 1:
                        await delay(500);
                        await this.opponent.say("Time for something new.");
                        await this.opponent.say("Why don't you come a bit closer?");
                        runBattleLoop();
                        break;
                    default:
                        punchDelay -= 37;
                        runBattleLoop();
                        break;
                }
            },
        }
    });
});
