import OpponentSequencer from "../opponent-sequencer.js";
function TinyArmElf() {
    OpponentSequencer.call(this,"tiny-arm-elf",true,null,null,0);
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = battleOutput => [];
    this.getPlayerLostEvents = battleOutput => [];
    this.getStalemateEvents = battleOutput => [];
    this.getDefaultHealth = () => 10;
    this.getTurnEvents = () => [];
}
addOpponent(TinyArmElf,"tiny-arm-elf");
