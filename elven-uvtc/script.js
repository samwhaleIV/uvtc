"use strict";
import MainMenuRenderer from "./renderers/main-menu.js";
import BoxFaderEffect from "./renderers/components/box-fader-effect.js";
import FistBattleRenderer from "./renderers/fist-battle.js";
import WorldRenderer from "./renderers/world.js";
import SwapTestRenderer from "../../elven-engine/renderers/swap-test.js";
import GradeTestRenderer from "../../elven-engine/renderers/grade-test.js";
import DragTestRenderer from "../../elven-engine/renderers/drag-test.js";
import "./runtime/battle/opponents/manifest.js";

drawLoadingText();
establishMapLinks();

function loadCallback() {
    BitmapText.verifyBitmap();
    let firstRendererState, parameters = [];
    if(ENV_FLAGS.TEST === "auto") {
        if(ENV_FLAGS.DEBUG_MAP) {
            ENV_FLAGS.TEST = "world";
        } else if(ENV_FLAGS.DEBUG_BATTLE) {
            ENV_FLAGS.TEST = "battle";
        }
    }
    switch(ENV_FLAGS.TEST) {
        case "grade":
            firstRendererState = GradeTestRenderer;
            break;
        case "swap":
            firstRendererState = SwapTestRenderer;
            break;
        case "drag":
        case "drag-test":
            firstRendererState = DragTestRenderer;
            break;
        case "fisting":
        case "battle":
        case "fist-battle":
            let testBattle = ENV_FLAGS.DEBUG_BATTLE;
            if(!testBattle) {
                testBattle = "wimpy-red-elf";
            }
            firstRendererState = FistBattleRenderer;
            parameters.push(()=>alert("Player won!"),()=>alert("Opponent won!"),getOpponent(testBattle));
            break;
        case "world":
            if(!ENV_FLAGS.DEBUG_MAP) {
                ENV_FLAGS.DEBUG_MAP = FALLBACK_MAP_ID;
            }
            firstRendererState = WorldRenderer;
            break;
        case "none":
        default:
            firstRendererState = MainMenuRenderer;
            break;
    }
    const boxFaderEffect = new BoxFaderEffect();
    setRendererState({
        noPixelScale: true,
        disableAdaptiveFill: true,
        render: function(){
            drawLoadingText()
        }
    });
    startRenderer();
    setFaderEffectsRenderer({render:function(){}});
    rendererState.fader.fadeOut(firstRendererState,...parameters);
    rendererState.fader.didSetRendererState = () => {
        if(rendererState.song && !rendererState.songIntro) {
            const fancyEncodingData = SongsWithTheNewFancyIntroEncoding[
                rendererState.song
            ];
            if(fancyEncodingData) {
                rendererState.fancyEncodingData = fancyEncodingData;
            }
        }
        let oldFaderComplete = null;
        if(rendererState.faderCompleted) {
            oldFaderComplete = rendererState.faderCompleted.bind(rendererState);
        }
        rendererState.faderCompleted = () => {
            if(oldFaderComplete) {
                oldFaderComplete();
            }
            if(ENV_FLAGS.FAST_AS_FUCK_TRANSITIONS) {
                setFaderDelay(60);
                setFaderDuration(60);
                setMusicFadeDuration(60);
            } else {
                setFaderDelay(600);
                setFaderDuration(1700);
                setMusicFadeDuration(1000);
            }
            setFaderEffectsRenderer(boxFaderEffect);
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

setFaderDelay(0);
setFaderDuration(musicFaderSafetyBuffer);
setMusicFadeDuration(0);
