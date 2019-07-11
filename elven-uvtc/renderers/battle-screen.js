import BattleSequencer from "../runtime/battle/battle-sequencer.js";
import RenderStatus from "./components/battle/status.js";
import RenderMove from "./components/battle/move.js";

const HEALTH_FLASH_TIME = 100;
const FULL_TEXT_TRANSITION_TIME = 200;
const circleTraceTime = 1200;
const circleFillTime = 600;
const backgroundSaturateTime = 1700;
const saturatePopExponent = 4; //Higher numbers are more abrupt
const centerCircleOffset = 20;
const outerRingRadius = 4;

function BattleScreenRenderer(winCallback,loseCallback,...sequencerParameters) {

    const hoverTypes = {
        none: 0,
        m1: 1,
        m2: 2,
        m3: 3,
        m4: 4
    };
    let hoverType = hoverTypes.none;

    const m1 = getPlaceholderLocation();
    const m2 = getPlaceholderLocation();
    const m3 = getPlaceholderLocation();
    const m4 = getPlaceholderLocation();
    m1.hoverType = hoverTypes.m1;
    m2.hoverType = hoverTypes.m2;
    m3.hoverType = hoverTypes.m3;
    m4.hoverType = hoverTypes.m4;

    const moveRenderAreas = [m1,m2,m3,m4];

    this.noPixelScale = true;
    this.disableAdaptiveFill = false;

    this.foreground = null;
    this.leftName = null;
    this.rightName = null;

    this.leftHealth = null;
    this.rightHealth = null;
    this.leftHealthNormal = null;
    this.rightHealthNormal = null;

    let playerMoves = [];
    this.marqueeText = null;
    this.fullText = null;

    let leavingText = null;
    let fullTextStart = null;
    let fullTextLeaveStartTime = null;

    this.leftStatuses = [];
    this.rightStatuses = [];

    let showPlayerHealthTimeout;
    let showOpponentHealthTimeout;

    let playerHealthFlashed = false;
    let opponentHealthFlashed = false;

    const flashHealth = isPlayer => {
        if(isPlayer) {
            clearTimeout(showPlayerHealthTimeout);
            playerHealthFlashed = true;
            showPlayerHealthTimeout = setTimeout(()=>{
                playerHealthFlashed = false;
            },HEALTH_FLASH_TIME);
        } else {
            clearTimeout(showOpponentHealthTimeout);
            opponentHealthFlashed = true;
            showOpponentHealthTimeout = setTimeout(()=>{
                opponentHealthFlashed = false;
            },HEALTH_FLASH_TIME);
        }
    }
    this.flashHealthAdded = isPlayer => {
        playSound("heal");
        flashHealth(isPlayer);
        if(!isPlayer) {
            if(this.foreground && this.foreground.healthAdded) {
                this.foreground.healthAdded();
            }
        }
    };
    this.flashHealthDropped = isPlayer => {
        playSound("damage");
        flashHealth(isPlayer);
        if(!isPlayer) {
            if(this.foreground && this.foreground.healthDropped) {
                this.foreground.healthDropped();
            }
        }
    };
    this.someoneDied = isPlayer => {
    };
    this.showFullText = text => {
        leavingText = null;
        fullTextLeaveStartTime = null;
        this.fullText = processTextForWrapping(text);
    };
    this.clearFullText = () => {
        leavingText = this.fullText;
        this.fullText = null;
        fullTextStart = null;
    };
    let playerActionResolver = null;
    const playerActionPromise = () => {
        return new Promise(resolve=>{
            playerActionResolver = resolve;
        });
    };
    this.getAction = async () => {
        return playerActionPromise();
    };
    let moveUpdateFlagged = false;
    this.updatePlayerMoves = newMoves => {
        playerMoves = newMoves;
        moveUpdateFlagged = true;
    }

    this.sequencer = new BattleSequencer(winCallback,loseCallback,...sequencerParameters);
    this.sequencer.bindToBattleScreen(this);
    this.sequencer.startBattle();


    this.processMove = (x,y) => {
        if(contains(x,y,m1)) {
            hoverType = m1.hoverType;
        } else if(contains(x,y,m2)) {
            hoverType = m2.hoverType;
        } else if(contains(x,y,m3)) {
            hoverType = m3.hoverType;
        } else if(contains(x,y,m4)) {
            hoverType = m4.hoverType;
        } else {
            hoverType = hoverTypes.none;
        }
    }

    this.processClick = (x,y) => {
        this.processMove(x,y);
    }
    this.processClickEnd = () => {
        switch(hoverType) {
            case hoverTypes.m1:
            case hoverTypes.m2:
            case hoverTypes.m3:
            case hoverTypes.m4:
                if(hoverType > playerMoves.length) {
                    break;
                }
                if(playerActionResolver) {
                    playerActionResolver(hoverType-1);
                    playerActionResolver = null;
                }
                playSound("click");
                break;
        }
    }

    let startTime = null;
    const renderOuterRing = radius => {
        if(this.style.noOuterRing) {
            return;
        }
        context.fillStyle = this.style.holeRingColor;
        context.arc(halfWidth,halfHeight+centerCircleOffset,radius+outerRingRadius,0,PI2);
        context.fill();
    }
    const renderInnerRing = radius => {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(halfWidth,halfHeight+centerCircleOffset,radius,0,PI2);
        context.fill();
    }

    const statusRollImage = imageDictionary["ui/status-roll"];
    const statusFill = imageDictionary["ui/status-fill"];

    const renderHealthIcon = (x,y,width,height,value) => {
        context.drawImage(statusRollImage,32*value,0,32,32,x,y,width,height);
    }

    const renderMovesArea = (timestamp,x,y,width,height) => {
        context.fillStyle = "rgba(255,255,255,0.93)";
        context.fillRect(x,y,width,height);
        context.fillStyle = "white";

        const textAreaX = x+20;
        const textAreaY = y-30;
        const textAreaWidth = width - 40;
        const textAreaHeight = 60;
        context.fillRect(textAreaX,textAreaY,textAreaWidth,textAreaHeight);

        if(this.marqueeText) {
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.font = "100 22px Roboto";

            const textX = textAreaX + textAreaWidth/2;
            const textY = textAreaY + textAreaHeight/2;
            const textWidth = context.measureText(this.marqueeText).width;
            const halfTextWidth = textWidth/2;
            const textPadding = 5;
            context.fillStyle = "black";
            context.fillRect(
                Math.round(textX-halfTextWidth-textPadding-textPadding),
                Math.ceil(textAreaY+textPadding),
                Math.floor(textWidth+textPadding+textPadding+textPadding+textPadding),
                textAreaHeight-textPadding-textPadding
            );

            context.fillStyle = "white";
            context.fillText(
                this.marqueeText,
                textX,
                textY
            );
        }
        const moveMargin = 15;
        let i = 0;
        const moveHeight = height - 50-10;
        const moveY = y + 45;
        let xOffset = Math.round(x + width / 2 - (playerMoves.length * (moveHeight + moveMargin)-moveMargin) / 2);
        while(i<playerMoves.length) {
            const moveLocation = moveRenderAreas[i];
            moveLocation.x = xOffset;
            moveLocation.y = moveY;
            moveLocation.width = moveHeight;
            moveLocation.height = moveHeight;
            RenderMove(
                playerMoves[i],
                xOffset,
                moveY,
                moveHeight,
                hoverType === moveLocation.hoverType,
                false
            );
            xOffset += moveHeight + moveMargin;
            i++;
        }
        if(moveUpdateFlagged) {
            moveUpdateFlagged = false;
            this.processMove(lastRelativeX,lastRelativeY);
        }
    }

    const renderStatusArea = (x,y,width,height,rightAlignment) => {
        let statusAreaBorderWidth = 8;
        let textNameScale;
        if(greaterWidth) {
            textNameScale = Math.floor(height / 26);
            statusAreaBorderWidth = Math.floor(height / 20);
        } else {
            textNameScale = Math.floor(width / 100);
            statusAreaBorderWidth = Math.floor(width / 60);
        }
        if(textNameScale < 1) {
            textNameScale = 1;
        }

        const healthBarHeight = Math.ceil(height / 2);

        const doubleBorderWidth = statusAreaBorderWidth + statusAreaBorderWidth;

        context.shadowBlur = 4; 
        context.shadowColor = "rgba(0,0,0,0.25)";

        let boxBorderColor, boxColor, boxHealthColor, name, statuses, healthCount, healthNormal;
        if(rightAlignment) {
            boxBorderColor = this.style.rightBoxBorder;
            boxColor = playerHealthFlashed ? "white" : this.style.rightBoxColor;
            boxHealthColor = this.style.rightBoxHealth;
            name = this.rightName;
            statuses = this.rightStatuses;
            healthCount = this.rightHealth;
            healthNormal = this.rightHealthNormal;
        } else {
            boxBorderColor = this.style.leftBoxBorder;
            boxColor = opponentHealthFlashed ? "white" : this.style.leftBoxColor;
            boxHealthColor = this.style.leftBoxHealth;
            name = this.leftName;
            statuses = this.leftStatuses;
            healthCount = this.leftHealth;
            healthNormal = this.leftHealthNormal;
        }

        context.fillStyle = boxBorderColor;
        context.fillRect(x,y,width,height);
        context.shadowBlur = 0;

        const healthBarY = y+height-healthBarHeight;

        context.fillStyle = "white";
        context.fillRect(x,healthBarY,width,healthBarHeight);

        context.fillStyle = boxHealthColor;
        let healthX;
        let healthWidth = width * healthNormal;
        if(healthNormal > 1) {
            healthWidth = width;
        }
        if(rightAlignment) {
            healthX = x + width - healthWidth;
        } else {
            healthX = x;
        }
        context.fillRect(healthX,healthBarY,healthWidth,healthBarHeight);

        context.fillStyle = boxColor;
        const innerAreaHeight = height-doubleBorderWidth;
        const innerAreaY = y+statusAreaBorderWidth;
        const innerAreaX = x+statusAreaBorderWidth;
        const innerAreaWidth = width-doubleBorderWidth;

        context.drawImage(statusFill,0,0,statusFill.width,statusFill.height,innerAreaX,innerAreaY,innerAreaWidth,innerAreaHeight);
        context.save();
        context.globalCompositeOperation = "multiply";
        context.fillRect(
            innerAreaX,
            innerAreaY,
            innerAreaWidth,
            innerAreaHeight
        );
        context.restore();

        let imageX;
        const imageHeight = innerAreaHeight-doubleBorderWidth;
        if(rightAlignment) {
            imageX = innerAreaX + statusAreaBorderWidth;
        } else {
            imageX = innerAreaX + innerAreaWidth - statusAreaBorderWidth - imageHeight;
        }

        const textHeight = BitmapText.drawTextTest(name,textNameScale).height+statusAreaBorderWidth;

        context.fillStyle = "black";

        //Get ready for this one... LMAO
        const textBackgroundWidth = innerAreaWidth-doubleBorderWidth-statusAreaBorderWidth-imageHeight;
        const textBackgroundX = rightAlignment ?  innerAreaX + doubleBorderWidth + imageHeight : innerAreaX+statusAreaBorderWidth;
        const textBackgroundHeight = Math.round(textHeight+statusAreaBorderWidth);
        const textBackgroundY = innerAreaY+statusAreaBorderWidth

        context.fillRect(
            textBackgroundX,
            textBackgroundY,
            textBackgroundWidth,
            textBackgroundHeight
        );


        BitmapText.drawTextWhite(name,textBackgroundX+statusAreaBorderWidth,innerAreaY+doubleBorderWidth,textNameScale);

        const statusHeight = innerAreaHeight - textHeight - doubleBorderWidth - doubleBorderWidth;

        const statusY = textBackgroundY + textBackgroundHeight + statusAreaBorderWidth;

        let i = 0;
        while(i<statuses.length) {
            RenderStatus(
                statuses[i],
                textBackgroundX + i * (statusHeight+statusAreaBorderWidth),
                statusY,
                statusHeight,
                statusHeight
            );
            i++;
        }

        renderHealthIcon(
            imageX,
            innerAreaY+statusAreaBorderWidth,
            imageHeight,
            imageHeight,
            healthCount
        );

    }

    const getFractionalArea = (basePos,baseSize,pos,size) => {
        return {
            pos: basePos + Math.round(pos * baseSize),
            size: Math.round(baseSize * size)
        };
    }

    const renderInterfaceElements = (timestamp,x,y,width,height) => {
        const verticalStatusArea = getFractionalArea(y,height,0,0.15);
        const horizontalLeftArea = getFractionalArea(x,width,0,0.45)
        const horizontalRightArea = getFractionalArea(x,width,0.55,0.45);

        const movesAreaHeight = Math.floor(verticalStatusArea.size * 2);
        let movesAreaWidth = width;
        const maxWidth = Math.floor(fullWidth * 0.75);
        if(movesAreaWidth > maxWidth) {
            movesAreaWidth = maxWidth;
        }
        if(this.fullText || leavingText) {
            let delta, text, transitionPolarity;
            if(leavingText) {
                transitionPolarity = false;
                text = leavingText;
                if(!fullTextLeaveStartTime) {
                    fullTextLeaveStartTime = timestamp;
                }
                delta = (timestamp - fullTextLeaveStartTime) / FULL_TEXT_TRANSITION_TIME;
                if(delta < 0) {
                    delta = 0;
                } else if(delta > 1) {
                    delta = 1;
                    leavingText = null;
                }
            } else {
                transitionPolarity = true;
                text = this.fullText;
                if(!fullTextStart) {
                    fullTextStart = timestamp;
                }
                delta = (timestamp - fullTextStart) / FULL_TEXT_TRANSITION_TIME;
                if(delta < 0) {
                    delta = 0;
                } else if(delta > 1) {
                    delta = 1;
                }
            }
            const textAreaHeight = height - movesAreaHeight - verticalStatusArea.size - 80;
            let textAreaWidth = width;
            if(textAreaWidth > 1000) {
                textAreaWidth = 1000;
            }
            const textAreaX = Math.round(x+width/2-textAreaWidth/2);
            let textAreaY = verticalStatusArea.pos + verticalStatusArea.size + 25;
            if(transitionPolarity) {
                textAreaY -= fullHeight * (1-delta);
            } else {
                textAreaY += fullHeight * delta;
            }
            textAreaY = Math.round(textAreaY);
            context.fillStyle = "rgba(0,0,0,0.9)";
            context.fillRect(textAreaX,textAreaY,textAreaWidth,textAreaHeight);
            BitmapText.drawTextWrappingWhite(text,textAreaX+20,textAreaY+20,textAreaWidth-40,Math.ceil(5/maxHorizontalResolution*fullWidth));
        }
        renderStatusArea(
            horizontalLeftArea.pos,
            verticalStatusArea.pos,
            horizontalLeftArea.size,
            verticalStatusArea.size,
            false
        );
        renderStatusArea(
            horizontalRightArea.pos,
            verticalStatusArea.pos,
            horizontalRightArea.size,
            verticalStatusArea.size,
            true
        );
        renderMovesArea(timestamp,Math.round(x+width/2-movesAreaWidth/2),y+height-movesAreaHeight,movesAreaWidth,movesAreaHeight);
    }

    const renderInterface = timestamp => {
        const boxMargin = 40;
        const boxSize = smallestDimension - boxMargin - boxMargin;
        if(greaterWidth) {
            const width = fullWidth * 0.7;
            renderInterfaceElements(
                timestamp,
                Math.round(halfWidth - width/2),
                boxMargin,
                width,
                boxSize
            );
        } else {
            renderInterfaceElements(
                timestamp,
                boxMargin,
                Math.round(halfHeight-boxSize/2),
                boxSize,
                boxSize
            );
        }
    }

    this.render = timestamp => {
        if(!startTime) {
            startTime = timestamp;
        }
        const startDelta = timestamp - startTime;
        const radius = smallestDimension * 0.22;
        const traceNormal = startDelta / circleTraceTime;
        if(this.background) {
            const saturateNormal = startDelta / backgroundSaturateTime;
            if(saturateNormal > 1) {
                this.background.render(timestamp);
            } else {
                this.background.render(timestamp);
                context.save();
                context.globalCompositeOperation = "saturation";
                context.fillStyle = "white";
                context.globalAlpha = 1 - Math.pow(saturateNormal,saturatePopExponent);
                context.fillRect(0,0,fullWidth,fullHeight);
                context.restore();
            }
        }
        if(traceNormal > 1) {
            const fillNormal = (startDelta-circleTraceTime) / circleFillTime;
            if(fillNormal > 1) {
                renderOuterRing(radius);
                renderInnerRing(radius);
            } else {
                context.lineWidth = 1;
                context.save();
                context.globalAlpha = fillNormal;
                renderOuterRing(radius);
                context.restore();

                context.fillStyle = "black";
                context.beginPath();
                context.arc(halfWidth,halfHeight+centerCircleOffset,radius,0,PI2);
                context.stroke();
                context.save();
                context.globalAlpha = fillNormal;
                context.fill();
                context.restore();
            }
        } else {
            context.fillStyle = "black";
            context.lineWidth = 1;
            context.beginPath();
            context.arc(halfWidth,halfHeight+centerCircleOffset,radius,0,PI2*traceNormal);
            context.stroke();
        }
        if(this.foreground) {
            this.foreground.render(timestamp);
        }
        renderInterface(timestamp);
    }
}
export default BattleScreenRenderer;
