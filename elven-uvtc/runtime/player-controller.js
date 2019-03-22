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
    const loopInterval = 200;

    const movementJumpThreshold = 0.5;

    const cancelWalkLoop = () => {
        console.log("Cancel walk loop");
        this.player.setWalking(false);
        clearTimeout(movementLoop);
        movementLoop = -1;
        if(this.player.nextXStartTime) {
            const xProgress = (performance.now() - this.player.nextXStartTime) / loopInterval;
            if(xProgress > movementJumpThreshold) {
                let newXPos;
                if(this.player.nextXPolarity > 0) {
                    newXPos = addDirectionToCoordinate(
                        this.player.x,this.player.y,"right"
                    );
                } else {
                    newXPos = addDirectionToCoordinate(
                        this.player.x,this.player.y,"left"
                    );
                }
                if(!this.world.collides(newXPos.x,newXPos.y)) {
                    this.world.moveObject(this.player.ID,newXPos.x,newXPos.y);
                }
            }
        }
        if(this.player.nextYStartTime) {
            const yProgress = (performance.now() - this.player.nextYStartTime) / loopInterval;
            if(yProgress > movementJumpThreshold) {
                let newYPos;
                if(this.player.nextYPolarity > 0) {
                    newYPos = addDirectionToCoordinate(
                        this.player.x,this.player.y,"down"
                    );
                } else {
                    newYPos = addDirectionToCoordinate(
                        this.player.x,this.player.y,"up"
                    );
                }
                if(!this.world.collides(newYPos.x,newYPos.y)) {
                    this.world.moveObject(this.player.ID,newYPos.x,newYPos.y);
                }
            }
        }
        this.player.clearNextAnimationValues();
    }

    const loopFunction = direction => {
        console.log("Loop",direction);
        const newCoordinate = addDirectionToCoordinate(this.player.x,this.player.y,direction);

        if(this.world.collides(newCoordinate.x,newCoordinate.y)) {
            console.log("Walk loop collision");
            cancelWalkLoop();
            return;
        } else {
            if(newCoordinate.x > this.player.x) {
                this.player.nextXStartTime = performance.now();
                this.player.nextXPolarity = 1;
            } else if(newCoordinate.x < this.player.x) {
                this.player.nextXStartTime = performance.now();
                this.player.nextXPolarity = -1;
            }
    
            if(newCoordinate.y > this.player.y) {
                this.player.nextYStartTime = performance.now();
                this.player.nextYPolarity = 1;
            } else if(newCoordinate.y < this.player.y) {
                this.player.nextYStartTime = performance.now();
                this.player.nextYPolarity = -1;
            }   
            this.player.nextTravelDuration = loopInterval;
        }

        this.world.moveObject(this.player.ID,newCoordinate.x,newCoordinate.y);
    }

    const startMovementLoop = direction => {
        console.log("Started movement loop",direction);
        this.player.clearNextAnimationValues();
        loopFunction(direction);
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
            const collidesAtNextPosition = this.world.collides(
                nextPosition.x,nextPosition.y
            );
            this.player.setWalking(
                !collidesAtNextPosition
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
