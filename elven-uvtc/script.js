"use strict";
import MainMenuRenderer from "./renderers/main-menu.js";
import BoxFaderEffect from "./renderers/components/box-fader-effect.js";
import DragTestRenderer from "./renderers/drag-test.js";
import FistBattleRenderer from "./renderers/fist-battle.js";
import WorldRenderer from "./renderers/world.js";
import "./runtime/battle/opponents/manifest.js";
import SwapTestRenderer from "./renderers/swap-test.js";

drawLoadingText();
establishMapLinks();

function loadCallback() {
    BitmapText.verifyBitmap();
    let firstRendererState;
    if(ENV_FLAGS.TEST === "auto") {
        if(ENV_FLAGS.DEBUG_MAP) {
            ENV_FLAGS.TEST = "world";
        } else if(ENV_FLAGS.DEBUG_BATTLE) {
            ENV_FLAGS.TEST = "battle";
        }
    }
    switch(ENV_FLAGS.TEST) {
        case "swap":
            firstRendererState = new SwapTestRenderer();
            break;
        case "drag":
        case "drag-test":
            firstRendererState = new DragTestRenderer();
            break;
        case "fisting":
        case "battle":
        case "fist-battle":
            let testBattle = ENV_FLAGS.DEBUG_BATTLE;
            if(!testBattle) {
                testBattle = "wimpy-red-elf";
            }
            firstRendererState = new FistBattleRenderer(
                ()=>alert("Player won!"),()=>alert("Opponent won!"),getOpponent(testBattle)
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
        rendererState.updateSize();
        startRenderer();
        pauseRenderer();
        drawLoadingText();
        rendererState.customLoader(()=>{
            resumeRenderer();
            if(rendererState.faderCompleted) {
                rendererState.faderCompleted();
            }
            rendererState.updateSize();
        });
    } else {
        const loadCallback = () => {
            startRenderer();
            if(rendererState.faderCompleted) {
                rendererState.faderCompleted();
            }
            if(rendererState.song) {
                if(rendererState.songIntro) {
                    playMusicWithIntro(rendererState.song,rendererState.songIntro)
                } else {
                    playMusic(rendererState.song);
                }
            }
        }
        let loadedSong = true;
        let loadedIntro = true;
        if(rendererState.song) {
            if(!audioBuffers[rendererState.song] && !failedBuffers[rendererState.song]) {
                loadSongOnDemand(rendererState.song);
                loadedSong = false;
            }
        }
        if(rendererState.songIntro) {
            if(!audioBuffers[rendererState.songIntro] && !failedBuffers[rendererState.songIntro]) {
                loadSongOnDemand(rendererState.songIntro);
                loadedIntro = false;
            }
        }
        if(loadedSong && loadedIntro) {
            loadCallback();
        } else {
            audioBufferAddedCallback = function(name) {
                if(name === rendererState.song) {
                    loadedSong = true;
                }
                if(name === rendererState.songIntro) {
                    loadedIntro = true;
                }
                if(loadedSong && loadedIntro) {
                    audioBufferAddedCallback = null;
                    loadCallback();
                }
            }
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
