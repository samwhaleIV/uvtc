import StyleManifest from "../runtime/battle/style-manifest.js";
import BattleSequencer from "../runtime/battle/battle-sequencer.js";

function BattleScreenRenderer(winCallback,loseCallback,...sequencerParameters) {
    this.noPixelScale = true;
    
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
    };
    this.flashHealthDropped = isPlayer => {
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

    const renderOuterRing = radius => {
        context.fillStyle = this.style.holeRingColor;
        context.arc(halfWidth,halfHeight,radius+3,0,PI2);
        context.fill();
    }
    const renderInnerRing = radius => {
        context.fillStyle = "black";
        context.beginPath();
        context.arc(halfWidth,halfHeight,radius,0,PI2);
        context.fill();
    }

    this.renderInterface = () => {

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
        this.renderInterface(timestamp);
    }
}
export default BattleScreenRenderer;
