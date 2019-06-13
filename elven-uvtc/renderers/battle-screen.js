import StyleManifest from "../runtime/battle/style-manifest.js";
import BattleSequencer from "../runtime/battle/battle-sequencer.js";
import RenderStatus from "./components/battle/status.js";

function BattleScreenRenderer(winCallback,loseCallback,...sequencerParameters) {
    this.noPixelScale = true;
    this.disableAdaptiveFill = false;
    
    this.style = StyleManifest["Tiny Arm Elf"];
    this.background = this.style.getBackground();
    this.foreground = null;
    this.leftName = null;
    this.rightName = null;

    this.leftHealth = null;
    this.rightHealth = null;
    this.leftHealthNormal = null;
    this.rightHealthNormal = null;

    this.playerMoves = [];
    this.marqueeText = null;
    this.fullText = null;

    this.leftStatuses = [];
    this.rightStatuses = [];

    this.flashHealthAdded = isPlayer => {
        playSound("heal");
    };
    this.flashHealthDropped = isPlayer => {
        playSound("damage");
    };
    this.someoneDied = isPlayer => {
    };
    this.showFullText = text => {
    };
    this.clearFullText = () => {
    };
    this.getAction = async () => {
        return null;
    };

    this.sequencer = new BattleSequencer(winCallback,loseCallback,...sequencerParameters);
    this.sequencer.bindToBattleScreen(this);

    const hoverTypes = {
        none: 0
    };
    let hoverType = null;

    this.processMove = (x,y) => {
    }

    this.processClick = (x,y) => {
        this.processMove(x,y);
    }
    this.processClickEnd = () => {
        switch(hoverType) {
        }
    }

    let startTime = null;
    const circleTraceTime = 300;
    const circleFillTime = 500;
    const backgroundSaturateTime = 300;
    const saturatePopExponent = 4; //Higher numbers are more abrupt

    const centerCircleOffset = 20;

    const outerRingRadius = 4;

    const renderOuterRing = radius => {
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

    const renderHealthIcon = (x,y,width,height,value) => {
        context.drawImage(statusRollImage,32*value,0,32,32,x,y,width,height);
    }

    const renderMovesArea = (x,y,width,height) => {
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
            context.font = "300 24px Roboto";

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
    }

    const renderStatusArea = (x,y,width,height,rightAlignment) => {
        let statusAreaBorderWidth = 7;
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
            boxColor = this.style.rightBoxColor;
            boxHealthColor = this.style.rightBoxHealth;
            name = this.rightName;
            statuses = this.rightStatuses;
            healthCount = this.rightHealth;
            healthNormal = this.rightHealthNormal;
        } else {
            boxBorderColor = this.style.leftBoxBorder;
            boxColor = this.style.leftBoxColor;
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
        context.fillRect(
            innerAreaX,
            innerAreaY,
            innerAreaWidth,
            innerAreaHeight
        );

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

    const renderInterfaceElements = (x,y,width,height) => {
        const verticalStatusArea = getFractionalArea(y,height,0,0.15);
        const horizontalLeftArea = getFractionalArea(x,width,0,0.45)
        const horizontalRightArea = getFractionalArea(x,width,0.55,0.45);

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

        const movesAreaHeight = verticalStatusArea.size * 2;
        let movesAreaWidth = width;
        const maxWidth = Math.floor(fullWidth * 0.75);
        if(movesAreaWidth > maxWidth) {
            movesAreaWidth = maxWidth;
        }
        renderMovesArea(Math.round(x+width/2-movesAreaWidth/2),y+height-movesAreaHeight,movesAreaWidth,movesAreaHeight);
    }

    const renderInterface = () => {
        const boxMargin = 40;
        const boxSize = smallestDimension - boxMargin - boxMargin;
        if(greaterWidth) {
            const width = fullWidth * 0.7;
            renderInterfaceElements(
                Math.round(halfWidth - width/2),
                boxMargin,
                width,
                boxSize
            );
        } else {
            renderInterfaceElements(
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
                context.fillStyle = "white";
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
