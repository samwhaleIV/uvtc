function FakeOpponentSequencer() {
    this.getStartEvents = () => "";
    this.getPlayerWonEvents = () => "";
    this.getPlayerLostEvents = () => "";
    this.getStalemateEvents = () => "";
    this.getTurnEvents = () => [];
}
function OpponentSequencer() {
    FakeOpponentSequencer.apply(this);
}
export default OpponentSequencer;
export { FakeOpponentSequencer, OpponentSequencer };
