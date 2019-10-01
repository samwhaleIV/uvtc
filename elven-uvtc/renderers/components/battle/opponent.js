import WorldPopup from "../world/popup.js";

const opponentXVelocity = 0.01;
const opponentYVelocity = 0.01;
const opponentSpriteKnockbackAmount = -7;
const spriteScale = 120;

const TEXT_BOX_MARGIN = 4;
const TEXT_BOX_WIDTH = 225;
const TEXT_BOX_HEIGHT = 150;
const TEXT_BOX_HALF_WIDTH = TEXT_BOX_WIDTH / 2;
const TEXT_BOX_HALF_HEIGHT = TEXT_BOX_HEIGHT / 2;
const TEXT_BOX_RENDER_WIDTH = TEXT_BOX_WIDTH + TEXT_BOX_MARGIN * 2;
const TEXT_BOX_RENDER_HEIGHT = TEXT_BOX_HEIGHT + TEXT_BOX_MARGIN * 2;
const TEXT_BOX_TEXT_SCALE = 2;

function CustomTextRenderer(battleRenderer) {
    const x = halfWidth - TEXT_BOX_HALF_WIDTH
    const y = halfHeight - TEXT_BOX_HALF_HEIGHT;

    context.fillStyle = "white";
    context.fillRect(
        x-TEXT_BOX_MARGIN,
        y-TEXT_BOX_MARGIN,
        TEXT_BOX_RENDER_WIDTH,
        TEXT_BOX_RENDER_HEIGHT
    );

    BitmapText.drawTextWrappingLookAheadBlack(
        this.textFeed,
        x,y,
        TEXT_BOX_WIDTH,
        TEXT_BOX_TEXT_SCALE
    );
}

function GetOpponent() {
    return {
        y: 0,
        x: 0,
        xTarget: null,
        yTarget: null,
        resolver: null,
        say: text => {
            return new Promise(callback=>{
                if(this.showingMessage) {
                    if(this.showingMessage.callback) {
                        this.showingMessage.callback();
                    }
                    this.showingMessage.terminate();
                    this.showingMessage = null;
                }
                const effect = new WorldPopup([text],()=>{
                    if(this.showingMessage.callback) {
                        this.showingMessage.callback();
                    }
                    this.showingMessage.terminate();
                    this.showingMessage = null;
                },null,false,this);
                effect.callback = callback;
                effect.render = CustomTextRenderer.bind(effect,this);
                this.showingMessage = effect;
                this.foregroundEffects.addLayer(effect);
            });
        },
        setWalking: isWalking => this.opponentSprite.sprite.setWalking(isWalking),
        updateDirection: direction => this.opponentSprite.sprite.updateDirection(direction),
        move: async function(x,y) {
            if(x) {
                if(x > 0) {
                    await this.moveBy("left",x);
                } else if(x < 0) {
                    await this.moveBy("right",-x);
                }
            } else if(y) {
                if(y > 0) {
                    await this.moveBy("down",y);
                } else if(y < 0) {
                    await this.moveBy("up",-y);
                }
            }
        },
        moveBy: function(direction,amount) {
            this.xTarget = null;
            this.yTarget = null;
            return new Promise(resolve => {
                let newDirection = direction;
                switch(direction) {
                    default: return;

                    case "up":
                        newDirection = "down";
                        this.yTarget = this.y - amount; break;

                    case "down":
                        this.yTarget = this.y + amount; break;

                    case "left":
                        this.xTarget = this.x + amount; break;

                    case "right":
                        this.xTarget = this.x - amount; break;
                }
                this.updateDirection(newDirection);
                this.setWalking(true);
                this.resolver = resolve;
            });
        },
        movementLoop: function(source,target,velocity) {
            let shouldEnd = false;
            if(target < source) {
                source -= velocity;
                if(source < target) {
                    shouldEnd = true;
                }
            } else if(target > source) {
                source += velocity;
                if(source > target) {
                    shouldEnd = true;
                }
            }
            if(shouldEnd) {
                source = target;
                target = null;
                this.updateDirection("down");
                this.setWalking(false);
                this.resolver();
            }
            return {
                source: source,
                target: target
            }
        },
        mapSourceAndTarget: function(property,tuple) {
            this[property + "Target"] = tuple.target;
            this[property] = tuple.source;
        },
        movementLogic: function(delta) {
            if(this.xTarget !== null) {
                const xVelocity = delta * opponentXVelocity;
                this.mapSourceAndTarget(
                    "x",this.movementLoop(this.x,this.xTarget,xVelocity)
                );
            } else if(this.yTarget !== null) {
                const yVelocity = delta * opponentYVelocity;
                this.mapSourceAndTarget(
                    "y",this.movementLoop(this.y,this.yTarget,yVelocity)
                );
            }
        },
        battleRenderer: this,
        lastSpecialFrame: null,
        render: function(timestamp,showPunchEffect) {
            const opponentLevelSprite = this.battleRenderer.opponentSprite;
            const sprite = opponentLevelSprite.sprite;
            let adjustedScale = spriteScale;
            let extraScale = 0;
            if(showPunchEffect) {
                extraScale = opponentSpriteKnockbackAmount;
                if(!this.lastSpecialFrame && this.impactFrame >= 0 && sprite.direction === "down") {
                    const currentSpecialFrame = sprite.getSpecialFrame();
                    if(currentSpecialFrame === null) {
                        this.lastSpecialFrame = -1;
                    } else {
                        this.lastSpecialFrame = currentSpecialFrame;
                    }
                    sprite.setSpecialFrame(this.impactFrame);
                }
                if(this.impactFrame >= 0 &&
                   sprite.direction === "down" &&
                  !this.lastSpecialFrame &&
                  (this.lastSpecialFrame = sprite.getSpecialFrame()) !== null
                ) {
                    sprite.setSpecialFrame(this.impactFrame);
                }
            } else if(this.lastSpecialFrame !== null) {
                if(this.lastSpecialFrame >= 0) {
                    sprite.setSpecialFrame(this.lastSpecialFrame);
                } else {
                    sprite.updateDirection("down");
                }
                this.lastSpecialFrame = null;
            }
            opponentLevelSprite.render(timestamp,adjustedScale,extraScale);
        }
    }
}
export default GetOpponent;
