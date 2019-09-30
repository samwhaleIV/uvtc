"use strict";
import MainMenuRenderer from "./renderers/main-menu.js";
import BoxFaderEffect from "./renderers/components/box-fader-effect.js";
import DragTestRenderer from "./renderers/drag-test.js";
import SomethingDifferentRenderer from "./renderers/something-different.js";
import "./runtime/battle/opponents/manifest.js";

drawLoadingText();
establishMapLinks();

function loadCallback() {
    BitmapText.verifyBitmap();
    let firstRendererState;
    switch(ENV_FLAGS.TEST) {
        case "drag-test":
            firstRendererState = new DragTestRenderer();
            break;
        case "something-different":
            firstRendererState = new SomethingDifferentRenderer(
                null,null,getOpponent("test-battle")
            );
            break;
        default:
            firstRendererState = new MainMenuRenderer();
            break;
    }
    setRendererState(firstRendererState);
    startRenderer();
    if(rendererState.song) {
        playMusic(rendererState.song);
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
