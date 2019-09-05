import RotatingBackground from "./components/rotating-background.js";
import AudioPane from "./audio-pane.js";
import ControlsPaneRenderer from "./controls-pane.js";

const BACKGROUND_MARGIN = 10;
const DOUBLE_BACKGROUND_MARGIN = BACKGROUND_MARGIN + BACKGROUND_MARGIN;
const ELF_HEIGHT_MODIFIER = -10;
const LABEL_WIDTH_COEFFICIENT = 1.12;
const AUDIO_LABEL_Y = 0.59;
const CONTROLS_LABEL_Y = 0.49;
const LABEL_FONT = "18px Roboto";
const LABEL_HEIGHT_COEFFICIENT = 0.28;

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

    const renderElf = (image,x,y,width,height,target) => {
        context.drawImage(image,0,0,image.width,image.height,x,y,width,height);
        target.x = x;
        target.y = y;
        target.width = width;
        target.height = height;
    }

    this.render = timestamp => {
        background.render(timestamp);

        exitLabel = renderExitButton(BACKGROUND_MARGIN,BACKGROUND_MARGIN,hoverType===hoverTypes.exitLabel,true,cancelDown);

        const elfHeight = fullHeight - exitLabel.y - exitLabel.height + ELF_HEIGHT_MODIFIER;
        const elfWidth = elfHeight * floatingElfRatio;

        const elfMargin = elfWidth / 4;

        renderElf(floatingElfImage,

            halfWidth-elfWidth-elfMargin,

        fullHeight-elfHeight,elfWidth,elfHeight,audioButton);
        renderElf(floatingElfImageAlt,

            halfWidth+elfMargin,

        0,elfWidth,elfHeight,controlsButton);

        let labelWidth = elfWidth * LABEL_WIDTH_COEFFICIENT;
        const labelHeight = Math.floor(labelWidth * LABEL_HEIGHT_COEFFICIENT);
        labelWidth = Math.floor(labelWidth);

        const halfLabelWidth = labelWidth / 2;
        const halfLabelHeight = labelHeight / 2;

        const label1X = Math.floor(audioButton.x + audioButton.width / 2 - halfLabelWidth);
        const label2X = Math.floor(controlsButton.x + controlsButton.width / 2 - halfLabelWidth);
        const label1Y = Math.floor(audioButton.y + audioButton.height * AUDIO_LABEL_Y - halfLabelHeight);
        const label2Y = Math.floor(controlsButton.y + controlsButton.height * CONTROLS_LABEL_Y - halfLabelHeight);

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = LABEL_FONT;
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
            childPage.render(
                timestamp,
                BACKGROUND_MARGIN,
                BACKGROUND_MARGIN,
                fullWidth - DOUBLE_BACKGROUND_MARGIN,
                fullHeight - DOUBLE_BACKGROUND_MARGIN
            );
        }
    }
}
export default WorldSettingsRenderer;