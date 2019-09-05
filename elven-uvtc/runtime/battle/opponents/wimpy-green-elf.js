import OpponentSequencer from "../opponent-sequencer.js";
function WimpyGreenElfShowdown() {
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = battleOutput => [];
    this.getPlayerLostEvents = battleOutput => [];
    this.getStalemateEvents = battleOutput => [];
    this.getDefaultHealth = () => 10;
    this.getTurnEvents = () => [];
}
function WimpyGreenElf(battleID) {
    OpponentSequencer.call(this,"wimpy-green-elf",true,null,null,0);
    switch(battleID) {
        case "tumble_showdown":
            WimpyRedElfShowdown.call(this);
            break;
        default:
            throw Error(`'${battleID}' is an invalid battle ID for Wimpy Green Elf`);
    }
}
addOpponent(WimpyGreenElf,"wimpy-green-elf");
