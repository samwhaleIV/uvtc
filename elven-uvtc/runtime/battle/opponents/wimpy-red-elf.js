import CrazyFlyingShitEffect from "../../../renderers/components/crazy-flying-shit.js";

addOpponent("wimpy-red-elf",function(applicator,...battleParameters) {
    const getTree = posX => {
        return this.getForegroundObject(116,2,4,posX,8);
    }

    let loopSpeed = 1000;
    let owMessageIndex = 0;

    let walkLoop = false;
    let resolve = true;

    let hitCount = 0;
    let hitMessageRate = 4;
    const owMessages = [
        "Ow!","Please give me a chance!",
        "You're not making it easy to prove my point!","Ouch!","I never learned how to fight!",
        "What did I do to deserve this!",
        "I am just an elf!",
        "Elves weren't made for this!",
        "Please stop hurting me!",
        "I was just trying to get you to understand the oppresion elves!"
    ];
    const getNextOwMessage = () => {
        const message = owMessages[owMessageIndex];
        owMessageIndex = (owMessageIndex + 1) % owMessages.length;
        return message;
    }
    const startWalkLoop = async opponent => {
        resolve = false;
        walkLoop = true;
        while(true) {
            await opponent.move(0.5,0);

            if(!walkLoop){resolve = true;return;}
            await delay(loopSpeed);

            if(!walkLoop){resolve = true;return;}
            await opponent.move(-0.5,0);

            if(!walkLoop){resolve = true;return;}
            await delay(loopSpeed);

            if(!walkLoop){resolve = true;return;}
            await opponent.move(-0.5,0);

            if(!walkLoop){resolve = true;return;}
            await delay(loopSpeed);

            if(!walkLoop){resolve = true;return;}
            await opponent.move(0.5,0);

            if(!walkLoop){resolve = true;return;}
            await delay(loopSpeed);
            if(!walkLoop){resolve = true;return;}
        }
    }
    const endWalkLoop = async opponent => {
        walkLoop = false;
        opponent.stopMove();
        while(true) {
            if(resolve) {
                return;
            }
            await delay(100);
        }
    }
    applicator({
        layers: [
            [
                getTree(0.4),
                getTree(0.9),
                getTree(-0.5),
                getTree(1.5),
            ],
            [
                getTree(0.25),
                getTree(0.75),
                getTree(-0.5),
                getTree(1.5),
            ],
            [
                getTree(0.20),
                getTree(0.75)
            ]
        ],
        effects: {
            background: new CrazyFlyingShitEffect(1,2.5,0.001,80,200,"white")
        },
        opponentSprite: {
            name: "wimpy-red-elf",
            isElf: true,
            customWidth: null,
            customHeight: null,
            yOffset: 0.2,
            impactFrame: 2
        },
        tileset: "test-tileset",
        fogColor: null,
        opponentMaxHealth: 10,
        playerMaxHealth: 10,
        opponentHeartID: 0,

        endPoints: {
            gameStart: async function() {
                await delay(1000);
                await this.opponent.say("We won't let you forget your injustice against elves so easily!");
                await this.opponent.say("Bring it!");
            },
            opponentInjured: async function(amount) {
                if(hitCount++ % hitMessageRate === 0) {
                    await delay(100);
                    this.opponent.say(getNextOwMessage());
                }
            },
            roundEnd: async function(playerWon,roundNumber) {
                await endWalkLoop(this.opponent);
                await delay(1000);
                switch(roundNumber) {
                    case 1:
                        await this.opponent.say("Ouch! That really hurt, Charlie.");
                        await this.opponent.say("Oh. Your name isn't Charlie?");
                        break;
                    case 2:
                        await this.opponent.say("Alright, I've got one final trick up my sleeve.");
                        break;
                }
            },
            gameOver: async function(playerWon,roundNumber) {
                await endWalkLoop(this.opponent);
                await delay(1000);
                if(playerWon) {
                    await this.opponent.say("You may have bested me, but Wimpy Green Elf won't let us down.");
                } else {
                    await this.opponent.say("Ha! Even my wimpiness was too much for you.");
                }
            },
            roundStart: function(playerWon,roundNumber) {
                switch(roundNumber) {
                    case 2:
                        loopSpeed = 700;
                        startWalkLoop(this.opponent);
                        break;
                    case 3:
                        loopSpeed = 300;
                        startWalkLoop(this.opponent);
                        break;
                }
            },
        }
    });
});
