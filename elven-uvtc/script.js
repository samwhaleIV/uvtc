"use strict";
import MainMenuRenderer from "./renderers/main-menu.js";
import BoxFaderEffect from "./renderers/components/box-fader-effect.js";
import "./runtime/battle/opponents/manifest.js";

drawLoadingText();
establishMapLinks();

function loadCallback() {
    BitmapText.verifyBitmap();
    setRendererState(new MainMenuRenderer());
    startRenderer();
    if(rendererState.song) {
        playMusic(rendererState.song);
    }
}

setPageTitle("UVTC: Early Alpha");
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
