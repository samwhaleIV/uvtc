import PlayerController from "../runtime/player-controller.js";
import { PlayerRenderer, SpriteRenderer, ElfRenderer } from "./components/world/sprite.js";
import TileSprite from "./components/world/tile-sprite.js";
import WorldPopup from "./components/world/popup.js";
import WorldPrompt from "./components/world/prompt.js";
import GlobalState from "../runtime/global-state.js";
import GetOverworldCharacter from "../runtime/character-creator.js";
import WorldUIRenderer from "./world-ui.js";
import UIAlert from "./components/ui-alert.js";
import MovesManager from "../runtime/moves-manager.js";
import MovePreview from "./components/world/move-preview.js";
import ChapterPreview from "./components/world/chapter-preview.js";
import Moves from "../runtime/battle/moves.js";
import Chapters from "../runtime/chapters.js";
import BattleFaderEffect from "./components/battle-fader-effect.js";
import ChapterManager from "../runtime/chapter-manager.js";
import MainMenuRenderer from "./main-menu.js";
import ElvesFillIn from "./components/elves-fill-in.js";
import {FadeIn,FadeOut} from "./components/world/fade.js";
import ObjectiveHUD from "./components/world/objective-hud.js";
import BoxFaderEffect from "./components/box-fader-effect.js";
import ApplyTimeoutManager from "./components/inline-timeout.js";
import FistBattleRenderer from "./fist-battle.js";
import MultiLayer from "./components/multi-layer.js";
import FastStaticWrapper from "./components/fast-static-wrapper.js";

const filmGrainEffect = new FastStaticWrapper(1,()=>{
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

const ALERT_TIME = 1000;
const ANIMATION_TILE_COUNT = 5;
const ANIMATION_CYCLE_DURATION = 400;
const ANIMATION_FRAME_TIME = ANIMATION_CYCLE_DURATION / ANIMATION_TILE_COUNT;
const POPUP_TIMEOUT = 150;
const NEGATIVE_INFINITY_BUT_NOT_REALLY = -1000000;

const FINAL_CHAPTER_NUMBER = 12;
const CHAPTER_COMPLETE_SOUND_SOUND_BY_DEFAULT = false;

const TILESET_NAME = "world-tileset";

function WorldRenderer() {

    const activeChapter = GlobalState.data.activeChapter;
    const chapter = Chapters[activeChapter-1];
    const chapterName = `chapter ${CHAPTER_NAME_LOOKUP[activeChapter]}`;

    let chapterState = null;
    if(chapter.chapterState) {
        chapterState = new chapter.chapterState();
    } else {
        chapterState = {
            load: null,
            mapChanged: null,
            unload: null
        };
    }

    this.filmGrainEffect = filmGrainEffect;

    Object.defineProperty(this,"activeChapter",{
        get: function() {
            return activeChapter;
        }
    });
    Object.defineProperty(this,"chapterName",{
        get: function() {
            return chapterName;
        }
    });
    Object.defineProperty(this,"chapter",{
        get: function() {
            return chapter;
        }
    });
    Object.defineProperty(this,"chapterState",{
        get: function() {
            return chapterState;
        }
    });

    let alert = null;
    let objectiveHUD = null;

    ApplyTimeoutManager(this);

    this.showAlert = (message,duration=ALERT_TIME,noSound=false) => {
        alert = new UIAlert(message.toLowerCase(),duration,noSound);
    }
    this.clearAlert = () => {
        alert = null;
    }
    Object.defineProperty(this,"globalState",{
        get: function() {
            return GlobalState.data;
        }
    });
    const safeFade = (duration,fadeIn) => {
        return new Promise(resolve => {
            const fader = fadeIn ? FadeIn : FadeOut;
            let ID;
            ID = this.addCustomRenderer(new fader(duration,null,()=>{
                resolve(ID);
            }));
        });
    }

    this.setObjectiveHUD = (...parameters) => {
        objectiveHUD = new ObjectiveHUD(this,...parameters);
        return objectiveHUD;
    }
    this.clearObjectiveHUD = () => {
        objectiveHUD = null;
    }

    this.fadeFromBlack = async duration => {
        return safeFade(duration,true);
    }
    this.fadeToBlack = async duration => {
        return safeFade(duration,false);
    }

    this.managedFaderTransition = (...parameters) => {
        this.postProcessor.terminate();
        if(this.map.unload) {
            this.map.unload(this);
        }
        if(chapterState.unload) {
            chapterState.unload(this);
        }
        this.fader.fadeOut(...parameters);
    }

    this.chapterComplete = async (noSound=!CHAPTER_COMPLETE_SOUND_SOUND_BY_DEFAULT) => {
        const method = noSound ? this.showInstantPopup : this.showInstantPopupSound;
        this.addCustomRenderer(new FadeOut(2000));
        this.addCustomRenderer(new ChapterPreview(activeChapter,this.getItemPreviewBounds));
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

    let internalPlayerObject = null;
    let pendingPlayerObject = null;
    this.saveState = (withPositionData=true,skipGlobal=false) => {
        if(withPositionData && internalPlayerObject) {
            GlobalState.data["last_map"] = this.renderMap.name;
            GlobalState.data["last_player_pos"] = {
                d: internalPlayerObject.direction,
                x: Math.round(internalPlayerObject.x + internalPlayerObject.xOffset),
                y: Math.round(internalPlayerObject.y + internalPlayerObject.yOffset)
            }
        }
        if(!skipGlobal) {
            GlobalState.save();
        }
    };
    const loadLastMapOrDefault = () => {
        let lastMap, lp, debugPosition;
        if(ENV_FLAGS.DEBUG_MAP) {
            if(typeof ENV_FLAGS.DEBUG_MAP === "string") {
                lastMap = ENV_FLAGS.DEBUG_MAP;
                if(GlobalState.data["last_map"] !== lastMap) {
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
            lastMap = GlobalState.data["last_map"]; 
        }
        if(lastMap) {
            this.updateMap(lastMap);
            if(!debugPosition) {
                lp = GlobalState.data["last_player_pos"];
            }
            if(lp) {
                return () => {
                    if(internalPlayerObject && !internalPlayerObject.forcedStartPosition) {
                        this.moveObject(internalPlayerObject.ID,lp.x,lp.y,true);
                        internalPlayerObject.updateDirection(lp.d);
                    }
                }
            }
        } else {
            let startMap = chapter.startMap ? chapter.startMap : null;
            if(!startMap) {
                startMap = FALLBACK_MAP_ID;
                console.warn(`World: Using a fallback map because chapter ${activeChapter} is missing a start map start map`);
            }
            this.updateMap(startMap);
        }
        return null;
    }
    let ranCustomLoader = false;
    this.customLoader = (callback,fromMapUpdate=false,sourceRoom) => {
        const callbackWithMapPost = (firstTime=false) => {
            this.updateCamera(performance.now(),playerInteractionLocked());
            if(this.map.start) {
                if(firstTime) {
                    this.faderCompleted = () => {
                        this.map.start(this);
                    };
                } else {
                    this.map.start(this);
                }
            } else {
                this.unlockPlayerMovement();
            }
            callback();
        }
        this.lockPlayerMovement();
        const startTime = performance.now();
        let loadPlayer = null;
        const finishedLoading = () => {
            const endTime = performance.now();
            const realTimeSpentLoading = endTime - startTime;
            const firstTime = !ranCustomLoader;
            if(!fromMapUpdate && chapterState.load) {
                chapterState.load(this);
            }
            this.updateMapEnd();
            if(!fromMapUpdate) {
                if(loadPlayer) {
                    loadPlayer();
                }
                ranCustomLoader = true;
            }
            if(firstTime || sourceRoom === this.renderMap.songParent || worldMaps[sourceRoom].songParent === this.renderMap.name) {
                callbackWithMapPost(firstTime);
            } else {
                const fakeDelay = FAKE_OVERWORLD_LOAD_TIME - realTimeSpentLoading;
                if(fakeDelay > 0) {
                    setTimeout(callbackWithMapPost,fakeDelay);
                } else {
                    callbackWithMapPost(firstTime);
                }
            }
        }
        if(!fromMapUpdate) {
            loadPlayer = loadLastMapOrDefault();
        }
        let requiredSongs = this.renderMap.requiredSongs ?
            this.renderMap.requiredSongs : this.renderMap.songParent ?
                worldMaps[this.renderMap.songParent].requiredSongs : null;

        if(requiredSongs) {
            requiredSongs = requiredSongs.slice();
        }

        const roomSong = this.renderMap.roomSong ?
            this.renderMap.roomSong : this.renderMap.songParent ?
                worldMaps[this.renderMap.songParent].roomSong : null;

        if(!requiredSongs && roomSong) {
            requiredSongs = [roomSong];
        } else if(requiredSongs && roomSong) {
            let containsRoomSong = false;
            for(let i = 0;i<requiredSongs.length;i++) {
                if(requiredSongs[i] === roomSong) {
                    containsRoomSong = true;
                    break;
                }
            }
            if(!containsRoomSong) {
                requiredSongs.push(roomSong);
            }
        }
        if(requiredSongs) {
            let loadedSongs = 0;
            const songNames = {};
            requiredSongs.forEach(song => {
                const introSong = SONG_INTRO_LOOKUP[song];
                if(introSong) {
                    requiredSongs.push(introSong);
                }
            });
            const totalSongs = requiredSongs.length;
            const callbackIfReady = () => {
                if(loadedSongs === totalSongs) {
                    audioBufferAddedCallback = null;
                    finishedLoading();
                }
            }
            audioBufferAddedCallback = name => {
                if(songNames[name]) {
                    loadedSongs++;
                    callbackIfReady();
                }
            };
            requiredSongs.forEach(song => {
                songNames[song] = true;
                if(audioBuffers[song] || failedBuffers[song]) {
                    loadedSongs++;
                } else {
                    loadSongOnDemand(song);
                }
            });
            callbackIfReady();
        } else {
            finishedLoading();
        }
    }
    this.restoreState = (ignorePositionData=false) => {
        GlobalState.restore();
        if(ignorePositionData) {
            return;
        }
        loadLastMapOrDefault();
    }
    this.tileSprite = (function(world){
        return function(...parameters) {
            TileSprite.apply(this,parameters);
            this.move = async (...steps) => await world.moveSprite(this.ID,steps);
            this.say = world.showPopup;
            this.alert = () => {
                throw Error("Tile sprites don't support the alert function!");
            }
            this.setWalking = () => void undefined;
            this.updateDirection = () => void undefined;
        }
    })(this);
    this.sprite = SpriteRenderer;
    this.elfSprite = ElfRenderer;
    this.getTileSprite = tileID => new this.tileSprite(tileID);
    this.getCharacter = (name,direction) => GetOverworldCharacter(this,name,direction,false);
    this.getStaticCharacter = name => GetOverworldCharacter(this,name,null,true);
    this.movesManager = MovesManager;
    this.chapterManager = ChapterManager;

    this.someoneIsNowYourFriend = (character,customString) => {
        if(customString) {
            const message = customString.replace("{NAME}",character.coloredName);
            return this.showInstantPopupSound(message);
        } else {
            return this.showInstantPopupSound(`Congratulations! ${character.coloredName} is now your friend!`);
        }
    }

    this.getItemPreviewBounds = () => {

        const x = 10;
        const width = fullWidth - 10;

        let y = 10;
        let height = fullHeight - 10;
        
        if(this.popup) {
            if(objectiveHUD) {
                const objectiveHUDBottom = objectiveHUD.getBottom();
                y += objectiveHUDBottom;
                height -= objectiveHUDBottom;
            }
            height -= fullHeight - this.popup.startY + 10;
        } else if(objectiveHUD) {
            const objectiveHUDBottom = objectiveHUD.getBottom();
            y += objectiveHUDBottom;
            height -= objectiveHUDBottom;
        } else {
            y = 10;
            height = fullHeight - 10;
        }

        return {
            x:x,y:y,width:width,height:height
        }
    }

    this.unlockMove = moveName => {
        return new Promise(async resolve => {
            const alreadyHasMove = this.movesManager.hasMove(moveName);
            const move = Moves[moveName];
            if(!alreadyHasMove) {
                this.movesManager.unlockSlot(moveName);
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

    this.camera = {
        x: 10,
        y: 10,
        xOffset: 0,
        yOffset: 0
    }

    const collisionTriggers = {
        3: true,
        4: true,
        5: true,
        6: true,
        7: true
    }
    const collisionTriggerOffset = -2;

    this.playerController = new PlayerController(this);

    Object.defineProperty(this,"playerObject",{
        get: function() {
            if(pendingPlayerObject) {
                return pendingPlayerObject;
            } else {
                return internalPlayerObject;
            }
        },
        set: function(value) {
            internalPlayerObject = value;
            this.playerController.player = value;
        }
    });
    this.popup = null;
    this.prompt = null;

    const customRendererStackIDLIFO = [];

    const customRendererStack = new MultiLayer();
    this.addCustomRenderer = customRenderer => {
        return customRendererStack.addLayer(customRenderer);
    }
    this.removeCustomRenderer = ID => {
        customRendererStack.removeLayer(ID);
    }
    this.pushCustomRenderer = customRenderer => {
        const ID = customRendererStack.addLayer(customRenderer);
        customRendererStackIDLIFO.push(ID);
        return ID;
    }
    this.popCustomRenderer = () => {
        const ID = customRendererStackIDLIFO.pop();
        if(ID !== undefined) {
            customRendererStack.removeLayer(ID);
        }
    }
    this.clearCustomRendererStack = () => {
        customRendererStack.clearLayers();
        customRendererStackIDLIFO.splice(0);
    }

    let playerMovementLocked = false;

    const escapeMenu = new WorldUIRenderer(this);
    let escapeMenuShown = false;
    this.escapeMenuDisabled = false;

    let popupActive = false;

    const playerInteractionLocked = () => {
        return playerMovementLocked || escapeMenuShown || popupActive || this.prompt ? true : false;
    }

    this.playerInteractionLocked = playerInteractionLocked;

    this.lockPlayerMovement = function() {
        playerMovementLocked = true;
    }
    this.unlockPlayerMovement = function() {
        playerMovementLocked = false;
    }

    let wDown = false;
    let sDown = false;
    let aDown = false;
    let dDown = false;
    let enterReleased = true; 

    this.popupProgressEnabled = true;

    const escapeMenuDisabled = () => {
        return this.escapeMenuDisabled || playerInteractionLocked();
    }

    let i = 0;
    this.processKey = function(key) {
        if(key !== kc.accept) {
            this.playerController.processKey(key);
        }
        if(escapeMenuShown) {
            escapeMenu.processKey(key);
            return;
        }
        if(this.prompt) {
            switch(key) {
                case kc.accept:
                    if(enterReleased) {
                        this.prompt.confirmSelection();
                        enterReleased = false;
                        return;
                    } else {
                        return;
                    }
                case kc.up:
                    if(wDown) {
                        return;
                    }
                    this.prompt.moveSelection("up");
                    break;
                case kc.down:
                    if(sDown) {
                        return;
                    }
                    this.prompt.moveSelection("down");
                    break;
                case kc.left:
                    if(aDown) {
                        return;
                    }
                    this.prompt.moveSelection("left");
                    break;
                case kc.right:
                    if(dDown) {
                        return;
                    }
                    this.prompt.moveSelection("right");
                    break;
            }
        } else if(this.popup) {
            if(key === kc.accept) {
                if(enterReleased) {
                    if(this.popupProgressEnabled) {
                        this.popup.progress();
                    }
                    enterReleased = false;
                } else {
                    return;
                }
            }
        } else if(internalPlayerObject) {
            if(key === kc.accept && enterReleased) {
                if(enterReleased) {
                    enterReleased = false;
                    this.playerController.processKey(key);
                } else {
                    return;
                }
            }
        } else if(key === kc.accept) {
            enterReleased = false;
            return;
        }
        switch(key) {
            case kc.up:
                wDown = true;
                return;
            case kc.down:
                sDown = true;
                return;
            case kc.left:
                aDown = true;
                return;
            case kc.right:
                dDown = true;
                return;
        }
    }
    this.processKeyUp = function(key) {
        this.playerController.processKeyUp(key);
        if(escapeMenuShown) {
            escapeMenu.processKeyUp(key);
            return;
        }
        switch(key) {
            case kc.up:
                wDown = false;
                return;
            case kc.down:
                sDown = false;
                return;
            case kc.left:
                aDown = false;
                return;
            case kc.right:
                dDown = false;
                return;
            case kc.cancel:
                if(escapeMenuDisabled()) {
                    return;
                }
                escapeMenuShown = true;
                escapeMenu.show(()=>{
                    escapeMenuShown = false;
                });
                return;
            case kc.accept:
                enterReleased = true;
                return;
        }
    }
    this.processMove = function(x,y) {
        if(escapeMenuShown) {
            escapeMenu.processMove(x,y);
            return;
        }
    }
    this.processClick = function(x,y) {
        if(escapeMenuShown) {
            escapeMenu.processClick(x,y);
            return;
        }
    }
    this.processClickEnd = function(x,y) {
        if(escapeMenuShown) {
            escapeMenu.processClickEnd(x,y);
            return;
        }
    }

    this.allowKeysDuringPause = true;

    let lastPopupCleared = NEGATIVE_INFINITY_BUT_NOT_REALLY;
    this.clearTextPopup = () => {
        this.popup = null;
        lastPopupCleared = performance.now();
    }
    const showPopup = (pages,name=null,instant=false) => {
        popupActive = true;
        if(Array.isArray(pages)) {
            return new Promise(async resolve => {
                for(let i = 0;i<pages.length;i++) {
                    await showPopup(pages[i],name,instant);
                }
                resolve();
            });
        }
        const page = pages;
        return new Promise(async resolve => {
            if(performance.now() < lastPopupCleared + POPUP_TIMEOUT) {
                await delay(POPUP_TIMEOUT);
            }
            this.popup = new WorldPopup(
                [page],
                () => {
                    this.clearTextPopup();
                    resolve();
                    popupActive = false;
                },name,instant,this
            );
        });
    }
    this.showPopup =         page =>        showPopup([page]);
    this.showPopups =        pages =>       showPopup(pages);
    this.showInstantPopup =  page =>        showPopup([page],null,true);
    this.showInstantPopups = pages =>       showPopup(pages,null,true);
    this.showNamedPopup =   (page,name) =>  showPopup([page],name);
    this.showNamedPopups =  (pages,name) => showPopup(pages,name);
    this.showInstantPopupSound = page => {
        playSound("energy");
        return showPopup([page],null,true);
    }

    this.clearPrompt = () => {
        this.prompt = null;
    }
    this.showPrompt = (question,...options) => {
        return new Promise(resolve => {
            this.prompt = new WorldPrompt(question,options,selectionIndex => {
                this.clearPrompt();
                resolve(selectionIndex);
            });
        });
    }

    const outOfBounds = (x,y) => {
        return x < 0 || y < 0 || x > this.renderMap.finalColumn || y > this.renderMap.finalRow;
    }

    this.getTriggerState = function(x,y) {
        if(outOfBounds(x,y)) {
            return null;
        }
        const collisionType = this.renderMap.collision[getIdx(x,y)];
        if(collisionTriggers[collisionType]) {
            return collisionType + collisionTriggerOffset;
        }
        return null;
    }

    this.getCollisionState = function(x,y,ignoreNoCollide) {
        if(outOfBounds(x,y)) {
            return {map: 1, object: null};
        }
        let mapCollision = this.renderMap.collision[getIdx(x,y)];
        let objectCollision = this.objectsLookup[x][y];
        if(!ignoreNoCollide) {
            if((this.map.noCollide && this.map.noCollide[
                mapCollision
            ]) || collisionTriggers[
                mapCollision
            ])  {
                mapCollision = 0;
            }
            if(objectCollision && objectCollision.noCollide) {
                objectCollision = null;
            }
        } else if(collisionTriggers[mapCollision]) {
            mapCollision = 0;
        }
        return {
            map: mapCollision,
            object: objectCollision
        }
    }
    this.collides = function(x,y,exemptionID) {
        const collisionState = this.getCollisionState(x,y,false);
        if(exemptionID && collisionState.object) {
            if(exemptionID === collisionState.object.ID) {
                collisionState.object = null;
            }
        }
        return collisionState.map >= 1 || collisionState.object ? true : false;
    }

    let tileset = imageDictionary[TILESET_NAME];

    this.map = null;
    this.objects = {};
    this.objectsLookup = [];
    let offscreenObjects = [];
    let offscreenObjectCount = 0;

    let lastID = 0;
    const getNextObjectID = function() {
        return `world_object_${lastID++}`;
    }

    this.getObject = function(objectID) {
        return this.objects[objectID];
    }
    this.getObjectID = function(object) {
        return object.ID;
    }

    this.addPlayer = function(x,y,...parameters) {
        const newPlayer = new PlayerRenderer(...parameters);
        pendingPlayerObject = newPlayer;
        return this.addObject(newPlayer,x,y);
    }

    const removeOffScreenObject = objectID => {
        for(let i = 0;i<offscreenObjects.length;i++) {
            if(offscreenObjects[i].ID === objectID) {
                offscreenObjects.splice(i,1);
                offscreenObjectCount--;
                break;
            }
        }
    }

    const registerOffscreenToggler = object => {
        const startWithOffscreen = object.offscreenRendering ? true : false;
        let offscreenRendering = startWithOffscreen;
        let world = this;
        if(startWithOffscreen) {
            delete object.offscreenRendering;
        }
        Object.defineProperty(object,"offscreenRendering",{
            get: function() {
                return offscreenRendering;
            },
            set: function(value) {
                if(typeof value !== "boolean") {
                    throw TypeError("Value 'offscreenRendering' must be of type 'boolean'!");
                }
                if(offscreenRendering) {
                    if(!value) {
                        //turn off off screen rendering for this object
                        offscreenRendering = false;
                        removeOffScreenObject(object.ID);
                        let x = object.x, y = object.y;
                        if(x < 0) {
                            x = 0;
                        } else if(x > world.renderMap.finalColumn) {
                            x = world.renderMap.finalColumn;
                        }
                        if(y < 0) {
                            y = 0;
                        } else if(y > world.renderMap.finalRow) {
                            y = world.renderMap.finalRow;
                        }
                        object.x = null;
                        object.y = null;
                        world.moveObject(object.ID,x,y,false);
                    }
                } else if(value) {
                    //turn on off screen rendering for this object
                    offscreenRendering = true;
                    world.objectsLookup[object.x][object.y] = null;
                    offscreenObjects.push(object);
                    offscreenObjectCount++;

                }
            }
        });
        if(startWithOffscreen) {
            offscreenObjects.push(object);
            offscreenObjectCount++;
        }
    }

    const collisionResolution = (existingObject,newObject,x,y) => {
        if(!this.collides(x,y-1)) {
            this.objectsLookup[x][y-1] = newObject;
            newObject.y--;
        } else if(!this.collides(x+1,y)) {
            this.objectsLookup[x+1][y] = newObject;
            newObject.x++;
        } else if(!this.collides(x,y+1)) {
            this.objectsLookup[x][y+1] = newObject;
            newObject.y++;
        } else if(!this.collides(x-1,y)) {
            this.objectsLookup[x-1][y] = newObject;
            newObject.x--;
        } else {
            console.error("Error: Object collision could not find a resolution");
            this.objectsLookup[x][y] = newObject;
        }
    }

    this.addObject = function(object,x,y) {
        const objectID = getNextObjectID();
        object.ID = objectID;

        registerOffscreenToggler(object);

        if(!isNaN(x) && !isNaN(y)) {
            object.x = x;
            object.y = y;
            if(object.worldPositionUpdated) {
                object.worldPositionUpdated(x,y,x,y,this,true);
            }
        } else if(isNaN(object.x) || !isNaN(object.y)) {
            console.error("Error: An object was supplied to the world renderer without initial coordinates");
        }
        object.world = this;
        this.objects[objectID] = object;
        if(object.offscreenRendering) {
            return objectID;
        }

        const existingItem = this.objectsLookup[object.x][object.y];
        if(existingItem) {
            console.error("Warning: An object collision has occured through the add object method");
            console.log("Existing item",existingItem,"New item",object);
            collisionResolution(existingItem,object,object.x,object.y);
        } else {
            this.objectsLookup[object.x][object.y] = object;
        }
        return objectID;
    }
    const objectIDFilter = objectID => {
        if(typeof objectID === "object" && typeof objectID.ID === "string") {
            if(objectID.world !== this) {
                console.warn(`Object '${objectID.ID}' belongs to a different world!`);
            }
            return objectID;
        } else {
            return this.objects[objectID];
        }
    }
    this.removeObject = function(objectID) {
        const object = objectIDFilter(objectID);
        if(object.offscreenRendering) {
            removeOffScreenObject(object.ID);
        }
        if(object.isPlayer) {
            this.playerObject = null;
        }
        delete this.objects[object.ID];
        this.objectsLookup[object.x][object.y] = null;
    }
    this.moveObject = function(objectID,newX,newY,isInitialPosition=false) {
        const object = objectIDFilter(objectID);
        let oldX = object.x;
        let oldY = object.y;
        const hadNoPosition = oldX === null || oldY === null;
        if(hadNoPosition) {
            oldX = newX;
            oldY = newY;
            const oldObject = this.objectsLookup[oldX][oldY];
            if(oldObject) {
                console.error("Error: Shifting into this position loses an object on the lookup plane");
                console.log(`Position: ${newX},${newY}`,"Existing item",oldObject,"New item",object);
            }
        }
        if(object.offscreenRendering) {
            object.x = newX;
            object.y = newY;
            if(object.worldPositionUpdated) {
                object.worldPositionUpdated(oldX,oldY,newX,newY,this,isInitialPosition);
            }
            return;
        }
        if(!hadNoPosition) {
            this.objectsLookup[object.x][object.y] = null;
        }
        object.x = newX;
        object.y = newY;

        const existingObject = this.objectsLookup[object.x][object.y];
        if(existingObject) {
            console.warn("Warning: An object collision has occured through the move object method");
            console.log("Existing item",existingObject,"New item",object);
            collisionResolution(existingObject,object,newX,newY);
        } else {
            this.objectsLookup[object.x][object.y] = object;
        }
        if(object.worldPositionUpdated) {
            object.worldPositionUpdated(oldX,oldY,newX,newY,this,isInitialPosition);
        }
    }

    this.moveSprite = function(objectID,steps) {
        const object = objectIDFilter(objectID);
        let promiseResolver = null;
        const promise = new Promise(resolve=>promiseResolver=resolve);
        const world = this;
        let lastCallback = () => {
            object.setWalking(false);
            object.renderLogic = null;
            promiseResolver();
        }
        for(let i = steps.length-1;i>=0;i--) {
            (function(step,callback){
                if(step.x || step.y) {
                    lastCallback = () => {
                        let lastFrame = null, endValue, targetProperty, offsetProperty, xChangeRollover = 0,yChangeRollover = 0;
                        if(step.x) {
                            endValue = object.x + step.x;
                            targetProperty = "x";
                            if(step.x > 0) {
                                object.updateDirection("right");
                                xChangeRollover = 1;
                            } else {
                                object.updateDirection("left");
                                xChangeRollover = -1;
                            }
                        } else {
                            endValue = object.y + step.y;
                            targetProperty = "y";
                            if(step.y < 0) {
                                object.updateDirection("up");
                                yChangeRollover = -1;
                            } else {
                                object.updateDirection("down");
                                yChangeRollover = 1;
                            }
                        }
                        offsetProperty = targetProperty + "Offset";
                        const offsetRollover = xChangeRollover || yChangeRollover;
                        object.renderLogic = timestamp => {
                            if(!lastFrame) {
                                lastFrame = timestamp;
                                return;
                            }
                            const delta = timestamp - lastFrame;
                            lastFrame = timestamp;
                            let rolloverRequired;
                            const movementDifference = delta / 1000 * object.tilesPerSecond;
                            if(offsetRollover > 0) {
                                object[offsetProperty] += movementDifference;
                                rolloverRequired = object[offsetProperty] > 1;
                            } else {
                                object[offsetProperty] -= movementDifference;
                                rolloverRequired = object[offsetProperty] < -1;
                            }
                            if(rolloverRequired) {
                                object[offsetProperty] -= offsetRollover;
                                world.moveObject(object.ID,object.x+xChangeRollover,object.y+yChangeRollover,false);
                            }
                            if(endValue === object[targetProperty]) {
                                object[offsetProperty] = 0;
                                callback();
                            }
                        }
                    }
                } else {
                    lastCallback = () => {
                        object.renderLogic = null;
                        callback();
                    }
                }
                
            })(steps[i],lastCallback);
        }
        object.setWalking(true);
        lastCallback();
        return promise;
    }

    let tileRenderingEnabled = true;
    this.enableTileRendering = function() {
        tileRenderingEnabled = true;
    }
    this.disableTileRendering = function() {
        tileRenderingEnabled = false;
    }

    this.decals = [];
    this.addDecal = decal => {
        this.decals[decal.x][decal.y] = decal;
    }
    this.removeDecal = decal => {
        this.decals[decal.x][decal.y] = null;
    }

    const getIdx = (x,y) => x + y * this.renderMap.columns;

    const getLayer = (layer,x,y) => {
        return layer[getIdx[x,y]];
    }
    const changeLayer = (layer,value,x,y) => {
        layer[getIdx(x,y)] = value;
    }
    const isZeroFilter = value => value === 0;

    const changeLayerFilter = (layer,value,x,y,filter=isZeroFilter) => {
        const index = getIdx(x,y);
        if(filter(layer[index])) {
            layer[index] = value;
        }
    }

    let lightingLayerActive = false;
    const lightingLayerFilter = () => {
        if(lightingLayerFilter) {
            return this.renderMap.lighting;
        } else {
            throw Error("This map does not have a lighting layer!");
        }
    }

    this.getCollisionTile = (x,y) =>  getLayer(this.renderMap.collision,x,y);
    this.getForegroundTile = (x,y) => getLayer(this.renderMap.foreground,x,y);
    this.getBackgroundTile = (x,y) => getLayer(this.renderMap.background,x,y);
    this.getLightingTile = (x,y) =>   getLayer(lightingLayerFilter(),x,y);

    this.setCollisionTile =  (value,x,y) => changeLayer(this.renderMap.collision,value,x,y);
    this.setForegroundTile = (value,x,y) => changeLayer(this.renderMap.foreground,value,x,y);
    this.setBackgroundTile = (value,x,y) => changeLayer(this.renderMap.background,value,x,y);
    this.setLightingTile =   (value,x,y) => changeLayer(lightingLayerFilter(),value,x,y);

    this.setCollisionTileFilter =  (value,x,y,filter) => changeLayerFilter(this.renderMap.collision,value,x,y,filter);
    this.setForegroundTileFilter = (value,x,y,filter) => changeLayerFilter(this.renderMap.foreground,value,x,y,filter);
    this.setBackgroundTileFilter = (value,x,y,filter) => changeLayerFilter(this.renderMap.background,value,x,y,filter);
    this.setLightingTileFilter =   (value,x,y,filter) => changeLayerFilter(lightingLayerFilter(),value,x,y,filter);

    this.updateMapEnd = function() {
        pendingPlayerObject = null;
        if(this.map.load) {
            this.map.load(this);
        }
        if(this.map.getCameraStart) {
            this.camera = this.map.getCameraStart(this);
        }
        if(pendingPlayerObject) {
            this.playerObject = pendingPlayerObject;
        }
        pendingPlayerObject = null;
        if(chapterState.mapChanged) {
            chapterState.mapChanged(this.map);
        }
        this.restoreRoomSong();
    }
    this.stopMusic = callback => {
        fadeOutSongs(OVERWORLD_MUSIC_FADE_TIME,callback);
    }
    this.playSong = songName => {
        const playingSongFull = musicNodes[songName];
        const introName = SONG_INTRO_LOOKUP[songName];
        let playingIntro = false;
        if(introName) {
            playingIntro = musicNodes[introName] ? true : false;
        }
        if(!playingIntro && !playingSongFull) {
            let didRunCustomLoader = ranCustomLoader;
            this.stopMusic(()=>{
                const extraTime = !didRunCustomLoader ? faderTime / 2 : FAKE_OVERWORLD_LOAD_TIME;
                let songIntro = null;
                const fadeIn = () => {
                    let fadeInTarget;
                    if(songIntro !== null) {
                        fadeInTarget = songIntro;
                    } else {
                        fadeInTarget = songName;
                    }
                    const activeNode = musicNodes[fadeInTarget];
                    if(activeNode) {
                        const gainProperty = activeNode.volumeControl.gain;
                        gainProperty.setValueAtTime(0.001,audioContext.currentTime);
                        gainProperty.linearRampToValueAtTime(
                            1.0,
                            audioContext.currentTime+
                            OVERWORLD_MUSIC_FADE_TIME/1000
                        );
                    }
                }
                const enter_sandman = songName => {
                    const intro = SONG_INTRO_LOOKUP[songName];
                    if(intro && audioBuffers[intro]) {
                        songIntro = intro;
                        playMusicWithIntro(songName,intro);
                    } else {
                        const fancyEncodingData = SongsWithTheNewFancyIntroEncoding[songName];
                        if(fancyEncodingData) {
                            const introName = songName + MUSIC_INTRO_SUFFIX;
                            generateIntroFromBuffer(
                                songName,fancyEncodingData.introName,
                                fancyEncodingData.introLength,
                                fancyEncodingData.switchZoneLength
                            );
                            playMusicWithIntro(songName,introName);
                        } else {
                            playMusic(songName);
                        }
                    }
                    fadeIn();
                }
                if(extraTime) {
                    setTimeout(enter_sandman,extraTime,songName);
                } else {
                    enter_sandman(songName);
                }
            });
        }
    }
    this.restoreRoomSong = () => {
        const roomSong = this.renderMap.roomSong ?
            this.renderMap.roomSong : this.renderMap.songParent ?
                worldMaps[this.renderMap.songParent].roomSong : null;
        if(!roomSong) {
            this.stopMusic();
            return;
        }
        this.playSong(roomSong);
    }

    let cameraXFollowEnabled = true;
    let cameraYFollowEnabled = true;

    let backgroundRenderer = null;
    this.updateMap = function(newMapName,data={}) {
        console.log(`World: Loading '${newMapName}'`);
        enterReleased = true;
        const runLoadCode = ranCustomLoader;
        if(runLoadCode) {
            pauseRenderer();
            drawLoadingText();
        }
        if(this.renderMap) {
            data.sourceRoom = this.renderMap.name;
        }
        const newMap = worldMaps[newMapName];
        if(this.map) {
            if(this.map.unload) {
                this.map.unload(this);
            }
            if(this.map.scriptTerminator) {
                this.map.scriptTerminator(this);
            }
        }
        this.decals = [];
        this.objects = {};
        offscreenObjects = [];
        offscreenObjectCount = 0;
        this.playerObject = null;
        this.followObject = null;
        cameraXFollowEnabled = true;
        cameraYFollowEnabled = true;
        this.cameraFrozen = false;
        this.compositeProcessor = null;
        tileRenderingEnabled = true;
        this.clearCustomRendererStack();
        this.map = newMap.WorldState ? new newMap.WorldState(this,data):{};
        if(newMap.cameraStart) {
            this.camera.x = newMap.cameraStart.x;
            this.camera.y = newMap.cameraStart.y;
            this.camera.xOffset = 0;
            this.camera.yOffset = 0;
        }
        lightingLayerActive = false;
        this.renderMap = newMap;
        this.renderMap.background = newMap.baseData.background.slice();
        this.renderMap.foreground = newMap.baseData.foreground.slice();
        this.renderMap.collision = newMap.baseData.collision.slice();
        if(newMap.baseData.lighting) {
            this.renderMap.lighting = newMap.baseData.lighting.slice();
            lightingLayerActive = true;
        }
        if(newMap.fxBackground) {
            backgroundRenderer = new newMap.fxBackground(this,data);
        } else {
            backgroundRenderer = null;
        }
        this.objectsLookup = [];

        for(let y = 0;y < newMap.columns;y++) {
            const newRow = [];
            const newDecalRow = [];
            for(let x = 0;x < newMap.rows;x++) {
                newRow[x] = null;
                newDecalRow[x] = null;
            }
            this.objectsLookup[y] = newRow;
            this.decals[y] = newDecalRow;
        }

        this.updateSize();

        if(runLoadCode) {
            this.customLoader(resumeRenderer,true,data.sourceRoom);
        }
    }

    let horizontalTiles,     verticalTiles,
        horizontalOffset,    verticalOffset,
        tileSize,
        halfHorizontalTiles, halfVerticalTiles;

    const maxIntensity = 100;
    
    const getIntenseColor = (r,g,b,intensity) => {
        return `rgba(${r},${g},${b},${intensity/maxIntensity})`;
    }
    const getColoredStops = (r,g,b,intensity) => {
        return [
            [getIntenseColor(r,g,b,intensity),0],
            [getIntenseColor(r,g,b,0),1]
        ];
    }
    const getWhiteStops = intensity => {
        return getColoredStops(255,255,255,intensity);
    }
    const getBlackStops = intensity => {
        return getColoredStops(0,0,0,intensity);
    }

    const gradientBufferCanvas = new OffscreenCanvas(0,0);
    const gradientBufferContext = gradientBufferCanvas.getContext(
        "2d",{alpha:true}
    );

    let gradientSize = null;
    let gradientQuarterSize = null;
    const renderGradient = function(x,y) {
        context.drawImage(
            this.image,0,0,
            gradientSize,gradientSize,
            x-gradientQuarterSize,
            y-gradientQuarterSize,
            gradientSize,gradientSize
        );
    }

    const gradientManifest = [
        getBlackStops(100),
        getWhiteStops(100),
        getBlackStops(50),
        getWhiteStops(50),
        getBlackStops(25),
        getWhiteStops(10),
        getBlackStops(75),
        getWhiteStops(75),
        getColoredStops(147,255,255,75),
        getColoredStops(255,0,0,75),
        getColoredStops(0,255,0,75),
        getColoredStops(219,166,105,75),
        getColoredStops(255,233,0,75),
        getColoredStops(124,55,255,75),
        getColoredStops(198,0,151,75),
        getWhiteStops(10)
    ];
    gradientManifest.forEach((stops,index) => {
        gradientManifest[index] = {
            stops: stops,
            image: null,
            render: null
        }
    });

    gradientManifest.push({
        custom: true,
        render: (x,y) => {
            if(this.compositeProcessor && this.compositeProcessor.queueRegion) {
                this.compositeProcessor.addReflection(x,y,tileSize);
            }
        }
    });

    const updateHighDPIGradients = () => {
        const size = tileSize * 2;
        const halfSize = tileSize;

        gradientBufferCanvas.width = size;
        gradientBufferCanvas.height = size;

        gradientManifest.forEach(gradient => {
            if(gradient.custom) {
                return;
            }
            if(gradient.image) {
                gradient.image.close();
            }
            gradientBufferContext.clearRect(
                0,0,size,size
            );
            const radialGradient = gradientBufferContext.createRadialGradient(
                halfSize,halfSize,0,halfSize,halfSize,halfSize
            );
            gradient.stops.forEach(stop=>{
                radialGradient.addColorStop(stop[1],stop[0]);
            });
            gradientBufferContext.fillStyle = radialGradient;
            gradientBufferContext.fillRect(0,0,size,size);

            gradient.image = gradientBufferCanvas.transferToImageBitmap();
            gradient.render = renderGradient.bind(gradient);
        });

        gradientSize = size;
        gradientQuarterSize = gradientSize / 4;
    }

    this.refreshWorldTileset = () => {
        let startedLocked = playerMovementLocked;
        this.lockPlayerMovement();
        let didFinishLoading = false;
        (async ()=>{
            while(!didFinishLoading) {
                playTone(600,0.6);
                await delay(100);
            }
        })();
        ImageManager.loadImages(()=>{
            didFinishLoading = true;
            tileset = imageDictionary[TILESET_NAME];
            playSound("energy");
            if(!startedLocked) {
                this.unlockPlayerMovement();
            }
        });
    }

    this.disableAdaptiveFill = true;
    this.noPixelScale = true;

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

    this.getTileSize = () => {
        return tileSize;
    }

    this.updateSize = function() {
        if(!didStartRenderer) {
            return;
        }
        if(backgroundRenderer && backgroundRenderer.updateSize) {
            backgroundRenderer.updateSize();
        }
        if(this.compositeProcessor) {
            this.compositeProcessor.updateSize();
        }
        let adjustedTileSize = WorldTileSize * this.renderMap.renderScale;
        if(fullWidth < smallScaleSnapPoint) {
            adjustedTileSize *= 1.5;
        } else if(fullWidth < mediumScaleSnapPoint) {
            adjustedTileSize *= 2;
        } else {
            adjustedTileSize *= 2.5;
        }

        tileSize = Math.ceil(adjustedTileSize/16)*16;

        horizontalTiles =  Math.ceil(fullWidth / tileSize);
        verticalTiles = Math.ceil(fullHeight / tileSize);

        if(horizontalTiles % 2 === 0) {
            horizontalTiles++;
        }
        if(verticalTiles % 2 === 0) {
            verticalTiles++;
        }

        horizontalOffset = Math.round(halfWidth - horizontalTiles * tileSize / 2);
        verticalOffset = Math.round(halfHeight - verticalTiles * tileSize / 2);
        
        halfHorizontalTiles = Math.floor(horizontalTiles / 2);
        halfVerticalTiles = Math.floor(verticalTiles / 2);

        if(this.renderMap.fixedCamera) {
            if(verticalTiles < this.renderMap.rows || horizontalTiles < this.renderMap.columns) {
                this.fixedCameraOverride = true;
            } else {
                if(this.fixedCameraOverride) {
                    this.camera.x = this.renderMap.cameraStart.x;
                    this.camera.y = this.renderMap.cameraStart.y;
                    this.camera.xOffset = 0;
                    this.camera.yOffset = 0;
                }
                this.fixedCameraOverride = false;
            }
        }

        if(lightingLayerActive) {
            updateHighDPIGradients();
        }
    }

    this.cameraFrozen = false;
    this.autoCameraOff = () => {
        this.cameraFrozen = true;
    }
    this.autoCameraOn = () => {
        this.cameraFrozen = false;
    }

    this.moveCamera = async (x,y,xOffset,yOffset,duration) => {
        return new Promise(resolve => {
            const startTime = performance.now();
            const startX = this.camera.x + this.camera.xOffset;
            const startY = this.camera.y + this.camera.yOffset;
            const rangeX =  x + xOffset - startX;
            const rangeY =  y + yOffset - startY;
            this.cameraController = timestamp => {
                let tNormal = (timestamp - startTime) / duration;
                if(tNormal < 0) {
                    tNormal = 0;
                } else if(tNormal >= 1) {
                    this.camera.x = x;
                    this.camera.y = y;
                    this.camera.xOffset = xOffset;
                    this.camera.yOffset = yOffset;
                    this.cameraController = null;
                    resolve();
                    return;
                }
                const xPosition = startX + (rangeX * tNormal);
                const yPosition = startY + (rangeY * tNormal);

                const pureX = Math.floor(xPosition);
                const pureY = Math.floor(yPosition);
                const unpureX = xPosition - pureX;
                const unpureY = yPosition - pureY;

                this.camera.x = pureX;
                this.camera.y = pureY;
                this.camera.xOffset = unpureX;
                this.camera.yOffset = unpureY;
            }
        });
    }
    this.pushCamera = async (x,y,xOffset,yOffset,duration) => {
        return this.moveCamera(
            this.camera.x+x,
            this.camera.y+y,
            this.camera.xOffset+xOffset,
            this.camera.yOffset+yOffset,
            duration
        );
    }

    this.fixedCameraOverride = false;
    this.followObject = null;

    this.enableCameraXFollow = () => {
        cameraXFollowEnabled = true;
    }
    this.enableCameraYFollow = () => {
        cameraYFollowEnabled = true;
    }
    this.disableCameraXFollow = () => {
        cameraXFollowEnabled = false;
    }
    this.disableCameraYFollow = () => {
        cameraYFollowEnabled = false;
    }

    this.updateCamera = function(timestamp,movementLocked) {
        if(this.cameraController) {
            this.cameraController(timestamp);
        } else if((!this.renderMap.fixedCamera || this.fixedCameraOverride) && !this.cameraFrozen) {
            let followObject;
            if(this.followObject) {
                followObject = this.followObject;
            } else {
                followObject = internalPlayerObject;
            }
            if(followObject) {
                if(followObject.renderLogic) {
                    followObject.skipRenderLogic = true;
                    followObject.renderLogic(timestamp);
                }
                if(cameraXFollowEnabled) {
                    this.camera.x = followObject.x;
                    this.camera.xOffset = followObject.xOffset;
                }
                if(cameraYFollowEnabled) {
                    this.camera.y = followObject.y;
                    this.camera.yOffset = followObject.yOffset;
                }
                if(followObject.isPlayer) {
                    followObject.walkingOverride = movementLocked;
                }
            }
        }
        if(this.renderMap.useCameraPadding) {
            const abolsuteCameraX = this.camera.x + this.camera.xOffset;
            const absoluteCameraY = this.camera.y + this.camera.yOffset;

            if(abolsuteCameraX - halfHorizontalTiles < this.renderMap.lowerHorizontalBound) {
                this.camera.x = halfHorizontalTiles + this.renderMap.lowerHorizontalBound;
                this.camera.xOffset = 0;   
            } else if(abolsuteCameraX + halfHorizontalTiles > this.renderMap.horizontalUpperBound) {
                this.camera.x = this.renderMap.horizontalUpperBound - halfHorizontalTiles;
                this.camera.xOffset = 0;
            }

            if(absoluteCameraY - halfVerticalTiles < this.renderMap.lowerVerticalBound) {
                this.camera.y = halfVerticalTiles + this.renderMap.lowerVerticalBound;
                this.camera.yOffset = 0;
            } else if(absoluteCameraY + halfVerticalTiles > this.renderMap.verticalUpperBound) {
                this.camera.y = this.renderMap.verticalUpperBound - halfVerticalTiles;
                this.camera.yOffset = 0;
            }
        }
    }

    this.postProcessor = new PostProcessor(0.25);
    this.compositeProcessor = null;

    this.render = function(timestamp) {
        this.processThreads(timestamp);

        if(tileRenderingEnabled) {
        
            const movementLocked = playerInteractionLocked();

            if(!movementLocked && this.playerController.renderMethod) {
                this.playerController.renderMethod(timestamp);
                if(paused) {
                    //This ensures that the world is not rendered before the loading segment plays, such as when the player changes map by a trigger.
                    return;
                }
            }

            if(backgroundRenderer) {
                backgroundRenderer.render(timestamp);
            } else {
                context.fillStyle = "black";
                context.fillRect(0,0,fullWidth,fullHeight);
            }

            const animationTileOffset = Math.floor(timestamp % ANIMATION_CYCLE_DURATION / ANIMATION_FRAME_TIME);
            this.updateCamera(timestamp,movementLocked);

            let verticalTileCount = verticalTiles;
            let horizontalTileCount = horizontalTiles;

            let adjustedYPos = this.camera.y - halfVerticalTiles;
            let adjustedXPos = this.camera.x - halfHorizontalTiles;

            let xStart = 0;
            let yStart = 0;

            if(this.camera.xOffset < 0) {
                xStart--;
            } else if(this.camera.xOffset > 0) {
                xStart--;
                horizontalTileCount++;
            }

            if(this.camera.yOffset < 0) {
                yStart--;
            } else if(this.camera.yOffset > 0) {
                yStart--;
                verticalTileCount++;
            }

            const xOffset = horizontalOffset - Math.round(this.camera.xOffset * tileSize);
            const yOffset = verticalOffset - Math.round(this.camera.yOffset * tileSize);

            const decalBuffer = [];
            const objectBuffer = [];
            const lightBuffer = [];

            let y = yStart, x;

            while(y < verticalTileCount) {
                x = xStart;

                while(x < horizontalTileCount) {

                    const xPos = adjustedXPos + x;
                    const yPos = adjustedYPos + y;

                    if(xPos < this.renderMap.columns && xPos >= 0 && yPos < this.renderMap.rows && yPos >= 0) {
                        const mapIndex = xPos + yPos * this.renderMap.columns;
                        
                        let backgroundValue = this.renderMap.background[mapIndex];
                        let foregroundValue = this.renderMap.foreground[mapIndex];
        
                        const xDestination = xOffset + x * tileSize;
                        const yDestination = yOffset + y * tileSize;

                        if(backgroundValue >= WorldTextureAnimationStart) {
                            backgroundValue += animationTileOffset;
                        }
                        if(foregroundValue >= WorldTextureAnimationStart) {
                            foregroundValue += animationTileOffset;
                        }

                        if(backgroundValue > 0) {
                            const textureX = backgroundValue % WorldTextureColumns * WorldTextureSize;
                            const textureY = Math.floor(backgroundValue / WorldTextureColumns) * WorldTextureSize;
                            context.drawImage(
                                tileset,
                                textureX,textureY,WorldTextureSize,WorldTextureSize,
                                xDestination,yDestination,tileSize,tileSize
                            );
                        }
                        if(foregroundValue > 0) {
                            const textureX = foregroundValue % WorldTextureColumns * WorldTextureSize;
                            const textureY = Math.floor(foregroundValue / WorldTextureColumns) * WorldTextureSize;
                            context.drawImage(
                                tileset,
                                textureX,textureY,WorldTextureSize,WorldTextureSize,
                                xDestination,yDestination,tileSize,tileSize
                            );
                        }

                        const decalRegister = this.decals[xPos][yPos];
                        if(decalRegister) {
                            decalBuffer.push(decalRegister,xDestination,yDestination);
                        }
                        const objectRegister = this.objectsLookup[xPos][yPos];
                        if(objectRegister) {
                            objectBuffer.push(objectRegister,xDestination,yDestination);
                        }

                        if(lightingLayerActive) {
                            const lightingValue = this.renderMap.lighting[mapIndex];
                            if(lightingValue) {
                                lightBuffer.push(
                                    lightingValue-1,
                                    xDestination,
                                    yDestination
                                );
                            }
                        }
                    }
                    x++;
                }
                y++;
            }

            let i = 0;
            while(i < offscreenObjectCount) {
                const object = offscreenObjects[i];
                const xDestination = (object.x - adjustedXPos) * tileSize + xOffset;
                const yDestination = (object.y - adjustedYPos) * tileSize + yOffset;
                objectBuffer.push(
                    object,xDestination,yDestination,
                );
                i++;
            }
            i = 0;
            while(i < decalBuffer.length) {
                decalBuffer[i].render(
                    timestamp,
                    decalBuffer[i+1],
                    decalBuffer[i+2],
                    tileSize,
                    tileSize
                );
                i += 3;
            }
            i = 0;
            while(i < objectBuffer.length) {
                objectBuffer[i].render(
                    timestamp,
                    objectBuffer[i+1],
                    objectBuffer[i+2],
                    tileSize,
                    tileSize
                );
                i += 3;
            }
            if(lightingLayerActive) {
                i = 0;
                while(i < lightBuffer.length) {
                    gradientManifest[lightBuffer[i]].render(
                        lightBuffer[i+1],
                        lightBuffer[i+2]
                    );
                    i += 3;
                }
            }
        } else {
            if(backgroundRenderer) {
                backgroundRenderer.render(timestamp);
            } else {
                context.fillStyle = "black";
                context.fillRect(0,0,fullWidth,fullHeight);
            }
        }
        this.postProcessor.render();
        if(this.compositeProcessor) {
            this.compositeProcessor.render();
        }
        if(objectiveHUD) {
            objectiveHUD.render(timestamp);
        }
        customRendererStack.render(timestamp);
        if(this.customRenderer) {
            this.customRenderer.render(timestamp);
        }
        if(escapeMenuShown) {
            escapeMenu.render(timestamp);
        }
        if(this.prompt) {
            this.prompt.render(timestamp);
        } else if(this.popup) {
            this.popup.render(timestamp);
        }
        if(alert) {
            if(!alert.render(timestamp)) {
                alert = null;
            }
        }
    }
}
export default WorldRenderer;
