import WorldRenderer from "../../../elven-engine/renderers/world.js";
import WorldUIRenderer from "./world-ui.js";
import MovePreview from "./components/world/move-preview.js";
import Moves from "../runtime/battle/moves.js";
import Chapters from "../runtime/chapters.js";
import BattleFaderEffect from "./components/battle-fader-effect.js";
import MainMenuRenderer from "./main-menu.js";
import ElvesFillIn from "./components/elves-fill-in.js";
import BoxFaderEffect from "./components/box-fader-effect.js";
import FistBattleRenderer from "./fist-battle.js";
import FastStaticWrapper from "./components/fast-static-wrapper.js";
import ChapterManager from "../runtime/chapter-manager.js";
import MovesManager from "../runtime/moves-manager.js";

const FILM_GRAIN_EFFECT = new FastStaticWrapper(1,()=>{
    const shade = Math.floor(256 * Math.random());
    return `rgba(${shade},${shade},${shade},0.1)`;
},maxHorizontalResolution*2,4,100);

const CHAPTER_NAME_LOOKUP = [
    "an impossible chapter that cannot exist",
    "one","two","three","four","five","six",
    "seven","eight","nine","ten","eleven",
    "twelve","thirteen","fourteen",
    "fifteen","sixteen","seventeen"
];

const FINAL_CHAPTER_NUMBER = 12;
const CHAPTER_COMPLETE_SOUND_SOUND_BY_DEFAULT = false;
const getDefaultChapterState = () => {
    return {
        load: null,
        mapChanged: null,
        unload: null
    };
};

function UVTCWorldRenderer(...parameters) {
    WorldRenderer.apply(this,parameters);
    this.chapterManager = ChapterManager;
    this.movesManager = MovesManager;

    this.setTilesetImage("world-tileset");

    const activeChapter = this.globalState.activeChapter;
    const chapter = Chapters[activeChapter-1];
    const chapterName = `chapter ${CHAPTER_NAME_LOOKUP[activeChapter]}`;
    let chapterState = null;
    if(chapter.chapterState) {
        chapterState = new chapter.chapterState();
    } else {
        chapterState = getDefaultChapterState();
    }

    this.firstTimeLoad = () => {
        if(this.chapterState.load) {
            this.chapterState.load(this);
        }
    }
    this.mapChanged = () => {
        if(this.chapterState.mapChanged) {
            this.chapterState.mapChanged(this.map);
        }
    }
    this.loadLastMapOrDefault = () => {
        let lastMap, lp, debugPosition;
        if(ENV_FLAGS.DEBUG_MAP) {
            if(typeof ENV_FLAGS.DEBUG_MAP === "string") {
                lastMap = ENV_FLAGS.DEBUG_MAP;
                if(this.globalState["last_map"] !== lastMap) {
                    debugPosition = true;
                }
            } else {
                lastMap = ENV_FLAGS.DEBUG_MAP.name;
                if(ENV_FLAGS.DEBUG_MAP.position) {
                    lp = ENV_FLAGS.DEBUG_MAP.position;
                    if(isNaN(lp.x)) lp.x = 0;
                    if(isNaN(lp.y)) lp.y = 0;
                    if(!lp.d) lp.d = "down";
                    debugPosition = true;
                }
            }
        } else {
            lastMap = this.globalState["last_map"]; 
        }
        if(lastMap) {
            this.updateMap(lastMap);
            if(!debugPosition) {
                lp = this.globalState["last_player_pos"];
            }
            if(lp) {
                return () => {
                    if(this.internalPlayerObject && !this.internalPlayerObject.forcedStartPosition) {
                        this.moveObject(this.internalPlayerObject.ID,lp.x,lp.y,true);
                        this.internalPlayerObject.updateDirection(lp.d);
                    }
                }
            }
        } else {
            let startMap = this.chapter && this.chapter.startMap ? this.chapter.startMap : null;
            if(!startMap) {
                startMap = FALLBACK_MAP_ID;
                console.warn(`World: Using a fallback map because chapter ${this.activeChapter} is missing a start map`);
            }
            this.updateMap(startMap);
        }
        return null;
    }

    this.escapeMenu = new WorldUIRenderer(this);

    Object.defineProperty(this,"filmGrainEffect",{
        get: function(){return FILM_GRAIN_EFFECT}
    });

    Object.defineProperty(this,"activeChapter",{
        get: function() {return activeChapter}
    });
    Object.defineProperty(this,"chapterName",{
        get: function() {return chapterName}
    });
    Object.defineProperty(this,"chapter",{
        get: function() {return chapter}
    });
    Object.defineProperty(this,"chapterState",{
        get: function() {return chapterState}
    });

    this.someoneIsNowYourFriend = (character,customString) => {
        if(customString) {
            this.formatStringWithCharacter(character,customString);
        } else {
            return this.showInstantPopupSound(`Congratulations! ${character.coloredName} is now your friend!`);
        }
    }

    this.gameOver = async (noDelay=false) => {
        if(!noDelay) {
            await delay(500);
        }
        this.addCustomRenderer(new FadeOut(2000));
        await delay(5000);
        setFaderEffectsRenderer(new BoxFaderEffect());
        faderEffectsRenderer.fillInLayer = new ElvesFillIn();
        this.managedFaderTransition(WorldRenderer);
    }
    this.startBattle = (battleID,winCallback,loseCallback,...battleParameters) => {
        this.saveState(true,false);
        setFaderEffectsRenderer(new BattleFaderEffect());
        setFaderInSound("battle-fade-in",true);
        setFaderOutSound("battle-fade-out",true);
        function returnToWorld() {
            setFaderInSound("battle-fade-in",true);
            setFaderOutSound("battle-fade-out",true);
            rendererState.fader.fadeOut(WorldRenderer);
        }
        function win(battleOutput) {
            if(winCallback) {
                winCallback(battleOutput);
            }
            returnToWorld();
        }
        function lose(battleOutput) {
            if(loseCallback) {
                loseCallback(battleOutput);
            }
            returnToWorld();
        }
        const opponent = getOpponent(battleID,...battleParameters);
        this.managedFaderTransition(FistBattleRenderer,win,lose,opponent);
    }

    this.chapterComplete = async (noSound=!CHAPTER_COMPLETE_SOUND_SOUND_BY_DEFAULT) => {
        const method = noSound ? this.showInstantPopup : this.showInstantPopupSound;
        this.addCustomRenderer(new FadeOut(2000));
        this.addCustomRenderer(new this.ImagePreview(
            `ui/chapters/${chapterID}`,this.getItemPreviewBounds)
        );
        ChapterManager.setActiveChapterCompleted();
        let message = null;
        if(activeChapter === FINAL_CHAPTER_NUMBER) {
            message = `Good job. This is it. Your journey has reached its end... Or is this merely the beginning?`;
        } else {
            message = `Good job. You completed ${chapterName}! Onwards and upwards...`;
        }
        setFaderEffectsRenderer(new BoxFaderEffect());
        faderEffectsRenderer.fillInLayer = new ElvesFillIn();

        await method(message);
        this.managedFaderTransition(MainMenuRenderer,true);
    }

    this.unlockSlot = moveName => {
        return new Promise(async resolve => {
            const alreadyHasMove = this.movesManager.hasMove(moveName);
            const move = Moves[moveName];
            if(!alreadyHasMove) {
                this.movesManager.unlockMove(moveName);
            }
            const movePreviewID = this.addCustomRenderer(
                new MovePreview(moveName,this.getItemPreviewBounds,false)
            );
            let messages = [
                `You received ${moveName}, a ${alreadyHasMove?"":"new "}${move.type} slot!`
            ];
            playSound("energy");
            await this.showInstantPopups(messages);
            this.removeCustomRenderer(movePreviewID);
            resolve();
        });
    }
}
export default UVTCWorldRenderer;
