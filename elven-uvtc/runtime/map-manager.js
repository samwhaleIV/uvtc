const worldMapList = [];
const worldMaps = {};
const CIPHER_LOOKUP = (function(inverse=false){
    const o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    n=o.length,c=Math.pow(n,2),r={};for(let e=0;e<c;e++)
    {const c=o[Math.floor(e/n)],f=o[e%n];inverse?r[e]=c+f:r[c+f]=e}return r;
})();

function decodeMapLayer(layer) {
    if(typeof layer !== "string") {
        return layer;
    }
    const layerData = [];
    for(let i = 0;i<layer.length;i+=2) {
        const characterSet = layer.substring(i,i+2);
        layerData.push(
            CIPHER_LOOKUP[characterSet]
        );
    }
    return layerData;
}

function addMap(map) {

    worldMapList.push(map);
    worldMaps[map.name] = map;

    const tilemaps = rawMapData[map.name];
    if(!tilemaps) {
        console.error(`Map '${map.name}' does not have any corresponding map data`);
        return;
    }
    map.baseData = {
        background: decodeMapLayer(tilemaps.background),
        collision:  decodeMapLayer(tilemaps.collision),
        foreground: decodeMapLayer(tilemaps.foreground)
    };
    if(tilemaps.lighting) {
        map.baseData.lighting = decodeMapLayer(tilemaps.lighting);
    }

    map.rows = tilemaps.rows;
    map.columns = tilemaps.columns;

    map.finalRow = tilemaps.rows - 1;
    map.finalColumn = tilemaps.columns - 1;

    map.lowerHorizontalBound = !isNaN(map.minCameraX) ? map.minCameraX : 0;
    map.lowerVerticalBound = !isNaN(map.minCameraY) ? map.minCameraY : 0;

    map.horizontalUpperBound = !isNaN(map.maxCameraX) ? map.maxCameraX : map.finalColumn;
    map.verticalUpperBound = !isNaN(map.maxCameraY) ? map.maxCameraY : map.finalRow;

    if(!map.renderScale) {
        map.renderScale = 1;
    }

    delete rawMapData[map.name];

    if(!map.doors) {
        return;
    }
    map.doorLookup = {};
    let doorIndex = 0;
    for(let y = 0;y<map.rows;y++) {
        for(let x = 0;x<map.columns;x++) {
            const mapIndex = x + y * map.columns;
            if(map.baseData.collision[mapIndex] === 2) {
                if(!map.doorLookup[x]) {
                    map.doorLookup[x] = {};
                }
                map.doorLookup[x][y] = map.doors[doorIndex++];
            }
        }
    }
}
function establishMapLinks() {
    for(let i = 0;i<worldMapList.length;i++) {
        const map = worldMapList[i];
        const songData = MusicLinkingManifest[map.name];
        if(songData) {
            if(songData.linkTo) {
                let link = songData.linkTo;
                let root;
                while(link) {
                    const manifest = MusicLinkingManifest[link];
                    if(!manifest) {
                        throw Error(`Music link manifest error: Cannot link to '${link}' @ '${map.name}'`);
                    }
                    if(manifest.linkTo) {
                        link = manifest.linkTo;
                    } else {
                        root = MusicLinkingManifest[link];
                        link = null;
                    }
                }
                map.roomSong = root.song;
                map.requiredSongs = songData.preloadSongs;
            } else {
                map.roomSong = songData.song;
                map.requiredSongs = songData.preloadSongs;
            }
        }
    }
}
