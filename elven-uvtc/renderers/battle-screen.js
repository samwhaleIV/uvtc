import StyleManifest from "../runtime/battle/style-manifest.js";
import BattleSequencer from "../runtime/battle/battle-sequencer.js";

function BattleScreenRenderer(winCallback,loseCallback,...sequencerParameters) {
    this.noPixelScale = true;
    
    this.style = StyleManifest["Wimpy Red Elf"];
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

    const outerRingRadius = 3;

    const renderOuterRing = radius => {
        context.fillStyle = this.style.holeRingColor;
        context.arc(halfWidth,halfHeight,radius+outerRingRadius,0,PI2);
        context.fill();
    }
    const renderInnerRing = radius => {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(halfWidth,halfHeight,radius,0,PI2);
        context.fill();
    }

    const statusRollImage = imageDictionary["ui/status-roll"];

    const renderHealthIcon = (x,y,width,height,value) => {
        context.drawImage(statusRollImage,32*value,0,32,32,x,y,width,height);
    }

    const renderStatusArea = (x,y,width,height,rightAlignment) => {
        const healthBarHeight = height/2;
        const statusAreaBorderWidth = 7;
        const textNameScale = 5;

        const doubleBorderWidth = statusAreaBorderWidth + statusAreaBorderWidth;

        context.shadowBlur = 4; 
        context.shadowColor = "rgba(0,0,0,0.25)";

        let boxBorderColor, boxColor, boxHealthColor, name, statuses, healthCount, healthNormal;
        if(!rightAlignment) {
            boxBorderColor = this.style.leftBoxBorder;
            boxColor = this.style.leftBoxColor;
            boxHealthColor = this.style.leftBoxHealth;
            name = this.leftName;
            statuses = this.leftStatuses;
            healthCount = this.leftHealth;
            healthNormal = this.leftHealthNormal;
        } else {
            boxBorderColor = this.style.rightBoxBorder;
            boxColor = this.style.rightBoxColor;
            boxHealthColor = this.style.rightBoxHealth;
            name = this.rightName;
            statuses = this.rightStatuses;
            healthCount = this.rightHealth;
            healthNormal = this.rightHealthNormal;
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
        renderHealthIcon(
            imageX,
            innerAreaY+statusAreaBorderWidth,
            imageHeight,
            imageHeight,
            healthCount
        );

        const textHeight = BitmapText.drawTextTest(name,textNameScale).height+statusAreaBorderWidth;

        context.fillStyle = "black";

        //Get ready for this one... LMAO
        const textBackgroundWidth = innerAreaWidth-doubleBorderWidth-statusAreaBorderWidth-imageHeight;
        const textBackgroundX = !rightAlignment ? innerAreaX+statusAreaBorderWidth : innerAreaX + doubleBorderWidth + imageHeight;

        context.fillRect(
            textBackgroundX,
            innerAreaY+statusAreaBorderWidth,
            textBackgroundWidth,
            Math.round(textHeight+statusAreaBorderWidth)
        );


        BitmapText.drawTextWhite(name,textBackgroundX+statusAreaBorderWidth,innerAreaY+doubleBorderWidth,textNameScale);


    }

    const renderInterface = () => {
        renderStatusArea(50,50,500,150,false);
        renderStatusArea(50,250,500,150,true);
        //renderStatusArea(fullHeight-50-300,fullWidth-50-200,300,200,false);
    }

    this.render = timestamp => {
        if(!startTime) {
            startTime = timestamp;
        }
        const startDelta = timestamp - startTime;
        const radius = 200;
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
                context.arc(halfWidth,halfHeight,radius,0,PI2);
                context.stroke();
                context.save();
                context.globalAlpha = fillNormal;
                context.fillStlye = "white";
                context.fill();
                context.restore();
            }
        } else {
            context.fillStyle = "black";
            context.lineWidth = 1;
            context.beginPath();
            context.arc(halfWidth,halfHeight,radius,0,PI2*traceNormal);
            context.stroke();
        }
        if(this.foreground) {
            this.foreground.render(timestamp);
        }
        renderInterface(timestamp);
    }
}
export default BattleScreenRenderer;
