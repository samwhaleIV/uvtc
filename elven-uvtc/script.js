"use strict";

drawLoadingText();

function loadCallback() {
    setRendererState(
        new CardScreenRenderer(
            new CardSequencer([...allCardsList],[...allCardsList],{
                getActionData: (sequencer,me) => {
                    return {
                        type: "discard",
                        cardIndex: 0
                    }
                }
            }),
            {
                win: ()=>{},
                lose: ()=>{},
                quit: ()=>{}
            },
            new CardBackground("backgrounds/deck-background")
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
