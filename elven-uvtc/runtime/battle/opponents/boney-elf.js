import OpponentSequencer from "../opponent-sequencer.js";
function BoneyElf() {
    OpponentSequencer.call(this,"boney-elf",true,null,null,0);
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = battleOutput => [];
    this.getPlayerLostEvents = battleOutput => [];
    this.getStalemateEvents = battleOutput => [];
    this.getDefaultHealth = () => 10;
    this.getTurnEvents = () => [];
}
addOpponent(BoneyElf,"boney-elf");
