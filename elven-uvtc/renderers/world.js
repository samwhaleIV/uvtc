function WorldRenderer(startMap) {

    let horizontalTiles, verticalTiles, horizontalOffset, verticalOffset, verticalTileSize, horizontalTileSize;

    this.forcedSizeMode = sizeModes.fit.name;
    this.map = startMap;

    this.updateSize = function() {
        horizontalTiles =  Math.ceil(fullWidth / WorldTileSize);
        verticalTiles = Math.ceil(fullHeight / WorldTileSize);
        horizontalOffset = Math.round(halfWidth - horizontalTiles * WorldTileSize / 2);
        verticalOffset = Math.round(halfHeight - verticalTiles * WorldTileSize / 2);

        horizontalTileSize = WorldTileSize;
        verticalTileSize = WorldTileSize;

        this.camera.x = Math.floor(horizontalTiles / 2);
        this.camera.y = Math.floor(verticalTiles / 2);
    }

    this.objects = [];
    this.camera = {
        x: 0,
        y: 0,
        xOffset:0,
        yOffset:0
    }

    const tileset = imageDictionary["world-tileset"];

    //load objects from map into this.objects - and when we reload the map inline

    this.render = function(timestamp) {
        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);

        const xOffset = this.camera.xOffset + horizontalOffset;
        const yOffset = this.camera.yOffset + verticalOffset;

        let y = 0, x;

        while(y < verticalTiles) {
            x = 0;

            while(x < horizontalTiles) {

                const xPos = this.camera.x + x;
                const yPos = this.camera.y + y;

                const mapIndex = xPos + yPos * this.map.columns;
                const backgroundValue = this.map.background[mapIndex];
                const foregroundValue = this.map.foreground[mapIndex];

                const xDestination = xOffset + x * WorldTileSize;
                const yDestination = yOffset + y * WorldTileSize;

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
                x++;
            }
            y++;
        }
    }
}
