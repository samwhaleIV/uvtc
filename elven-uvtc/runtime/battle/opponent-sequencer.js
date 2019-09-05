import SpriteForeground from "../../renderers/components/battle/sprite-foreground.js";
import BattleManifest from "./manifest.js";
import { DEFAULT_HEALTH } from "./battle-sequencer.js";

function OpponentSequencer(opponentID,...spriteParameters) {
    this.getStartEvents = () => [];
    this.getPlayerWonEvents = battleOutput => [];
    this.getPlayerLostEvents = battleOutput => [];
    this.getStalemateEvents = battleOutput => [];
    this.getTurnEvents = () => [];
    this.getDefaultHealth = () => DEFAULT_HEALTH;
    this.getName = () => this.name;
    const song = BattleMusicLinkingManifest[opponentID];
    let songIntro = null;
    if(song) {
        const intro = SONG_INTRO_LOOKUP[song];
        if(intro) {
            songIntro = intro;
        }
    }
    this.getSong = () => song;
    this.getSongIntro = () => songIntro;

    this.foreground = new SpriteForeground(opponentID,...spriteParameters);
    this.style = BattleManifest[opponentID];
    this.name = this.style.name;
}
export default OpponentSequencer;
