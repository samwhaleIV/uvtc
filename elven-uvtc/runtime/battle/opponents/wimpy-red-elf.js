import OpponentSequencer from "../opponent-sequencer.js";
function WimpyRedElf() {
    OpponentSequencer.call(this,"wimpy-red-elf",true,null,null,0);
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = battleOutput => [];
    this.getPlayerLostEvents = battleOutput => [];
    this.getStalemateEvents = battleOutput => [];
    this.getDefaultHealth = () => 10;
    this.getTurnEvents = () => [];
}
addOpponent(WimpyRedElf,"wimpy-red-elf");
