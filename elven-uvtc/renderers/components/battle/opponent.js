import WorldPopup from "../../../../../elven-engine/renderers/components/world/popup.js";

const opponentXVelocity = 0.01;
const opponentYVelocity = 0.01;
const opponentSpriteKnockbackAmount = -7;

const TEXT_BOX_MARGIN = 12;
const TEXT_BOX_WIDTH = 600;
const TEXT_BOX_HEIGHT = 400;
const TEXT_BOX_HALF_WIDTH = TEXT_BOX_WIDTH / 2;
const TEXT_BOX_HALF_HEIGHT = TEXT_BOX_HEIGHT / 2;
const TEXT_BOX_RENDER_WIDTH = TEXT_BOX_WIDTH + TEXT_BOX_MARGIN * 2;
const TEXT_BOX_RENDER_HEIGHT = TEXT_BOX_HEIGHT + TEXT_BOX_MARGIN * 2;
const TEXT_BOX_TEXT_SCALE = 6;

function CustomTextRenderer() {

    const x = Math.round(halfWidth - TEXT_BOX_HALF_WIDTH);
    const y = Math.round(halfHeight - TEXT_BOX_HALF_HEIGHT);

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
    //Anonymous functions are in the global battle rendererer scope, function expressions are in the opponent scope
    //For instance, "this" of "say(text)" is global while "this" of "move(x,y)" is local
    //To access the battle renderer from local, use "this.battleRenderer"
    //To access local from global, use "this.opponent"
    return {
        y: 0,
        x: 0,
        xTarget: null,
        yTarget: null,
        resolver: null,
        sprite: null,
        battleRenderer: this,
        lastSpecialFrame: null,
        say: text => {
            return new Promise(callback=>{
                const clearMessage = () => {
                    if(this.showingMessage) {
                        if(this.showingMessage.callback) {
                            this.showingMessage.callback();
                        }
                        this.showingMessage.terminate();
                        this.showingMessage = null;
                    }
                }
                clearMessage();
                const effect = new WorldPopup(
                    [text],clearMessage,null,false
                );
                effect.callback = callback;
                effect.render = CustomTextRenderer;
                this.showingMessage = effect;
                this.globalEffects.addLayer(effect);
            });
        },
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
        stopMove: function() {
            if(this.resolver) {
                this.resolver();
                this.resolver = null;
            }
            this.xTarget = null;
            this.yTarget = null;
            this.sprite.updateDirection("down");
            this.sprite.setWalking(false);
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
                this.sprite.updateDirection(newDirection);
                this.sprite.setWalking(true);
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
                this.sprite.updateDirection("down");
                this.sprite.setWalking(false);
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
        render: function(timestamp,showPunchEffect) {
            let extraScale = 0;
            if(showPunchEffect) {
                extraScale = opponentSpriteKnockbackAmount;
                if(!this.lastSpecialFrame && this.impactFrame >= 0 && this.sprite.direction === "down") {
                    const currentSpecialFrame = this.sprite.getSpecialFrame();
                    if(currentSpecialFrame === null) {
                        this.lastSpecialFrame = -1;
                    } else {
                        this.lastSpecialFrame = currentSpecialFrame;
                    }
                    this.sprite.setSpecialFrame(this.impactFrame);
                }
                if(this.impactFrame >= 0 &&
                   this.sprite.direction === "down" &&
                  !this.lastSpecialFrame &&
                  (this.lastSpecialFrame = this.sprite.getSpecialFrame()) !== null
                ) {
                    this.sprite.setSpecialFrame(this.impactFrame);
                }
            } else if(this.lastSpecialFrame !== null) {
                if(this.lastSpecialFrame >= 0) {
                    this.sprite.setSpecialFrame(this.lastSpecialFrame);
                } else {
                    this.sprite.updateDirection(this.sprite.direction);
                }
                this.lastSpecialFrame = null;
            }
            this.sprite.renderToForeground(timestamp,extraScale);
        }
    }
}
export default GetOpponent;
