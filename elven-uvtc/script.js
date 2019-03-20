"use strict";

drawLoadingText();

function loadCallback() {
    setRendererState(
        new WorldRenderer(worldMaps["checker-test"])

        /*
        new CardScreenRenderer(
            new CardSequencer([...allCardSeries[0].cards],[allCards["red apple"],allCards["red apple"],allCards["red apple"],allCards["red apple"],allCards["red apple"],allCards["red apple"]],{
                getActionData: (sequencer,me) => {
                    return {
                        type: "useCard",
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
        )*/
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
