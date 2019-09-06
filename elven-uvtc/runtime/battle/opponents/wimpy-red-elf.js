import OpponentSequencer from "../opponent-sequencer.js";
function WimpyRedElfShowdown() {
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = battleOutput => [];
    this.getPlayerLostEvents = battleOutput => [];
    this.getStalemateEvents = battleOutput => [];
    this.getDefaultHealth = () => 10;
    this.getTurnEvents = () => [];
    this.load = () => {
        this.self.state.isElf = true;
        this.self.state.submissionHandle = () => {
            return {
                name: "Honorable Suicide",
                description: "It's what the cool kids do.",
                process: user => {
                    user.kill();
                    return [{
                        type: "text",
                        text: `${user.name} commited suicide`
                    },{
                        type: "speech",
                        text: `Remember kids, suicide is a permanent solution to a temporary problem.`
                    },{
                        type: "speech",
                        text: "You're not alone. Confidential help is available for free."
                    },{
                        type: "speech",
                        text: "For National Suicide Prevention Lifeline, call 1-800-273-8255."
                    }];
                }
            }
        }
    }
}
function WimpyRedElf(battleID) {
    OpponentSequencer.call(this,"wimpy-red-elf",true,null,null,0);
    switch(battleID) {
        case "tumble_showdown":
            WimpyRedElfShowdown.call(this);
            break;
        default:
            throw Error(`'${battleID}' is an invalid battle ID for Wimpy Red Elf`);
    }
}
addOpponent(WimpyRedElf,"wimpy-red-elf");
