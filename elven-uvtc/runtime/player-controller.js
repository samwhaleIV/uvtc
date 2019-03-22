function PlayerController(world) {

    this.world = world;
    this.camera = world.camera;
    this.player = null;

    let wDown = false;
    let sDown = false;
    let aDown = false;
    let dDown = false;

    const movementDown = function() {
        return wDown || sDown || aDown || dDown;
    }
    const checkForSoloMovement = function() {
        let count = 0;
        let register = -1;
        if(wDown) {
            register = 0;
            count++;
        }
        if(sDown) {
            register = 1;
            count++;
        }
        if(aDown) {
            register = 2;
            count++;
        }
        if(dDown) {
            register = 3;
            count++;
        }
        if(count === 1) {
            return register;
        } else {
            return -1;
        }
    }

    const addDirectionToCoordinate = function(x,y,direction) {
        switch(direction) {
            case "up":
                y--;
                break;
            case "down":
                y++;
                break;
            case "left":
                x--;
                break;
            case "right":
                x++;
                break;   
            case "upLeft":
                y--;
                x--;
                break;
            case "upRight":
                y--;
                x++;
                break;
            case "downLeft":
                y++;
                x--;
                break;
            case "downRight":
                y++;
                x++;
                break;
            
        }
        return {x:x,y:y};
    }

    this.processKey = function(key) {

    }
    this.processKeyUp = function(key) {

    }
}
