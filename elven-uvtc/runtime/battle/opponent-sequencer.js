import SpriteForeground from "../../renderers/components/battle/sprite-foreground.js";
import StyleManifest from "./style-manifest.js";

function FakeOpponentSequencer() {
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = () => "";
    this.getPlayerLostEvents = () => "";
    this.getStalemateEvents = () => "";
    this.getTurnEvents = () => [];
    this.getDefaultHealth = () => 69;
    this.getName = () => "Boney Elf";
    this.foreground = new SpriteForeground("wimpy-red-elf",true);
    this.style = StyleManifest["Boney Elf"];
}
function OpponentSequencer() {
    FakeOpponentSequencer.apply(this);
}
export default OpponentSequencer;
export { FakeOpponentSequencer, OpponentSequencer };
