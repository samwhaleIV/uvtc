"use strict";
import MainMenuRenderer from "./renderers/main-menu.js";
import BoxFaderEffect from "./renderers/components/box-fader-effect.js";

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

setPageTitle("UVTC: Pre-alpha");
setImageIndexMode(IndexModes.LoseRoot);
ImageManager.loadImages(loadCallback);
SoundManager.loadSounds(loadCallback);
SoundManager.loadNonEssentialSounds();

//setFaderOutSound("swish-1");
//setFaderInSound("swish-2");
setFaderEffectsRenderer(new BoxFaderEffect());
if(ENV_FLAGS.FAST_AS_FUCK_TRANSITIONS) {
    setFaderDelay(60);
    setFaderDuration(60);
    setMusicFadeDuration(60);
} else {
    setFaderDelay(600);
    setFaderDuration(1000);
    setMusicFadeDuration(1000);
}
