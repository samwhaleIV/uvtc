import StyleManifest from "../runtime/battle/style-manifest.js";

function BattleScreenRenderer() {

    const hoverTypes = {
        none: 0
    };
    let hoverType = null;


    this.noPixelScale = true;

    this.processMove = (x,y) => {

    }

    this.processClick = (x,y) => {

        this.processMove(x,y);
    }
    this.processClickEnd = () => {
        switch(hoverType) {
        }
    }

    this.style = StyleManifest["Tiny Arm Elf"];
    this.background = this.style.getBackground();

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

    }
}
export default BattleScreenRenderer;
