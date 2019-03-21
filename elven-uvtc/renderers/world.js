function WorldRenderer(startMap) {

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

    this.addObject = function(object,x,y) {
        const objectID = getNextObjectID();
        object.ID = objectID;
        if(!isNaN(x) && !isNaN(y)) {
            object.x = x;
            object.y = y;
        } else if(isNaN(object.x) || !isNaN(object.y)) {
            console.error("Error: An object was supplied to the world renderer without initial coordinates");
        }
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

        object.x = newX;
        object.y = newY;
        if(this.objectsLookup[object.x][object.y]) {
            console.error("Error: An object collision has occured through the move object method");
            console.log("Existing item",this.objectsLookup[object.x][object.y],"New item",object);
        }
        this.objectsLookup[object.x][object.y] = object;
    }

    this.updateMap = function(newMap) {
        if(this.map && this.map.unload) {
            this.map.unload(this);
        }
        this.objects = {};
        this.map = newMap;
        this.objectsLookup = [];
        for(let x = 0;x < newMap.rows;x++) {
            const newColumn = [];
            for(let y = 0;y < newMap.columns;y++) {
                newColumn[y] = null;
            }
            this.objectsLookup[x] = newColumn;
        }
        if(this.map.load) {
            this.map.load(this);
        }
        if(this.map.getCameraStart) {
            this.camera = this.map.getCameraStart(this);
        }
        //TODO load player information
    }

    this.updateMap(startMap);

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

    this.camera = {
        x: 9,
        y: 9,
        xOffset: 0.5,
        yOffset: 0.5
    }

    const tileset = imageDictionary["world-tileset"];

    this.render = function(timestamp) {

        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);

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

        let y = yStart, x;

        while(y < verticalTileCount) {
            x = xStart;

            while(x < horizontalTileCount) {

                const xPos = adjustedXPos + x;
                const yPos = adjustedYPos + y;

                if(xPos < this.map.columns && xPos >= 0) {
                    const mapIndex = xPos + yPos * this.map.columns;
                    
                    const backgroundValue = this.map.background[mapIndex];
                    const foregroundValue = this.map.foreground[mapIndex];
    
                    const xDestination = xOffset + x * horizontalTileSize;
                    const yDestination = yOffset + y * verticalTileSize;
    
                    if(backgroundValue) {
                        const textureX = backgroundValue % WorldTextureColumns * WorldTextureSize;
                        const textureY = Math.floor(backgroundValue / WorldTextureColumns) * WorldTextureSize;
                        context.drawImage(
                            tileset,
                            textureX,textureY,WorldTextureSize,WorldTextureSize,
                            xDestination,yDestination,horizontalTileSize,verticalTileSize
                        );
                    }
                    if(foregroundValue) {
                        const textureX = foregroundValue % WorldTextureColumns * WorldTextureSize;
                        const textureY = Math.floor(foregroundValue / WorldTextureColumns) * WorldTextureSize;
                        context.drawImage(
                            tileset,
                            textureX,textureY,WorldTextureSize,WorldTextureSize,
                            xDestination,yDestination,horizontalTileSize,verticalTileSize
                        );
                    }

                    const objectRegister = this.objectsLookup[xPos][yPos];
                    if(objectRegister) {
                        objectRegister.render(
                            timestamp,
                            xDestination,
                            yDestination,
                            horizontalTileSize,
                            verticalTileSize
                        );
                    }
                }
                x++;
            }
            y++;
        }
    }
}
