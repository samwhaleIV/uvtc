const worldMapList = [];
const worldMaps = {};
function addMap(map) {

    worldMapList.push(map);
    worldMaps[map.name] = map;

    const tilemaps = rawMapData[map.name];
    map.background = tilemaps.background;
    map.collision = tilemaps.collision;
    map.foreground = tilemaps.foreground;

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
            if(map.collision[mapIndex] === 2) {
                if(!map.doorLookup[x]) {
                    map.doorLookup[x] = {}
                }
                map.doorLookup[x][y] = map.doors[doorIndex++];
            }
        }
    }
}

const packagePlayerPosition = (data,world) => data.playerPosition = {
    x: world.playerObject.x,
    y: world.playerObject.y,
    direction: world.playerObject.direction
}

const unpackagePlayerPosition = data =>
[data.playerPosition.x,data.playerPosition.y,data.playerPosition.direction];

const shiftPlayerToDoorFrame = (doorX,doorY,world) => {
    const player = world.playerObject;
    switch(player.direction) {
        case "up":
        case "down":
            player.x = doorX;
            player.xOffset = 0;
            break;
        case "left":
        case "right":
            player.y = doorY;
            player.yOffset = 0;
            break;
    }
}
const stackDelay = (delay,callback,...callbackParameters) => {
    setTimeout(callback,delay,callbackParameters);
}
