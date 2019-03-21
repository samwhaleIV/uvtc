function PlayerController(world) {

    this.world = world;
    this.camera = world.camera;
    this.player = null;

    this.walking;

    let wDown;
    let sDown;
    let aDown;
    let dDown;

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
        switch(key) {
            case "KeyW":
                this.player.updateDirection("up");
                wDown = true;
                break;
            case "KeyS":
                this.player.updateDirection("down");
                sDown = true;
                break;
            case "KeyA":
                this.player.updateDirection("left");
                aDown = true;
                break;
            case "KeyD":
                this.player.updateDirection("right");
                dDown = true;
                break;
        }
        if(movementDown()) {
            const nextPosition = addDirectionToCoordinate(
                this.player.x,this.player.y,this.player.direction
            );
            const collidesAtNextPosition = this.world.collides(
                nextPosition.x,nextPosition.y
            );
            this.player.setWalking(
                !collidesAtNextPosition
            );
        }
    }
    this.processKeyUp = function(key) {
        let movementReleased = false;
        switch(key) {
            case "KeyW":
                wDown = false;
                movementReleased = true;
                break;
            case "KeyS":
                sDown = false;
                movementReleased = true;
                break;
            case "KeyA":
                aDown = false;
                movementReleased = true;
                break;
            case "KeyD":
                dDown = false;
                movementReleased = true;
                break;
        }

        const cfsmResult = checkForSoloMovement();
        if(movementReleased && cfsmResult >= 0) {
            let key;
            switch(cfsmResult) {
                case 0:
                    key = "KeyW";
                    break;
                case 1:
                    key = "KeyS";
                    break;
                case 2:
                    key = "KeyA";
                    break;
                case 3:
                    key = "KeyD";
                    break;
            }
            this.processKey(key);
        }
        
        if(!movementDown()) {
            this.player.setWalking(false);
        }
    }
}
