import WorldRenderer from "../renderers/world.js";

function ChapterPane(callback,parent) {

    let leftButton = getPlaceholderLocation();
    let rightButton = getPlaceholderLocation();
    let centerButton = getPlaceholderLocation();

    const hoverTypes = {
        none: 0,
        leftButton: 1,
        centerButton: 2,
        rightButton: 3
    };
    let hoverType = hoverTypes.none;

    const warpInTime = 200;
    let fadeOutStart;
    let fadeOutTime = 400;

    this.leaving = false;

    this.fadeOutEnd = null;

    this.exit = () => {
        if(callback) {
            fadeOutStart = performance.now();
            this.leaving = true;
            this.fadeOutEnd = () => {
                callback(lastRelativeX,lastRelativeY);
            }
        }
    }

    this.processKey = function(key) {
        if(this.leaving) {
            return;
        }
        switch(key) {
            case kc.open:
                break;
            case kc.cancel:
                this.exit();
                break;
        }
    }
    this.processKeyUp = function(key) {
        if(this.leaving) {
            return;
        }
        switch(key) {
            default:break;
        }
    }
    this.processClick = function(x,y) {
        if(this.leaving) {
            return;
        }
        this.processMove(x,y);
    }
    const exitText = "exit";
    this.processClickEnd = function(x,y) {
        if(this.leaving) {
            return;
        }
        switch(hoverType) {
            case hoverTypes.leftButton:
                if(this.leftButtonText === exitText) {
                    this.exit();
                }
                break;
            case hoverTypes.centerButton:
                parent.fader.fadeOut(WorldRenderer);
                let startTime = 0;
                let timeOffset = 0;
                faderEffectsRenderer.fillInLayer = {
                    render: timestamp => {
                        parent.renderBackground(timestamp-timeOffset,true);
                    }
                }
                faderEffectsRenderer.pauseCallbackOnce = () => {
                    startTime = performance.now();
                }
                faderEffectsRenderer.callbackOnce = () => {
                    timeOffset = rendererState.fader.start - startTime;
                }
                break;
            case hoverTypes.rightButton:
                playSound("energy-reverse");
                break;
            default:
                this.exit();
                break;
        }
        this.processMove(x,y);
    }
    this.processMove = function(x,y) {
        if(this.leaving) {
            return;
        }
        if(contains(x,y,leftButton)) {
            hoverType = hoverTypes.leftButton;
        } else if(contains(x,y,centerButton)) {
            hoverType = hoverTypes.centerButton;
        } else if(contains(x,y,rightButton)) {
            hoverType = hoverTypes.rightButton;
        } else {
            hoverType = hoverTypes.none;
        }
    }

    this.renderCenterImage = size => {
        const halfSize = size / 2;
        const image = this.currentImage;
        context.drawImage(
            image,
            0,0,image.width,image.height,
            halfWidth-halfSize,halfHeight-halfSize,size,size
        );
    }

    const renderHoverEffect = (x,y,width,height) => {
        const halfRadius = width / 2;
        const gradient = context.createRadialGradient(x,y,0,x,y,halfRadius);
        gradient.addColorStop(0,"white");
        gradient.addColorStop(0.98,"white");
        gradient.addColorStop(1,"rgba(255,255,255,0)");
        context.fillStyle = gradient;
        context.fillRect(x-halfRadius,y-halfRadius,width,height);
    }

    this.currentImage = imageDictionary["ui/chapters/1"];
    this.chapterTitle = "Chapter 1";
    this.chapterSubTitle = "Makin' my way round town";

    this.leftButtonText = exitText;
    this.rightButtonText = "next chapter";
    this.centerButtonText = "P  L  A  Y";

    let startTime;
    this.render = (timestamp,x,y,width,height) => {
        if(!startTime) {
            startTime = timestamp;
        }
        const delta = timestamp - startTime;
        if(delta < warpInTime) {
            const startHeight = height;
            const startWidth = width;
            height = delta / warpInTime * height;
            width = delta / warpInTime * width;
            x = (x + startWidth / 2) - width / 2;
            y = (y + startHeight / 2) - height / 2;
        } else if(fadeOutStart) {
            let alpha = 1 - ((timestamp - fadeOutStart) / fadeOutTime);
            if(alpha <= 0) {
                this.fadeOutEnd();
                return;
            }
            context.save();
            if(alpha < 0) {
                alpha = 0;
            }
            context.globalAlpha = alpha;
        }

        const widthNormal = fullWidth / 1920;

        const robotoOffset = 2.5 * widthNormal;

        const imageSize = widthNormal * 565;

        const hoverSize = widthNormal * 200;

        const sideButtonWidth = imageSize * 0.5;
        const heightNormal = sideButtonWidth / 240
        const sideButtonHeight = heightNormal * 80;
        const centerButtonHeight = heightNormal * 65;
        const centerButtonWidth = imageSize * 0.5;

        const halfButtonWidth = sideButtonWidth / 2;
        const halfButtonHeight = sideButtonHeight / 2;

        const leftButtonCenterX = halfWidth - imageSize;
        const rightButtonCenterX = halfWidth + imageSize;

        leftButton.x = leftButtonCenterX - halfButtonWidth;
        leftButton.y = halfHeight - halfButtonHeight;
        rightButton.x = rightButtonCenterX - halfButtonWidth;
        rightButton.y = leftButton.y;
        leftButton.width = sideButtonWidth;
        leftButton.height = sideButtonHeight;
        rightButton.width = sideButtonWidth;
        rightButton.height = sideButtonHeight;

        centerButton.height = centerButtonHeight;
        centerButton.width = centerButtonWidth;
        centerButton.y = halfHeight - centerButton.height / 2;
        centerButton.x = halfWidth - centerButton.width / 2;

        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "white";
        context.fillRect(x,y,width,height);
        context.globalCompositeOperation = "source-over";
        this.renderCenterImage(imageSize);
        if(hoverType === hoverTypes.centerButton) {
            renderHoverEffect(halfWidth,halfHeight,hoverSize,hoverSize);
        }
        context.globalCompositeOperation = "destination-out";
        drawRectangle(centerButton,"black");
        context.globalCompositeOperation = "destination-over";
        parent.renderBackground(timestamp);
        context.restore();


        if(hoverType === hoverTypes.leftButton) {
            renderHoverEffect(leftButtonCenterX,halfHeight,hoverSize,hoverSize);
        }
        drawRectangle(leftButton,"black");

        if(hoverType === hoverTypes.rightButton) {
            renderHoverEffect(rightButtonCenterX,halfHeight,hoverSize,hoverSize);
        }
        drawRectangle(rightButton,"black");

        context.font = `${widthNormal*24}px Roboto`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "white";

        context.fillText(this.leftButtonText,leftButtonCenterX,halfHeight+robotoOffset);
        context.fillText(this.rightButtonText,rightButtonCenterX,halfHeight+robotoOffset);
        context.fillText(this.centerButtonText,halfWidth,halfHeight+robotoOffset);

        const subtitleWidth = context.measureText(this.chapterSubTitle).width;
        const subtitleLayerHeight = widthNormal * 60;
        const subtitleBoxCenterY = subtitleLayerHeight + halfHeight + imageSize / 2;
        context.fillStyle = "black";
        context.fillRect(halfWidth-20-subtitleWidth/2,subtitleBoxCenterY-subtitleLayerHeight/2,subtitleWidth+40,subtitleLayerHeight);
        context.fillStyle = "white";
        context.fillText(this.chapterSubTitle,halfWidth,robotoOffset+subtitleBoxCenterY);
        context.font = `${widthNormal*48}px Roboto`;
        context.fillText(this.chapterTitle,halfWidth,halfHeight - imageSize / 2 - subtitleLayerHeight);
        
        if(fadeOutStart) {
            context.restore();
        }
    }
}
export default ChapterPane;
