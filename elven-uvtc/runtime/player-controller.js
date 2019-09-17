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
                    if(collisionState.map < LogicLayerInteractStart) {
                        break;
                    }
                    const worldClickedMethod = this.world.map.worldClicked;
                    if(worldClickedMethod) {
                        worldClickedMethod(
                            collisionState.map,
                            pulseLocation.x,
                            pulseLocation.y
                        );
                    }
                    break;
            }
        } else {
            const otherClickedMethod = this.world.map.otherClicked;
            if(otherClickedMethod) {
                otherClickedMethod(
                    pulseLocation.x,
                    pulseLocation.y,
                    invertDirection(this.player.direction)
                );
            }
        }
    }

    const tilesPerSecond = 5;
    const maxDelta = 50;

    this.horizontalVelocity = 0;
    this.verticalVelocity = 0;

    const cornerCollisionThreshold = 0;
    const inverseCornerCollisionThreshold = 0;

    const getSideCollision = (target,xDifference,yDifference) => {
        const offset = this.player[target];
        if(yDifference) {
            if(offset > cornerCollisionThreshold) {
                return this.world.collides(this.player.x+1,this.player.y+yDifference,this.player.ID);
            } else if(offset < 0) {
                return this.world.collides(this.player.x-1,this.player.y+yDifference,this.player.ID);
            }
        } else if(xDifference) {
            if(offset > inverseCornerCollisionThreshold) {
                return this.world.collides(this.player.x+xDifference,this.player.y+1,this.player.ID);
            } else if(offset < 0) {
                return this.world.collides(this.player.x+xDifference,this.player.y-1,this.player.ID);
            }
        }
        return false;
    }
    const polarizedEvaluation = (value,compareTo,positiveDifference) => {
        if(positiveDifference) {
            return value >= compareTo;
        } else {
            return value <= compareTo;
        }
    }
    const polarizedOverflowEvaluation = (value,positiveDifference) => {
        if(positiveDifference) {
            return value > 1;
        } else {
            return value < -1;
        }
    }
    const tryMove = (movementDistance,xDifference,yDifference) => {
        //Welcome to Hell.
        let positiveDifference, offsetTarget, sideTarget;
        if(xDifference) {
            positiveDifference = xDifference > 0;
            offsetTarget = "xOffset";
            sideTarget = "yOffset";
        } else if(yDifference) {
            positiveDifference = yDifference > 0;
            offsetTarget = "yOffset";
            sideTarget = "xOffset";
        } else {
            return false;
        }
        const sideCollision = getSideCollision(sideTarget,xDifference,yDifference);
        const valueAtThreshold = polarizedEvaluation(this.player[offsetTarget],0,positiveDifference);
        const lookAheadCollision = this.world.collides(
            this.player.x+xDifference,
            this.player.y+yDifference,
            this.player.ID
        );
        if((lookAheadCollision || sideCollision) && valueAtThreshold) {
            //console.log("Dead stop - Maximum position already reached");
            this.player[offsetTarget] = 0;
            return false;
        }

        this.player[offsetTarget] += movementDistance;
        const spaceThresholdReached = polarizedEvaluation(this.player[offsetTarget],0,positiveDifference);
        if((lookAheadCollision || sideCollision) && spaceThresholdReached) {
            //console.log("Dead stop - Already in XY space");
            this.player[offsetTarget] = 0;
            return false;    
        }
        const valueOverflowing = polarizedOverflowEvaluation(this.player[offsetTarget],positiveDifference);
        if(valueOverflowing) {
            if(positiveDifference) {
                this.player[offsetTarget]--;
            } else {
                this.player[offsetTarget]++;
            }
            this.world.moveObject(
                this.player.ID,
                this.player.x+xDifference,
                this.player.y+yDifference
            );
            const newSideCollision = getSideCollision(sideTarget,xDifference,yDifference);
            const newLookAhead = this.world.collides(
                this.player.x+xDifference,
                this.player.y+yDifference,
                this.player.ID
            );
            const newThreshold = polarizedEvaluation(this.player[offsetTarget],0,positiveDifference);
            if((newLookAhead || newSideCollision) && newThreshold) {
                //console.log("Dead stop - Post movement update");
                this.player[offsetTarget] = 0;
                return false;
            }
        }
        return true;
    }

    let lastFrame = null;

    let lastXOffset = 0;
    let lastXPolarity = false;

    let pendingDirection = null;

    const tryApplySoloMovementRegister = () => {
        const soloMovementRegister = checkForSoloMovement();
        if(soloMovementRegister >= 0) {
            switch(soloMovementRegister) {
                case 0:
                    tryUpdateDirection("up");
                    break;
                case 1:
                    tryUpdateDirection("down");
                    break;
                case 2:
                    tryUpdateDirection("left");
                    break;
                case 3:
                    tryUpdateDirection("right");
                    break;
            }
            applyPlayerVelocities();
            return true;
        } else {
            return false;
        }
    }

    const movementMethod = timestamp => {
        if(pendingDirection) {
            this.player.updateDirection(pendingDirection);
            applyPlayerVelocities();
            pendingDirection = null;
        }
        if(ENV_FLAGS.DEBUG_MICRO_SHIFT) {
            if(lastXOffset > this.player.xOffset) {
                if(!lastXPolarity) {
                    console.log("Player controller: Micro direction shift!");
                }
                lastXPolarity = true;
            } else {
                if(lastXPolarity) {
                    console.log("Player controller: Micro direction shift!");
                }
                lastXPolarity = false;
            }
            lastXOffset = this.player.xOffset;
            console.log(this.player.xOffset);
        }
        if(!lastFrame) {
            lastFrame = timestamp;
        }
        const delta = timestamp - lastFrame;
        lastFrame = timestamp;
        if(delta > maxDelta) {
            if(ENV_FLAGS.MOVEMENT_FRAME_WARNING) {
                console.warn("Player controller: Dropped movement frame");
            }
            return;
        }
        const movementDistance = delta / 1000 * tilesPerSecond;

        if(this.horizontalVelocity > 0) {
            this.player.setWalking(tryMove(movementDistance,1,0));
        } else if(this.horizontalVelocity < 0) {
            this.player.setWalking(tryMove(-movementDistance,-1,0));
        }
        if(this.verticalVelocity > 0) {
            this.player.setWalking(tryMove(movementDistance,0,1));
        } else if(this.verticalVelocity < 0) {
            this.player.setWalking(tryMove(-movementDistance,0,-1));
        }
        if(this.world.map.triggerActive || this.world.map.triggerActivationMask) {
            this.player.impulseTrigger(this.world);
        }
    }

    let loopRunning = false;
    this.renderMethod = null;

    const startMovementLoop = () => {
        loopRunning = true;
        this.renderMethod = movementMethod;
    }
    const stopMovementLoop = () => {
        this.renderMethod = null;
        loopRunning = false;
        lastFrame = null;
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

    const tryUpdateDirection = direction => {
        if(this.world.playerInteractionLocked()) {
            pendingDirection = direction;
            return;
        }
        this.player.updateDirection(direction);
    }

    this.processKey = function(key) {
        const worldHasPlayer = this.player ? true : false;
        switch(key) {
            case kc.up:
                wDown = true;
                if(!worldHasPlayer) {
                    return;
                }
                tryUpdateDirection("up");
                break;
            case kc.down:
                sDown = true;
                if(!worldHasPlayer) {
                    return;
                }
                tryUpdateDirection("down");
                break;
            case kc.left:
                aDown = true;
                if(!worldHasPlayer) {
                    return;
                }
                tryUpdateDirection("left");
                break;
            case kc.right:
                dDown = true;
                if(!worldHasPlayer) {
                    return;
                }
                tryUpdateDirection("right");
                break;
            case kc.accept:
                if(!worldHasPlayer) {
                    return;
                }
                processEnter();
                return;
        }
        applyPlayerVelocities();
        if(movementDown() && !loopRunning) {
            startMovementLoop();
        }
    }
    this.processKeyUp = function(key) {
        const worldHasPlayer = this.player ? true : false;
        switch(key) {
            case kc.up:
                wDown = false;
                break;
            case kc.down:
                sDown = false;
                break;
            case kc.left:
                aDown = false;
                break;
            case kc.right:
                dDown = false;
                break;
            default:
                return;
        }
        if(!worldHasPlayer) {
            return;
        }
        if(!tryApplySoloMovementRegister()) {
            pendingDirection = null;
            stopMovementLoop();
        }
    }
}
export default PlayerController;
