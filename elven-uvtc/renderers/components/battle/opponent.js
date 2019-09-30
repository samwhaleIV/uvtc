import WorldPopup from "../world/popup.js";

const opponentXVelocity = 0.01;
const opponentYVelocity = 0.01;
const opponentSpriteKnockbackAmount = -17.5;
const spriteScale = 120;

function CustomTextRenderer(battleRenderer) {
    const margin = 5;
    const width = 300;
    const height = 150;

    const x = battleRenderer.lastOpponentCenterX - width / 2;
    const y = halfHeight - height / 2;


    context.fillStyle = "white";
    context.fillRect(x-margin,y-margin,width+margin+margin,height+margin+margin);


    BitmapText.drawTextWrappingLookAheadBlack(
        this.textFeed,
        x,y,
        width,
        3
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
            if(this.showingMessage) {
                this.showingMessage.terminate();
                this.showingMessage = null;
            }
            const effect = new WorldPopup([text],()=>{
                this.showingMessage.terminate();
                this.showingMessage = null;
            },null,false,this);
            effect.render = CustomTextRenderer.bind(effect,this);
            this.showingMessage = effect;
            this.foregroundEffects.addLayer(effect);
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
            return new Promise(resolve => {
                this.xTarget = null;
                this.yTarget = null;
                switch(direction) {
                    default:
                        return;
                    case "up":
                        this.updateDirection("down");
                        this.setWalking(true);
                        this.yTarget = this.y - amount;
                        break;
                    case "down":
                        this.updateDirection("down");
                        this.setWalking(true);
                        this.yTarget = this.y + amount;
                        break;
                    case "left":
                        this.updateDirection("left");
                        this.setWalking(true);
                        this.xTarget = this.x + amount;
                        break;
                    case "right":
                        this.updateDirection("right");
                        this.setWalking(true);
                        this.xTarget = this.x - amount;
                        break;
                }
                this.resolver = resolve;
            });
        },
        movementLogic: function(delta) {
            if(this.xTarget !== null) {
                const xVelocity = delta * opponentXVelocity;
                if(this.xTarget < this.x) {
                    this.x -= xVelocity;
                    if(this.x < this.xTarget) {
                        this.x = this.xTarget;
                        this.xTarget = null;
                        this.updateDirection("down");
                        this.setWalking(false);
                        this.resolver();
                    }
                } else if(this.xTarget > this.x) {
                    this.x += xVelocity;
                    if(this.x > this.xTarget) {
                        this.x = this.xTarget;
                        this.xTarget = null;
                        this.updateDirection("down");
                        this.setWalking(false);
                        this.resolver();
                    }
                }
            } else if(this.yTarget !== null) {
                const yVelocity = delta * opponentYVelocity;
                if(this.yTarget < this.y) {
                    this.y -= yVelocity;
                    if(this.y < this.yTarget) {
                        this.y = this.yTarget;
                        this.yTarget = null;
                        this.updateDirection("down");
                        this.setWalking(false);
                        this.resolver();
                    }
                } else if(this.yTarget > this.y) {
                    this.y += yVelocity;
                    if(this.y > this.yTarget) {
                        this.y = this.yTarget;
                        this.yTarget = null;
                        this.updateDirection("down");
                        this.setWalking(false);
                        this.resolver();
                    }
                }         
            }
        },
        render: (timestamp,showPunchEffect) => {
            let adjustedScale = spriteScale;
            let extraScale = 0;
            if(showPunchEffect) {
                extraScale = opponentSpriteKnockbackAmount;
            }
            this.opponentSprite.render(timestamp,adjustedScale,extraScale);
        }
    }
}
export default GetOpponent;
