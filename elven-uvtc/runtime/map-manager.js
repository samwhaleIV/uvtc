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

    map.horizontalUpperBound = map.columns - 1;
    map.verticalUpperBound = map.rows - 1;

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
