"use strict";
import MainMenuRenderer from "./renderers/main-menu.js";
import BoxFaderEffect from "./renderers/components/box-fader-effect.js";
import DragTestRenderer from "./renderers/drag-test.js";
import FistBattleRenderer from "./renderers/fist-battle.js";
import WorldRenderer from "./renderers/world.js";
import "./runtime/battle/opponents/manifest.js";

drawLoadingText();
establishMapLinks();

function loadCallback() {
    BitmapText.verifyBitmap();
    let firstRendererState;
    if(ENV_FLAGS.TEST === "auto" && ENV_FLAGS.DEBUG_MAP) {
        ENV_FLAGS.TEST = "world";
    }
    switch(ENV_FLAGS.TEST) {
        case "drag-test":
            firstRendererState = new DragTestRenderer();
            break;
        case "fisting":
        case "battle":
        case "fist-battle":
            firstRendererState = new FistBattleRenderer(
                ()=>alert("Player won!"),()=>alert("Opponent won!"),getOpponent("wimpy-red-elf")
            );
            break;
        case "world":
            if(!ENV_FLAGS.DEBUG_MAP) {
                ENV_FLAGS.DEBUG_MAP = FALLBACK_MAP_ID;
            }
            firstRendererState = new WorldRenderer();
            break;
        case "none":
        default:
            firstRendererState = new MainMenuRenderer();
            break;
    }
    setRendererState(firstRendererState);
    if(rendererState.customLoader) {
        rendererState.customLoader(()=>{
            startRenderer();
            if(rendererState.faderCompleted) {
                rendererState.faderCompleted();
            }
        });
        rendererState.updateSize();
    } else {
        startRenderer();
        if(rendererState.song) {
            if(rendererState.songIntro) {
                playMusicWithIntro(rendererState.song,rendererState.songIntro)
            } else {
                playMusic(rendererState.song);
            }
        }
        if(rendererState.faderCompleted) {
            rendererState.faderCompleted();
        }
    }
}

setPageTitle("You Versus Earth");
setImageIndexMode(IndexModes.LoseRoot);
ImageManager.loadImages(loadCallback);
SoundManager.loadSounds(loadCallback);
SoundManager.loadNonEssentialSounds();

(function(){
    const wasMuted = musicMuted || soundMuted;
    if(musicMuted) {
        setMusicVolume(0);
    }
    if(soundMuted) {
        setSoundVolume(0);
    }
    if(wasMuted) {
        saveVolumeChanges();
    }
})();
restoreVolumeChanges();
setFaderEffectsRenderer(new BoxFaderEffect());

if(ENV_FLAGS.FAST_AS_FUCK_TRANSITIONS) {
    setFaderDelay(60);
    setFaderDuration(60);
    setMusicFadeDuration(60);
} else {
    setFaderDelay(600);
    setFaderDuration(1700);
    setMusicFadeDuration(1000);
}
