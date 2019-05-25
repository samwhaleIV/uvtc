"use strict";
import MainMenuRenderer from "./renderers/main-menu.js";
import BoxFaderEffect from "./renderers/components/box-fader-effect.js";

drawLoadingText();

function loadCallback() {
    setRendererState(new MainMenuRenderer());
    startRenderer();
}

setPageTitle("UVTC: Pre-alpha");
setImageIndexMode(IndexModes.LoseRoot);
ImageManager.loadImages(loadCallback);
SoundManager.loadSounds(loadCallback);
SoundManager.loadNonEssentialSounds();

//setFaderOutSound("swish-1");
//setFaderInSound("swish-2");
setFaderEffectsRenderer(new BoxFaderEffect());
setFaderDelay(2000);
setFaderDuration(1000);
