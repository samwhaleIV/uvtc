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
const invertDirection = direction => {
    switch(direction) {
        case "up":
            return "down";
        case "down":
            return "up";
        case "left":
            return "right";
        case "right":
            return "left";
        default:
            return direction;
    }
}
const runScript = async (script,worldState,canBeUnloaded) => {
    worldState.scriptTerminator = null;
}
