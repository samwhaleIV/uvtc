const worldMapList = [];
const worldMaps = {};
function addMap(map) {
    worldMapList.push(map);
    worldMaps[map.name] = map;
    map.rows = map.background.length / map.columns;
    map.horizontalUpperBound = map.columns - 1;
    map.verticalUpperBound = map.rows - 1;
    for(let i = 0;i<map.background.length;i++) {
        map.background[i] = (map.background[i] || 1) + WorldMapValueOffset;
        map.foreground[i] = (map.foreground[i] || 1) + WorldMapValueOffset;
        if(map.collision[i] !== 0) {
            map.collision[i] = map.collision[i] + CollisionMapValueOffset;
        }
    }

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
