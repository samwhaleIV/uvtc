const worldMapList = [];
const worldMaps = {};
function addMap(map) {
    worldMapList.push(map);
    worldMaps[map.name] = map;
    map.rows = map.background.length / map.columns;
    for(let i = 0;i<map.background.length;i++) {
        map.background[i] = (map.background[i] || 1) + WorldMapValueOffset;
        map.foreground[i] = (map.foreground[i] || 1) + WorldMapValueOffset;
    }
}
