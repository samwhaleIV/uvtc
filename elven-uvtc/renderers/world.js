import PlayerController from "../runtime/player-controller.js";
import { PlayerRenderer, SpriteRenderer } from "./components/world/sprite.js";
import WorldPopup from "./components/world/popup.js";
import WorldPrompt from "./components/world/prompt.js";
import GlobalState from "../runtime/global-state.js";
import ElfSpriteRenderer from "./components/world/elf-sprite.js";
import GetOverworldCharacter from "../runtime/character-creator.js";

function WorldRenderer() {

    Object.defineProperty(this,"globalState",{
        get: function() {
            return GlobalState.data;
        }
    });
    this.saveState = (withPositionData=true) => {
        if(withPositionData && this.playerObject) {
            GlobalState.data["last_map"] = this.renderMap.name;
            GlobalState.data["last_player_pos"] = {
                d: this.playerObject.direction,
                x: this.playerObject.x,
                y: this.playerObject.y,
                xo: this.playerObject.xOffset,
                yo: this.playerObject.yOffset,
            }
        }
        GlobalState.save();
    };
    const loadLastMapOrDefault = () => {
        let lastMap = GlobalState.data["last_map"]; 
        if(lastMap) {
            this.updateMap(lastMap);
            let lp = GlobalState.data["last_player_pos"];
            if(lp) {
                return () => {
                    if(this.playerObject) {
                        this.moveObject(this.playerObject.ID,lp.x,lp.y);
                        this.playerObject.xOffset = lp.xo;
                        this.playerObject.yOffset = lp.yo;
                        this.playerObject.updateDirection(lp.d);
                    }
                }
            }
        } else {
            this.updateMap(FIRST_MAP_ID);
        }
        return null;
    }
    let ranCustomLoader = false;
    this.customLoader = (callback,fromMapUpdate) => {
        let loadPlayer = null;
        const finishedLoading = () => {
            callback();
            this.updateMapEnd();
            if(!fromMapUpdate) {
                if(loadPlayer) {
                    loadPlayer();
                }
                ranCustomLoader = true;
            }
        }
        if(!fromMapUpdate) {
            loadPlayer = loadLastMapOrDefault();
        }
        let requiredSongs = this.renderMap.requiredSongs ?
            this.renderMap.requiredSongs : this.renderMap.songParent ?
                worldMaps[this.renderMap.songParent].requiredSongs : null;

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
                requiredSongs = [...requiredSongs.slice(),roomSong];
            }
        }

        if(requiredSongs) {
            let loadedSongs = 0;
            const songNames = {};
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
                if(audioBuffers[song]) {
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
    this.sprite = SpriteRenderer;
    this.getCharacter = (name,direction) => GetOverworldCharacter(this,name,direction);

    this.elf = ElfSpriteRenderer;

    this.fader = getFader();

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

    this.playerObject = null;
    this.popup = null;
    this.prompt = null;
    this.customRenderer = null;

    this.playerController = new PlayerController(this);

    let enterReleased = true;
    let playerMovementLocked = false;

    const playerInteractionLocked = () => {
        return playerMovementLocked || this.popup || this.prompt ? true : false;
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

    this.popupProgressEnabled = true;

    this.processKey = function(key) {
        if(this.prompt) {
            switch(key) {
                case kc.accept:
                    if(!enterReleased) return;
                    enterReleased = false;
                    this.prompt.confirmSelection();
                    break;
                case kc.up:
                    if(wDown) return;
                    this.prompt.moveSelection("up");
                    break;
                case kc.down:
                    if(sDown) return;
                    this.prompt.moveSelection("down");
                    break;
                case kc.left:
                    if(aDown) return;
                    this.prompt.moveSelection("left");
                    break;
                case kc.right:
                    if(dDown) return;
                    this.prompt.moveSelection("right");
                    break;
            }
        } else if(this.popup) {
            if(key === kc.accept) {
                if(!enterReleased) return;
                enterReleased = false;
                if(this.popupProgressEnabled) {
                    this.popup.progress();
                }
            }
        } else if(this.playerObject) {
            if(key === kc.accept) { 
                if(!enterReleased) {
                    return;
                } else {
                    enterReleased = false;
                }
            }
            this.playerController.processKey(key);
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
        switch(key) {
            case kc.accept:
                enterReleased = true;
                break;
            case kc.up:
                wDown = false;
                break;
            case kc.down:
                sDown = false;
                break;
            case kc.left:
                aDown = false;
                break;
            case kc.right:
                dDown = false;
                break;
        }
        this.playerController.processKeyUp(key);
    }
    this.processMove = function(mouseX,mouseY) {
    }
    this.processClick = function(mouseX,mouseY) {
    }
    this.processClickEnd = function(mouseX,mouseY) {
        this.processMove(mouseX,mouseY);
    }
    this.clearTextPopup = () => {
        this.popup = null;
    }

    const showTextPopup = (pages,name=null,instant=false) => {
        return new Promise(resolve=>{
            this.popup = new WorldPopup(
                pages,
                () => {
                    this.clearTextPopup();
                    resolve();
                },name,instant
            );
        });
    }
    this.showTextPopupID = ID => showTextPopup([getString(ID)]);
    this.showTextPopupsID = IDs => showTextPopup(IDs.map(getString));
    this.showTextPopup = page => showTextPopup([page]);
    this.showTextPopups = pages => showTextPopup(pages);
    this.showNamedTextPopupID = (ID,name) => showTextPopup([getString(ID)],name);
    this.showNamedTextPopupsID = (IDs,name) => showTextPopup(IDs.map(getString),name);
    this.showNamedTextPopup = (page,name) => showTextPopup([page],name);
    this.showNamedTextPopups = (pages,name) => showTextPopup(pages,name);
    this.showInstantTextPopupID = ID => showTextPopup([getString(ID)]);
    this.showInstantTextPopupsID = IDs => showTextPopup(IDs.map(getString),null,true);
    this.showInstantTextPopup = page => showTextPopup([page],null,true);
    this.showInstantTextPopups = pages => showTextPopup(pages,null,true);

    this.clearPrompt = () => {
        this.prompt = null;
    }
    this.showPrompt = (question,options) => {
        return new Promise(resolve => {
            this.prompt = new WorldPrompt(question,options,selectionIndex => {
                this.clearPrompt();
                resolve(selectionIndex);
            });
        });
    }

    this.getTriggerState = function(x,y) {
        const collisionType = this.renderMap.collision[
            x + y * this.renderMap.columns
        ];
        if(collisionTriggers[collisionType]) {
            return collisionType + collisionTriggerOffset;
        }
        return null;
    }

    this.getCollisionState = function(x,y,ignoreNoCollide) {
        let mapCollision = this.renderMap.collision[
            x + y * this.renderMap.columns
        ];
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

    const tileset = imageDictionary["world-tileset"];

    this.map = null;
    this.objects = {};
    this.objectsLookup = [];

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
        this.playerObject = newPlayer;
        return this.addObject(newPlayer,x,y);
    }

    this.addObject = function(object,x,y) {
        const objectID = getNextObjectID();
        object.ID = objectID;
        if(!isNaN(x) && !isNaN(y)) {
            object.x = x;
            object.y = y;
            if(object.worldPositionUpdated) {
                object.worldPositionUpdated(x,y,x,y,this);
            }
        } else if(isNaN(object.x) || !isNaN(object.y)) {
            console.error("Error: An object was supplied to the world renderer without initial coordinates");
        }
        object.world = this;
        this.objects[objectID] = object;
        if(this.objectsLookup[object.x][object.y]) {
            console.error("Error: An object collision has occured through the add object method");
            console.log("Existing item",this.objectsLookup[object.x][object.y],"New item",object);
        }
        this.objectsLookup[object.x][object.y] = object;
        return objectID;
    }
    this.removeObject = function(objectID) {
        const object = this.objects[objectID];
        delete this.objects[objectID];
        this.objectsLookup[object.x][object.y] = null;
    }
    this.moveObject = function(objectID,newX,newY) {
        const object = this.objects[objectID];
        this.objectsLookup[object.x][object.y] = null;
        const oldX = object.x;
        const oldY = object.y;
        object.x = newX;
        object.y = newY;
        if(object.worldPositionUpdated) {
            object.worldPositionUpdated(oldX,oldY,newX,newY,this);
        }
        if(this.objectsLookup[object.x][object.y]) {
            console.error("Error: An object collision has occured through the move object method");
            console.log("Existing item",this.objectsLookup[object.x][object.y],"New item",object);
        }
        this.objectsLookup[object.x][object.y] = object;
    }

    this.moveSprite = function(objectID,steps) {
        let promiseResolver = null;
        const promise = new Promise(resolve=>promiseResolver=resolve);
        const object = typeof objectID === "string" ? this.objects[objectID] : objectID;
        objectID = object.ID;
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
                                world.moveObject(objectID,object.x+xChangeRollover,object.y+yChangeRollover);
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

    this.changeCollisionTile = (value,x,y) => {
        this.renderMap.collision[getIdx(x,y)] = value;
    }
    this.changeForegroundTile = (value,x,y) => {
        this.renderMap.foreground[getIdx(x,y)] = value;
    }
    this.changeBackgroundTile = (value,x,y) => {
        this.renderMap.background[getIdx(x,y)] = value;
    }

    this.updateMapEnd = function() {
        if(this.map.load) {
            this.map.load(this);
        }
        if(this.map.getCameraStart) {
            this.camera = this.map.getCameraStart(this);
        }
        this.playerController.player = this.playerObject;
        this.restoreRoomSong();
    }
    this.stopMusic = () => {
        stopMusic();
    }
    this.restoreRoomSong = () => {
        const roomSong = this.renderMap.roomSong ?
            this.renderMap.roomSong : this.renderMap.songParent ?
                worldMaps[this.renderMap.songParent].roomSong : null;
        if(!roomSong) {
            stopMusic();
            return;
        }
        if(!musicNodes[roomSong]) {
            stopMusic();
            playMusic(roomSong);
        }
    }

    this.updateMap = function(newMapName,data={}) {
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
        this.playerObject = null;
        this.map = newMap.WorldState ? new newMap.WorldState(this,data):{};
        if(newMap.cameraStart) {
            this.camera.x = newMap.cameraStart.x;
            this.camera.y = newMap.cameraStart.y;
            this.camera.xOffset = 0;
            this.camera.yOffset = 0;
        }
        this.renderMap = newMap;
        this.renderMap.background = newMap.baseData.background.slice();
        this.renderMap.foreground = newMap.baseData.foreground.slice();
        this.renderMap.collision = newMap.baseData.collision.slice();
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

        if(ranCustomLoader) {
            let startedLocked = playerMovementLocked;
            this.lockPlayerMovement();
            drawLoadingText();
            stopRenderer(true);
            this.customLoader(()=>{
                startRenderer();
                playerMovementLocked = startedLocked;
            },true);
        }
    }

    let horizontalTiles, verticalTiles, horizontalOffset, verticalOffset, verticalTileSize, horizontalTileSize, halfHorizontalTiles, halfVerticalTiles;

    this.disableAdapativeFill = true;

    this.updateSize = function() {

        let adjustedTileSize = WorldTileSize;

        if(fullWidth < smallScaleSnapPoint) {
            adjustedTileSize *= 1.5;
        } else if(fullWidth < mediumScaleSnapPoint && fullWidth < maxHorizontalResolution) {
            adjustedTileSize *= 2;
        } else if(fullWidth >= maxHorizontalResolution) {
            adjustedTileSize *= 2;
        }

        adjustedTileSize = Math.floor(adjustedTileSize);
        if(adjustedTileSize % 2 !== 0) {
            adjustedTileSize++;
        }

        horizontalTileSize = adjustedTileSize;
        verticalTileSize = adjustedTileSize;

        horizontalTiles =  Math.ceil(fullWidth / horizontalTileSize);
        verticalTiles = Math.ceil(fullHeight / verticalTileSize);

        if(horizontalTiles % 2 === 0) {
            horizontalTiles++;
        }
        if(verticalTiles % 2 === 0) {
            verticalTiles++;
        }

        horizontalOffset = Math.round(halfWidth - horizontalTiles * horizontalTileSize / 2);
        verticalOffset = Math.round(halfHeight - verticalTiles * verticalTileSize / 2);
        
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

    this.render = function(timestamp) {

        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);

        if(tileRenderingEnabled) {
        
            const movementLocked = playerInteractionLocked();

            if(!movementLocked && this.playerController.renderMethod) {
                this.playerController.renderMethod(timestamp);
            }

            if(this.cameraController) {
                this.cameraController(timestamp);
            } else if((!this.renderMap.fixedCamera || this.fixedCameraOverride) && !this.cameraFrozen) {
                let followObject = this.playerObject;
                if(this.followObject) {
                    followObject = this.followObject;
                }
                if(followObject) {
                    this.camera.x = followObject.x;
                    this.camera.y = followObject.y;
                    this.camera.xOffset = followObject.xOffset;
                    this.camera.yOffset = followObject.yOffset;
                    if(followObject.isPlayer) {
                        followObject.walkingOverride = movementLocked;
                    }
                }
            }
            if(this.renderMap.useCameraPadding) {
                const abolsuteCameraX = this.camera.x + this.camera.xOffset;
                const absoluteCameraY = this.camera.y + this.camera.yOffset;

                if(abolsuteCameraX - halfHorizontalTiles < 0) {
                    this.camera.x = halfHorizontalTiles;
                    this.camera.xOffset = 0;   
                } else if(abolsuteCameraX + halfHorizontalTiles > this.renderMap.horizontalUpperBound) {
                    this.camera.x = this.renderMap.horizontalUpperBound - halfHorizontalTiles;
                    this.camera.xOffset = 0;
                }

                if(absoluteCameraY - halfVerticalTiles < 0) {
                    this.camera.y = halfVerticalTiles;
                    this.camera.yOffset = 0;
                } else if(absoluteCameraY + halfVerticalTiles > this.renderMap.verticalUpperBound) {
                    this.camera.y = this.renderMap.verticalUpperBound - halfVerticalTiles;
                    this.camera.yOffset = 0;
                }
            }

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

            const xOffset = horizontalOffset - Math.round(this.camera.xOffset * horizontalTileSize);
            const yOffset = verticalOffset - Math.round(this.camera.yOffset * verticalTileSize);

            const objectBuffer = [];

            let y = yStart, x;

            while(y < verticalTileCount) {
                x = xStart;

                while(x < horizontalTileCount) {

                    const xPos = adjustedXPos + x;
                    const yPos = adjustedYPos + y;

                    if(xPos < this.renderMap.columns && xPos >= 0) {
                        const mapIndex = xPos + yPos * this.renderMap.columns;
                        
                        const backgroundValue = this.renderMap.background[mapIndex];
                        const foregroundValue = this.renderMap.foreground[mapIndex];
        
                        const xDestination = xOffset + x * horizontalTileSize;
                        const yDestination = yOffset + y * verticalTileSize;
        
                        if(backgroundValue > 0) {
                            const textureX = backgroundValue % WorldTextureColumns * WorldTextureSize;
                            const textureY = Math.floor(backgroundValue / WorldTextureColumns) * WorldTextureSize;
                            context.drawImage(
                                tileset,
                                textureX,textureY,WorldTextureSize,WorldTextureSize,
                                xDestination,yDestination,horizontalTileSize,verticalTileSize
                            );
                        }
                        if(foregroundValue > 0) {
                            const textureX = foregroundValue % WorldTextureColumns * WorldTextureSize;
                            const textureY = Math.floor(foregroundValue / WorldTextureColumns) * WorldTextureSize;
                            context.drawImage(
                                tileset,
                                textureX,textureY,WorldTextureSize,WorldTextureSize,
                                xDestination,yDestination,horizontalTileSize,verticalTileSize
                            );
                        }

                        const decalRegister = this.decals[xPos][yPos];
                        if(decalRegister) {
                            objectBuffer.push(decalRegister,xDestination,yDestination);
                        }
                        const objectRegister = this.objectsLookup[xPos][yPos];
                        if(objectRegister) {
                            objectBuffer.push(objectRegister,xDestination,yDestination);
                        }

                    }
                    x++;
                }
                y++;
            }
            let objectBufferIndex = 0;
            while(objectBufferIndex < objectBuffer.length) {
                objectBuffer[objectBufferIndex].render(
                    timestamp,
                    objectBuffer[objectBufferIndex+1],
                    objectBuffer[objectBufferIndex+2],
                    horizontalTileSize,
                    verticalTileSize
                );
                objectBufferIndex += 3;
            }
        }
        if(this.prompt) {
            this.prompt.render(timestamp);
        } else if(this.popup) {
            this.popup.render(timestamp);
        }
        if(this.customRenderer) {
            this.customRenderer(timestamp);
        }
        this.fader.render(timestamp);
    }
}
export default WorldRenderer;
