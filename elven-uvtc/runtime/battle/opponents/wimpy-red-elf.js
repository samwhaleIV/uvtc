import OpponentSequencer from "../opponent-sequencer.js";
function WimpyRedElfShowdown() {
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = battleOutput => [];
    this.getPlayerLostEvents = battleOutput => [];
    this.getStalemateEvents = battleOutput => [];
    this.getDefaultHealth = () => 10;
    this.getTurnEvents = () => [];
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
