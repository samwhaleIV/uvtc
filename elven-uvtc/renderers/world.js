import PlayerController from "../runtime/player-controller.js";
import { PlayerRenderer, SpriteRenderer } from "./components/world/sprite.js";
import WorldPopup from "./components/world/popup.js";
import WorldPrompt from "./components/world/prompt.js";
import GlobalState from "../runtime/global-state.js";

function WorldRenderer(startMapName) {

    this.globalState = GlobalState.data;
    this.saveState = () => {
        GlobalState.save();
    };
    this.restoreState = () => {
        GlobalState.restore();
    }

    this.sprite = SpriteRenderer;

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

    this.lockPlayerMovement = function(callback,...callbackParameters) {
        playerMovementLocked = true;
        if(callback) {
            callback(...callbackParameters);
        }
    }
    this.unlockPlayerMovement = function(callback,...callbackParameters) {
        playerMovementLocked = false;
        if(callback) {
            callback(...callbackParameters);
        }
    }

    let wDown = false;
    let sDown = false;
    let aDown = false;
    let dDown = false;

    this.processKey = function(key) {
        if(this.prompt) {
            switch(key) {
                case "Enter":
                    if(!enterReleased) return;
                    enterReleased = false;
                    this.prompt.confirmSelection();
                    break;
                case "KeyW":
                    if(wDown) return;
                    this.prompt.moveSelection("up");
                    break;
                case "KeyS":
                    if(sDown) return;
                    this.prompt.moveSelection("down");
                    break;
                case "KeyA":
                    if(aDown) return;
                    this.prompt.moveSelection("left");
                    break;
                case "KeyD":
                    if(dDown) return;
                    this.prompt.moveSelection("right");
                    break;
            }
        } else if(this.popup) {
            if(key === "Enter") {
                if(!enterReleased) return;
                enterReleased = false;
                this.popup.progress();
            }
        } else if(this.playerObject) {
            if(key === "Enter") { 
                if(!enterReleased) {
                    return;
                } else {
                    enterReleased = false;
                }
            }
            this.playerController.processKey(key);
        } else if(key === "Enter") {
            enterReleased = false;
            return;
        }
        switch(key) {
            case "KeyW":
                wDown = true;
                return;
            case "KeyS":
                sDown = true;
                return;
            case "KeyA":
                aDown = true;
                return;
            case "KeyD":
                dDown = true;
                return;
        }
    }
    this.processKeyUp = function(key) {
        switch(key) {
            case "Enter":
                enterReleased = true;
                break;
            case "KeyW":
                wDown = false;
                break;
            case "KeyS":
                sDown = false;
                break;
            case "KeyA":
                aDown = false;
                break;
            case "KeyD":
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
    this.showTextPopupID = (ID,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            [getString(ID)],
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,null,false
        );
    }
    this.showTextPopupsID = (IDs,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            IDs.map(id => getString(id)),
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,null,false
        );
    }
    this.showTextPopup = (page,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            [page],
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,null,false
        );
    }
    this.showTextPopups = (pages,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            pages,
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,null,false
        );
    }
    this.showNamedTextPopupID = (ID,name,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            [getString(ID)],
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,
            name,false
        );
    }
    this.showNamedTextPopupsID = (IDs,name,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            IDs.map(id => getString(id)),
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,
            name,false
        );
    }
    this.showNamedTextPopup = (page,name,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            [page],
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,
            name,false
        );
    }
    this.showNamedTextPopups = (pages,name,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            pages,
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,
            name,false
        );
    }
    this.showInstantTextPopupID = (ID,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            [getString(ID)],
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,null,true
        );
    }
    this.showInstantTextPopupsID = (IDs,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            IDs.map(id => getString(id)),
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,null,true
        );
    }
    this.showInstantTextPopup = (page,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            [page],
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,null,true
        );
    }
    this.showInstantTextPopups = (pages,callback,...callbackParameters) => {
        this.popup = new WorldPopup(
            pages,
            callback ? () => {
                this.clearTextPopup();
                callback(...callbackParameters);
            } : this.clearTextPopup,null,true
        );
    }
    this.clearPrompt = () => {
        this.prompt = null;
    }
    this.showPrompt = (question,options,callback,...callbackParameters) => {
        this.prompt = new WorldPrompt(question,options,selectionIndex => {
            this.clearPrompt();
            callback(selectionIndex,...callbackParameters);
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

    this.moveSprite = function(objectID,steps,callback,...callbackParameters) {
        const object = this.objects[objectID];
        const world = this;
        let lastCallback = () => {
            object.setWalking(false);
            object.renderLogic = null;
            if(callback) {
                callback(...callbackParameters);
            }
        }
        for(let i = steps.length-1;i>=0;i--) {
            (function(step,callback){
                if(step.x) {
                    lastCallback = () => {
                        let lastFrame = null;
                        if(step.x > 0) {
                            object.updateDirection("right");
                            object.renderLogic = timestamp => {
                                if(!lastFrame) {
                                    lastFrame = timestamp;
                                    return;
                                }
                                const delta = timestamp - lastFrame;
                                lastFrame = timestamp;
                                object.xOffset += delta / 1000 * object.tilesPerSecond;
                                if(object.xOffset >= step.x) {
                                    object.xOffset = 0;
                                    world.moveObject(objectID,object.x+step.x,object.y);
                                    callback();
                                }
                            }
                        } else {
                            object.updateDirection("left");
                            object.renderLogic = timestamp => {
                                if(!lastFrame) {
                                    lastFrame = timestamp;
                                    return;
                                }
                                const delta = timestamp - lastFrame;
                                lastFrame = timestamp;
                                object.xOffset -= delta / 1000 * object.tilesPerSecond;
                                if(object.xOffset <= step.x) {
                                    object.xOffset = 0;
                                    world.moveObject(objectID,object.x+step.x,object.y);
                                    callback();
                                }
                            }
                        }
                    }
                } else if(step.y) {
                    lastCallback = () => {
                        let lastFrame = null;
                        if(step.y > 0) {
                            object.updateDirection("down");
                            object.renderLogic = timestamp => {
                                if(!lastFrame) {
                                    lastFrame = timestamp;
                                    return;
                                }
                                const delta = timestamp - lastFrame;
                                lastFrame = timestamp;
                                object.yOffset += delta / 1000 * object.tilesPerSecond;
                                if(object.yOffset >= step.y) {
                                    object.yOffset = 0;
                                    world.moveObject(objectID,object.x,object.y+step.y);
                                    callback();
                                }
                            }
                        } else {
                            object.updateDirection("up");
                            object.renderLogic = timestamp => {
                                if(!lastFrame) {
                                    lastFrame = timestamp;
                                    return;
                                }
                                const delta = timestamp - lastFrame;
                                lastFrame = timestamp;
                                object.yOffset -= delta / 1000 * object.tilesPerSecond;
                                if(object.yOffset <= step.y) {
                                    object.yOffset = 0;
                                    world.moveObject(objectID,object.x,object.y+step.y);
                                    callback();
                                }
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
        if(this.map.load) {
            this.map.load(this);
        }
        if(this.map.getCameraStart) {
            this.camera = this.map.getCameraStart(this);
        }

        this.playerController.player = this.playerObject;
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
    }

    this.updateMap(startMapName);

    this.render = function(timestamp) {

        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);

        if(tileRenderingEnabled) {
        
            const movementLocked = playerInteractionLocked();

            if(!movementLocked && this.playerController.renderMethod) {
                this.playerController.renderMethod(timestamp);
            }

            if(this.playerObject) {
                this.camera.x = this.playerObject.x;
                this.camera.y = this.playerObject.y;
                this.camera.xOffset = this.playerObject.xOffset;
                this.camera.yOffset = this.playerObject.yOffset;
                this.playerObject.walkingOverride = movementLocked;

                if(this.renderMap.useCameraPadding) {
                    const abolsuteCameraX = this.camera.x + this.camera.xOffset;
                    const absoluteCameraY = this.camera.y+ this.camera.yOffset;

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
