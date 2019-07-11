import RotatingBackground from "./components/rotating-background.js";
import AudioPane from "./audio-pane.js";
import ControlsPaneRenderer from "./controls-pane.js";
import ScrollingBackground from "./components/scrolling-background.js";

function WorldSettingsRenderer(callback) {

    const background = new RotatingBackground("stars-menu");
    this.renderBackground = background.render;

    let childPage = null;

    this.clearOverlay = (x,y) => {
        childPage = null;
        if(isNaN(x) || isNaN(y)) {
            return;
        }
        this.processMove(x,y);
    }

    let exitLabel = getPlaceholderLocation();
    let audioButton = getPlaceholderLocation();
    let controlsButton = getPlaceholderLocation();

    const hoverTypes = {
        none: 0,
        exitLabel: 1,
        audioButton: 2,
        controlsButton: 3
    };

    let cancelDown = false;
    let hoverType = hoverTypes.none;

    this.processClick = (x,y) => {
        if(childPage) {
            childPage.processClick(x,y);
            return;
        }
        this.processMove(x,y);
    }
    this.processClickEnd = (x,y) => {
        if(childPage) {
            childPage.processClickEnd(x,y);
            return;
        }
        switch(hoverType) {
            case hoverTypes.exitLabel:
                callback();
                break;
            case hoverTypes.controlsButton:
                childPage = new ControlsPaneRenderer(this.clearOverlay,this);
                break;
            case hoverTypes.audioButton:
                childPage = new AudioPane(this.clearOverlay,this,true);
                break;
        }
    }
    this.processMove = (x,y) => {
        if(childPage) {
            childPage.processMove(x,y);
            return;
        }
        if(contains(x,y,audioButton)) {
            hoverType = hoverTypes.audioButton;
        } else if(contains(x,y,controlsButton)) {
            hoverType = hoverTypes.controlsButton;
        } else if(contains(x,y,exitLabel)) {
            hoverType = hoverTypes.exitLabel;
        } else {
            hoverType = hoverTypes.none;
        }
    }
    this.processKey = key => {
        if(childPage) {
            childPage.processKey(key);
            return;
        }
        switch(key) {
            case kc.cancel:
                cancelDown = true;
                break;
        }
    }
    this.processKeyUp = key => {
        if(childPage) {
            childPage.processKeyUp(key);
            return;
        }
        switch(key) {
            case kc.cancel:
                cancelDown = false;
                callback();
                break;
        }
    }
    const floatingElfImage = imageDictionary["ui/menu-elf"];
    const floatingElfImageAlt = imageDictionary["ui/menu-elf-alt"];
    const floatingElfRatio = floatingElfImage.width / floatingElfImage.height;

    const renderElf = (image,x,y,width,height) => {
        context.drawImage(image,0,0,image.width,image.height,x,y,width,height);
        return {
            x:x,y:y,width:width,height:height
        }
    }

    this.render = timestamp => {

        const height = fullHeight - 40;
        const width = height - 80;
        const x = halfWidth - width / 2;
        const y = 20;
        context.fillStyle = "white";
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillRect(20,20,fullWidth-40,fullHeight-40);
        context.globalCompositeOperation = "destination-over";
        background.render(timestamp);
        context.restore();

        exitLabel = renderExitButton(20,20,hoverType===hoverTypes.exitLabel,true,cancelDown);

        const elfHeight = height - exitLabel.y - exitLabel.height - 10;
        const elfWidth = elfHeight * floatingElfRatio;

        audioButton = renderElf(floatingElfImage,x+40,fullHeight-elfHeight,elfWidth,elfHeight);
        controlsButton = renderElf(floatingElfImageAlt,x+width-elfWidth-40,0,elfWidth,elfHeight);

        const labelWidth = Math.floor(elfWidth * 1.12);
        const labelHeight = exitLabel.height;

        const halfLabelWidth = labelWidth / 2;
        const halfLabelHeight = labelHeight / 2;

        const label1X = Math.floor(audioButton.x + audioButton.width / 2 - halfLabelWidth);
        const label2X = Math.floor(controlsButton.x + controlsButton.width / 2 - halfLabelWidth);
        const label1Y = Math.floor(audioButton.y + audioButton.height * 0.59 - labelHeight/2);
        const label2Y = Math.floor(controlsButton.y + controlsButton.height * 0.5 - labelHeight/2);

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "21px Roboto";
        context.fillStyle = "white";
        if(hoverType === hoverTypes.audioButton) {
            context.fillStyle = CONSISTENT_PINK;
            context.fillRect(label1X-hoverPadding,label1Y-hoverPadding,labelWidth+doubleHoverPadding,labelHeight+doubleHoverPadding);
        } else if(hoverType === hoverTypes.controlsButton) {
            context.fillStyle = CONSISTENT_PINK;
            context.fillRect(label2X-hoverPadding,label2Y-hoverPadding,labelWidth+doubleHoverPadding,labelHeight+doubleHoverPadding);
        }
        context.fillStyle = "white";
        context.fillRect(label1X,label1Y,labelWidth,labelHeight);
        context.fillRect(label2X,label2Y,labelWidth,labelHeight);

        context.fillStyle = "black";
        context.fillText("Audio",label1X+halfLabelWidth,label1Y+halfLabelHeight);
        context.fillText("Settings",label2X+halfLabelWidth,label2Y+halfLabelHeight);


        if(childPage) {
            childPage.render(timestamp,20,20,fullWidth-40,fullHeight-40);
        }
    }
}
export default WorldSettingsRenderer;