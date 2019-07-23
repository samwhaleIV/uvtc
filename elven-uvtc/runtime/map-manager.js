const worldMapList = [];
const worldMaps = {};

function addMap(map) {

    worldMapList.push(map);
    worldMaps[map.name] = map;

    const tilemaps = rawMapData[map.name];
    if(!tilemaps) {
        console.error(`Map '${map.name}' does not have any corresponding map data`);
        return;
    }
    map.baseData = {
        background: tilemaps.background,
        collision: tilemaps.collision,
        foreground: tilemaps.foreground
    };

    map.rows = tilemaps.rows;
    map.columns = tilemaps.columns;

    map.lowerHorizontalBound = !isNaN(map.minCameraX) ? map.minCameraX : 0;
    map.lowerVerticalBound = !isNaN(map.minCameraY) ? map.minCameraY : 0;

    map.horizontalUpperBound = !isNaN(map.maxCameraX) ? map.maxCameraX : map.columns - 1;
    map.verticalUpperBound = !isNaN(map.maxCameraY) ? map.maxCameraY : map.rows - 1;

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
                    map.doorLookup[x] = {}
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
