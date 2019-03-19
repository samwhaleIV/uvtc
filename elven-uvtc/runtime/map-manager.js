const worldMapList = [];
const worldMaps = {};
function addMap(map) {
    worldMapList.push(map);
    worldMaps[map.name] = map;
    if(map.background && map.foreground) {
        for(let i = 0;i<map.background.length;i++) {
            map.background[i] += WorldMapValueOffset;
            map.foreground[i] += WorldMapValueOffset;
        }
    } else {
        console.warn("Map manager: A map is missing a background or foreground layer and has not been pre-processed!");
    }
}
