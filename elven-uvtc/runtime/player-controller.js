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

    const movementDistance = 0.05;
    const movementLoopInterval = 20;

    this.horizontalVelocity = 0;
    this.verticalVelocity = 0;
    let movementLoop = -1;

    const cornerCollisionThreshold = 0.1;
    const inverseCornerCollisionThreshold = -cornerCollisionThreshold


    const tryMoveUp = () => {
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
    const tryMoveDown = () => {
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
    const tryMoveLeft = () => {
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
    const tryMoveRight = () => {
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

    const movementLoopMethod = () => {
        if(this.horizontalVelocity > 0) {
            this.player.setWalking(tryMoveRight());
        } else if(this.horizontalVelocity < 0) {
            this.player.setWalking(tryMoveLeft());
        }
        if(this.verticalVelocity > 0) {
            this.player.setWalking(tryMoveDown());
        } else if(this.verticalVelocity < 0) {
            this.player.setWalking(tryMoveUp());
        }
    }

    const startMovementLoop = () => {
        movementLoop = setInterval(
            movementLoopMethod,
            movementLoopInterval
        );
    }
    const stopMovementLoop = () => {
        clearInterval(movementLoop);
        this.player.setWalking(false);
        movementLoop = -1;
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
        if(startDirection !== this.player.direction) {
            applyPlayerVelocities();
        }
        if(movementDown()) {
            if(movementLoop < 0) {
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
        }
        const soloMovementRegister = checkForSoloMovement();
        if(soloMovementRegister >= 0) {
            const startDirection = this.player.direction;
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
            if(startDirection !== this.player.direction) {
                applyPlayerVelocities();
            }
        } else {
            stopMovementLoop();
        }
    }
}
