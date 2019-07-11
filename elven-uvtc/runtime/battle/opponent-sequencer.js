import SpriteForeground from "../../renderers/components/battle/sprite-foreground.js";
import BattleManifest from "./manifest.js";

function OpponentSequencer(opponentID,...spriteParameters) {
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = () => [];
    this.getPlayerLostEvents = () => [];
    this.getStalemateEvents = () => [];
    this.getTurnEvents = () => [];
    this.getDefaultHealth = () => 10;
    this.getName = () => this.name;
    const song = BattleMusicLinkingManifest[opponentID];
    let songIntro = null;
    if(song) {
        songIntro = SongsWithIntros[song];
        this.getSong = () => song;
    }
    if(songIntro) {
        this.getSongIntro = () => songIntro;
    }
    this.getSong = () => null;
    this.getSongIntro = () => null;

    this.foreground = new SpriteForeground(opponentID,...spriteParameters);
    this.style = BattleManifest[opponentID];
    this.name = this.style.name;
}
export default OpponentSequencer;
