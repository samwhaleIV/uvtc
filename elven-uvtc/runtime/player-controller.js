function PlayerController(world) {

    this.world = world;
    this.camera = world.camera;
    this.player = null;

    this.walking;

    let wDown = false;
    let sDown = false;
    let aDown = false;
    let dDown = false;

    let movementLoop = -1;
    const loopInterval = 10;

    const movementJumpThreshold = 0.5;
    const collisionThreshold = 0.1;

    const cancelWalkLoop = () => {
        clearInterval(movementLoop);
        this.player.setWalking(false);
        movementLoop = -1;
    }

    const playerKindaCollides = direction => {
        let collidesKinda = false;
        if(direction) {
            switch(direction) {
                case "up":
                    collidesKinda = this.player.verticalOffset < -collisionThreshold && this.world.collides(this.player.x,this.player.y-1,this.player.ID);
                    break;
                case "down":
                    collidesKinda = this.player.verticalOffset > collisionThreshold && this.world.collides(this.player.x,this.player.y+1,this.player.ID);
                    break;
                case "left":
                    collidesKinda = this.player.horizontalOffset < -collisionThreshold && this.world.collides(this.player.x-1,this.player.y,this.player.ID);
                    break;
                case "right":
                    collidesKinda = this.player.horizontalOffset > collisionThreshold && this.world.collides(this.player.x+1,this.player.y,this.player.ID);
                    break;
            }
        } else {
            if(this.player.horizontalOffset > collisionThreshold) {
                if(this.world.collides(this.player.x+1,this.player.y,this.player.ID)) {
                    collidesKinda = true;
                }
            } else if(this.player.horizontalOffset < -collisionThreshold) {
                if(this.world.collides(this.player.x-1,this.player.y,this.player.ID)) {
                    collidesKinda = true;
                }
            }
            if(this.player.verticalOffset > collisionThreshold) {
                if(this.world.collides(this.player.x,this.player.y+1,this.player.ID)) {
                    collidesKinda = true;
                }
            } else if(this.player.verticalOffset < -collisionThreshold) {
                if(this.world.collides(this.player.x,this.player.y-1,this.player.ID)) {
                    collidesKinda = true;
                }
            }
        }
        return collidesKinda;
    }

    const loopFunction = direction => {
        console.log(this.player.horizontalOffset,this.player.verticalOffset);
        switch(direction) {
            case "up":
                this.player.verticalOffset -= 0.05;
                break;
            case "down":
                this.player.verticalOffset += 0.05;
                break;
            case "left":
                this.player.horizontalOffset -= 0.05;
                break;
            case "right":
                this.player.horizontalOffset += 0.05;
                break;
        }

        let newX = this.player.x, newY = this.player.y;
        if(this.player.horizontalOffset >= 1) {
            newX++;
        } else if(this.player.horizontalOffset <= -1) {
            newX--;
        }
        if(this.player.verticalOffset >= 1) {
            newY++;
        } else if(this.player.verticalOffset <= -1) {
            newY--;
        }

        if(newX !== this.player.x || newY !== this.player.y) {
            const collidesInWorld = this.world.collides(newX,newY,this.player.ID);

            if(!collidesInWorld) {

                this.world.moveObject(this.player.ID,newX,newY);

                if(this.player.horizontalOffset >= 1 || this.player.horizontalOffset <= -1) {
                    this.player.horizontalOffset = 0;
                }
                if(this.player.verticalOffset >= 1 || this.player.verticalOffset <= -1) {
                    this.player.verticalOffset = 0;
                }

            } else {
                cancelWalkLoop();
            }
        }
        if(playerKindaCollides(this.player.direction)) {
            cancelWalkLoop();
            return;
        }
    }

    const startMovementLoop = direction => {
        console.log("Started movement loop",direction);
        movementLoop = setInterval(loopFunction,loopInterval,direction);
    }

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
        console.log(key);
        const startDirection = this.player.direction;
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

            if(this.player.horizontalOffset < 1 && this.player.direction === "right") {
                nextPosition.x--;
                if(this.player.verticalOffset > collisionThreshold) {
                    nextPosition.y--;
                } else if(this.player.verticalOffset < -collisionThreshold) {
                    nextPosition.y++;
                }
            } else if(this.player.horizontalOffset < 0 && this.player.direction === "left") {
                nextPosition.x++;
                if(this.player.verticalOffset > collisionThreshold) {
                    nextPosition.y--;
                } else if(this.player.verticalOffset < -collisionThreshold) {
                    nextPosition.y++;
                }
            }

            if(this.player.verticalOffset < 1 && this.player.direction === "down") {
                nextPosition.y--;
                if(this.player.horizontalOffset > collisionThreshold) {
                    nextPosition.x--;
                } else if(this.player.horizontalOffset < -collisionThreshold) {
                    nextPosition.x++;
                }
            } else if(this.player.verticalOffset > 0 && this.player.direction === "up") {
                nextPosition.y++;
                if(this.player.horizontalOffset > collisionThreshold) {
                    nextPosition.x--;
                } else if(this.player.horizontalOffset < -collisionThreshold) {
                    nextPosition.x++;
                }
            }


            const collidesAtNextPosition = this.world.collides(
                nextPosition.x,nextPosition.y,this.player.ID
            );
            this.player.setWalking(
                !collidesAtNextPosition && !playerKindaCollides(this.player.direction)
            );
        }
        if(movementLoop >= 0 && !this.player.isWalking()) {
            cancelWalkLoop();
        } else if(this.player.isWalking() && (movementLoop < 0 || startDirection !== this.player.direction)) {
            clearTimeout(movementLoop);
            movementLoop = -1;
            startMovementLoop(this.player.direction);
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
        } else if(!movementDown()) {
            cancelWalkLoop();
        }
    }
}
