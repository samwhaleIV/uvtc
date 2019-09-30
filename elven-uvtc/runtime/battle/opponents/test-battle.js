import CrazyFlyingShitEffect from "../../../renderers/components/crazy-flying-shit.js";

function TestBattle(applicator,...battleParameters) {
    const getTree = posX => {
        return this.getForegroundObject(116,2,4,posX,8);
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
        fogColor: null
    });
    
    (async function(){
        await delay(1000);
        await this.opponent.say("Go easy on me.. I'm new to fighting.");
    }).call(this);
}
addOpponent(TestBattle,"test-battle");
