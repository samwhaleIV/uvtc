"use strict";

drawLoadingText();

function loadCallback() {
    setRendererState(
        new CardScreenRenderer(
            new CardSequencer([],[],null),
            {
                win: ()=>{},
                lose: ()=>{},
                quit: ()=>{}
            },
            new CardBackground("card-test")
        )
    );
    startRenderer();
}

setPageTitle("uvtc - PROTOTYPE CONTENT");
setImageIndexMode(IndexModes.LoseRoot);
ImageManager.loadImages(loadCallback);
SoundManager.loadSounds(loadCallback);
SoundManager.loadNonEssentialSounds();

//setFaderOutSound("swish-1");
//setFaderInSound("swish-2");
//setFaderEffectsRenderer(new Effect());
setFaderDelay(0);
setFaderDuration(0);
