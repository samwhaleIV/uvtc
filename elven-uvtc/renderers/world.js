function WorldRenderer(startMap) {

    let horizontalTiles, verticalTiles, horizontalOffset, verticalOffset, verticalTileSize, horizontalTileSize, halfHorizontalTiles, halfVerticalTiles;

    this.disableAdapativeFill = true;
    this.map = startMap;

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

    this.objects = [];
    this.camera = {
        x: 9,
        y: 9,
        xOffset: 0.5,
        yOffset: 0.5
    }

    this.debug_test_camera = function() {
        this.debugMethod = function(timestamp) {
            const angle = timestamp % 100 / 100 * PI2;
            const xOffset = horizontalTileSize * Math.cos(angle) / horizontalTileSize;
            const yOffset = verticalTileSize * Math.sin(angle) / verticalTileSize;

            this.camera.xOffset = xOffset;
            this.camera.yOffset = yOffset;
        }
    }

    this.debugMethod = () => null;

    const tileset = imageDictionary["world-tileset"];

    //load objects from map into this.objects - and when we reload the map inline

    this.render = function(timestamp) {

        this.debugMethod(timestamp);

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
                }
                x++;
            }
            y++;
        }

        drawTextBlack(String(this.camera.yOffset),15,15,4);
    }
}
