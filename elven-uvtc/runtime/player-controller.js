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
        if(count >= 1) {
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

    const processEnter = () => {
        if(this.player.isWalking() || this.world.playerInteractionLocked()) {
            return;
        }
        const pulseLocation = addDirectionToCoordinate(
            this.player.x + Math.round(this.player.xOffset),
            this.player.y + Math.round(this.player.yOffset),
            this.player.direction
        );
        const collisionState = this.world.getCollisionState(
            pulseLocation.x,pulseLocation.y,true
        );
        if(collisionState.object) {
            if(collisionState.object.interacted) {
                collisionState.object.interacted(
                    pulseLocation.x,
                    pulseLocation.y,
                    invertDirection(this.player.direction)
                );
            }
        } else if(collisionState.map) {
            switch(collisionState.map) {
                case 2:
                    this.world.map.doorClicked(
                        this.world.renderMap.doorLookup[
                            pulseLocation.x
                        ][
                            pulseLocation.y
                        ]
                    );
                    break;
                default:
                    this.world.map.otherClicked(
                        collisionState.map,
                        pulseLocation.x,
                        pulseLocation.y
                    );
                    break;
            }
        }
    }

    const tilesPerSecond = 5;
    const maxDelta = 50;

    this.horizontalVelocity = 0;
    this.verticalVelocity = 0;

    const cornerCollisionThreshold = 0.15;
    const inverseCornerCollisionThreshold = -cornerCollisionThreshold;

    const tryMoveUp = movementDistance => {
        let horizontalCollision = false;

        if(this.player.xOffset > cornerCollisionThreshold) {
            horizontalCollision = this.world.collides(
                this.player.x+1,
                this.player.y-1,
                this.player.ID
            );
        } else if(this.player.xOffset < inverseCornerCollisionThreshold) {
            horizontalCollision = this.world.collides(
                this.player.x-1,
                this.player.y-1,
                this.player.ID
            );
        }

        if((this.world.collides(this.player.x,this.player.y-1,this.player.ID) || horizontalCollision) && this.player.yOffset < 0) {
            return false;
        }

        this.player.yOffset -= movementDistance;
        if(this.player.yOffset < -1) {
            this.player.yOffset++;
            this.world.moveObject(
                this.player.ID,
                this.player.x,
                this.player.y-1
            );
        }
        return true;
    }
    const tryMoveDown = movementDistance => {
        let horizontalCollision = false;

        if(this.player.xOffset > cornerCollisionThreshold) {
            horizontalCollision = this.world.collides(
                this.player.x+1,
                this.player.y+1,
                this.player.ID
            );
        } else if(this.player.xOffset < inverseCornerCollisionThreshold) {
            horizontalCollision = this.world.collides(
                this.player.x-1,
                this.player.y+1,
                this.player.ID
            );
        }

        if((this.world.collides(this.player.x,this.player.y+1,this.player.ID) || horizontalCollision) && this.player.yOffset > 0) {
            return false;
        }
        this.player.yOffset += movementDistance;
        if(this.player.yOffset > 1) {
            this.player.yOffset--;
            this.world.moveObject(
                this.player.ID,
                this.player.x,
                this.player.y+1
            );
        }
        return true;
    }
    const tryMoveLeft = movementDistance => {
        let verticalCollision = false;

        if(this.player.yOffset > cornerCollisionThreshold) {
            verticalCollision = this.world.collides(
                this.player.x-1,
                this.player.y+1,
                this.player.ID
            );
        } else if(this.player.yOffset < inverseCornerCollisionThreshold) {
            verticalCollision = this.world.collides(
                this.player.x-1,
                this.player.y-1,
                this.player.ID
            );
        }

        if((this.world.collides(this.player.x-1,this.player.y,this.player.ID) || verticalCollision) && this.player.xOffset < 0) {
            return false;
        }

        this.player.xOffset -= movementDistance;
        if(this.player.xOffset < -1) {
            this.player.xOffset++;
            this.world.moveObject(
                this.player.ID,
                this.player.x-1,
                this.player.y
            );
        }
        return true;
    }
    const tryMoveRight = movementDistance => {
        let verticalCollision = false;

        if(this.player.yOffset > cornerCollisionThreshold) {
            verticalCollision = this.world.collides(
                this.player.x+1,
                this.player.y+1,
                this.player.ID
            );
        } else if(this.player.yOffset < inverseCornerCollisionThreshold) {
            verticalCollision = this.world.collides(
                this.player.x+1,
                this.player.y-1,
                this.player.ID
            );
        }

        if((this.world.collides(this.player.x+1,this.player.y,this.player.ID) || verticalCollision) && this.player.xOffset > 0) {
            return false;
        }

        this.player.xOffset += movementDistance;
        if(this.player.xOffset > 1) {
            this.player.xOffset--;
            this.world.moveObject(
                this.player.ID,
                this.player.x+1,
                this.player.y
            );
        }
        return true;
    }

    let lastFrame = 0;
    const movementMethod = timestamp => {
        const delta = timestamp - lastFrame;
        lastFrame = timestamp;
        if(delta > maxDelta) {
            console.warn("Player controller: Dropped movement frame");
            return;
        }
        const movementDistance = delta / 1000 * tilesPerSecond;

        if(this.horizontalVelocity > 0) {
            this.player.setWalking(tryMoveRight(movementDistance));
        } else if(this.horizontalVelocity < 0) {
            this.player.setWalking(tryMoveLeft(movementDistance));
        }
        if(this.verticalVelocity > 0) {
            this.player.setWalking(tryMoveDown(movementDistance));
        } else if(this.verticalVelocity < 0) {
            this.player.setWalking(tryMoveUp(movementDistance));
        }
    }

    let loopRunning = false;
    this.renderMethod = null;

    const startMovementLoop = () => {
        lastFrame = performance.now();
        loopRunning = true;
        this.renderMethod = movementMethod;
    }
    const stopMovementLoop = () => {
        this.renderMethod = null;
        loopRunning = false;
        this.player.setWalking(false);
    }

    const applyPlayerVelocities = none => {
        this.horizontalVelocity = 0;
        this.verticalVelocity = 0;
        if(none) {
            return;
        }
        switch(this.player.direction) {
            case "up":
                this.verticalVelocity = -1;
                break;
            case "down":
                this.verticalVelocity = 1;
                break;
            case "left":
                this.horizontalVelocity = -1;
                break;
            case "right":
                this.horizontalVelocity = 1;
                break;
        }
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
            case "Enter":
                processEnter();
                return;
        }
        applyPlayerVelocities();
        if(movementDown()) {
            if(!loopRunning) {
                startMovementLoop();
            }
        }
    }
    this.processKeyUp = function(key) {
        switch(key) {
            case "KeyW":
                wDown = false;
                break;
            case "KeyS":
                sDown = false;
                break;
            case "KeyA":
                aDown = false;
                break;
            case "KeyD":
                dDown = false;
                break;
            case "Enter":
                return;
        }
        const soloMovementRegister = checkForSoloMovement();
        if(soloMovementRegister >= 0) {
            switch(soloMovementRegister) {
                case 0:
                    this.player.updateDirection("up");
                    break;
                case 1:
                    this.player.updateDirection("down");
                    break;
                case 2:
                    this.player.updateDirection("left");
                    break;
                case 3:
                    this.player.updateDirection("right");
                    break;
            }
            applyPlayerVelocities();
        } else {
            stopMovementLoop();
        }
    }
}
export default PlayerController;
