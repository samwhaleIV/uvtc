import WorldRenderer from "./world.js";
import ControlsPaneRenderer from "./controls-pane.js";
import RotatingBackground from "./components/rotating-background.js";
import ChapterPane from "./chapter-pane.js";
import AudioPane from "./audio-pane.js";
import CreditsRenderer from "./credits.js";
import GlobalState from "../../../elven-engine/runtime/global-state.js";
import ChapterManager from "../runtime/chapter-manager.js";
import Chapters from "../runtime/chapters.js";
import BoxFaderEffect from "./components/box-fader-effect.js";

const BACKGROUND_MARGIN = 20;
const DOUBLE_BACKGROUND_MARGIN = BACKGROUND_MARGIN + BACKGROUND_MARGIN;
const BACKGROUND_BOTTOM_MARGIN = 62;
const VERSION_FONT = "100 26px Roboto";
const VERSION_X_OFFSET = -10;
const VERSION_Y_OFFSET = -20;
const ELFMART_MARGIN = 10;
const LOGO_SIZE = 128;
const ELF_FONT_COEFFICIENT = 0.18;
const PLAY_BUTTON_SIZE = 4;
const PLAY_BUTTON_PADDING = 4;
const SPIRAL_ROTATION_TIME = 10000;
const BACKGROUND_SCROLL_RATE = 30000;
const ELF_LABEL_Y = 0.53;
const ELF_BOUNCE_TIME_BASE = 50000;
const ELF_LABEL_WIDTH_COEFFICENT = 1.5;

const AUDIO_TEXT = "Audio";
const CONTROLS_TEXT = "Controls";
const CREDITS_TEXT = "Credits";
const CHAPTERS_TEXT = "Chapters";
const PLAY_BUTTON_TEXT = "play";

const BACKGROUND_IMAGE = "stars-menu";
const SPIRAL_BACKGROUND = "spiral-menu";

//These aren't magic numbers, they're just fixed pseudo-random
const bounceVariation1 = ELF_BOUNCE_TIME_BASE - 2932;
const bounceVariation2 = ELF_BOUNCE_TIME_BASE - 2321;
const bounceVariation3 = ELF_BOUNCE_TIME_BASE - 1234;
const bounceVariation4 = ELF_BOUNCE_TIME_BASE - 2019;

function MainMenuRenderer(toChapterPane=false) {

    const hoverTypes = {
        none: 0,
        play: 1,
        elf1: 2,
        elf2: 3,
        elf3: 4,
        elf4: 5
    };

    let hoverType = hoverTypes.none;
    this.background = new RotatingBackground(BACKGROUND_IMAGE);

    this.processKey = function(key) {
        if(this.overlayPane) {
            this.overlayPane.processKey(key);
            return;
        }
        switch(key) {
            case kc.open:
                break;
            case kc.cancel:
                break;
        }
    }
    this.processKeyUp = function(key) {
        if(this.overlayPane) {
            this.overlayPane.processKeyUp(key);
            return;
        }
        switch(key) {
            default:break;
        }
    }

    this.processClick = function(x,y) {
        if(this.overlayPane) {
            this.overlayPane.processClick(x,y);
        }
        this.processMove(x,y);
    }

    this.overlayPane = null;

    this.clearOverlay = (x,y) => {
        this.overlayPane = null;
        if(isNaN(x) || isNaN(y)) {
            return;
        }
        this.processMove(x,y);
    }
    this.clearOverlayWithSound = (x,y) => {
        playSound("reverse-click");
        this.clearOverlay(x,y);
    }

    this.leaveWithFillInLayer = (rendererType,...parameters) => {
        this.fader.fadeOut(rendererType,...parameters);
        faderEffectsRenderer.fillInLayer = stencilBackground;
        let startTime = 0;
        faderEffectsRenderer.pauseCallbackOnce = () => {
            startTime = performance.now();
        }
        faderEffectsRenderer.callbackOnce = () => {
            faderEffectsRenderer.callbackOnce
            stencilBackground.timeOffset = rendererState.fader.start - startTime;
        }
    }

    this.processClickEnd = function(x,y) {
        if(this.overlayPane) {
            this.overlayPane.processClickEnd(x,y);
            return;
        }
        switch(hoverType) {
            case hoverTypes.elf1:
                this.overlayPane = new AudioPane(this.clearOverlay,this);
                break;
            case hoverTypes.elf2:
                this.overlayPane = new ControlsPaneRenderer(this.clearOverlay,this);
                break;
            case hoverTypes.elf3:
                this.overlayPane = new ChapterPane(this.clearOverlay,this,false);
                break;
            case hoverTypes.elf4:
                this.leaveWithFillInLayer(CreditsRenderer);
                break;
            case hoverTypes.play:
                if(!GlobalState.data.activeChapter) {
                    const nextChapter = (GlobalState.data.highestChapterFinished||0) + 1;
                    if(nextChapter <= Chapters.length) {
                        ChapterManager.setChapter(nextChapter);
                    } else {
                        ChapterManager.setChapter(1);
                    }
                }
                this.leaveWithFillInLayer(WorldRenderer);
                break;
        }
        this.processMove(x,y);
    }

    this.song = MAIN_MENU_SONG;

    this.processMove = function(mouseX,mouseY) {
        if(this.overlayPane) {
            this.overlayPane.processMove(mouseX,mouseY);
            return;
        }
        if(contains(mouseX,mouseY,playButtonLocation)) {
            hoverType = hoverTypes.play;
        } else if(contains(mouseX,mouseY,floatingElf1)) {
            hoverType = hoverTypes.elf1;
        } else if(contains(mouseX,mouseY,floatingElf2)) {
            hoverType = hoverTypes.elf2;
        } else if(contains(mouseX,mouseY,floatingElf3)) {
            hoverType = hoverTypes.elf3;
        } else if(contains(mouseX,mouseY,floatingElf4)) {
            hoverType = hoverTypes.elf4;
        } else {
            hoverType = hoverTypes.none;
        }
    }

    const siloImage = imageDictionary["ui/silo"];
    const elfmartImage = imageDictionary["ui/elfmart"];
    const floatingElfImage = imageDictionary["ui/menu-elf"];
    const bannerImage = imageDictionary["ui/banner"];
    const floatingElfRatio = floatingElfImage.height / floatingElfImage.width;
    const bannerImageRatio = bannerImage.height / bannerImage.width;

    let bannerYOffset;
    let centerYOffset;

    const siloImageRatio = siloImage.height / siloImage.width;
    const stencilBackground = new RotatingBackground(SPIRAL_BACKGROUND);
    stencilBackground.rotationTime = SPIRAL_ROTATION_TIME;
    stencilBackground.clockwise = true;

    this.updateSize = function() {
        stencilBackground.startHeight = fullHeight;
    }

    const playButtonLocation = getPlaceholderLocation();
    const playTextTest = drawTextTest(PLAY_BUTTON_TEXT,PLAY_BUTTON_SIZE);
    playTextTest.width /= 2;
    playTextTest.height /= 2;

    const floatingElf1 = getPlaceholderLocation();
    const floatingElf2 = getPlaceholderLocation();
    const floatingElf3 = getPlaceholderLocation();
    const floatingElf4 = getPlaceholderLocation();

    floatingElf1.text = AUDIO_TEXT;
    floatingElf2.text = CONTROLS_TEXT;
    floatingElf3.text = CHAPTERS_TEXT;
    floatingElf4.text = CREDITS_TEXT;

    let halfElfWidth;
    let halfElfHeight;

    const applyToAllFloatingElves = (property,value) => {
        floatingElf1[property] = value;
        floatingElf2[property] = value;
        floatingElf3[property] = value;
        floatingElf4[property] = value;
    }

    const renderFloatingElf = (renderObject,angle,withHover) => {
        if(withHover) {
            renderHoverEffect(renderObject.x+renderObject.width/2,renderObject.y+renderObject.height/2,renderObject.width*2,renderObject.height*2);
        }
        context.save();
        context.translate(renderObject.x+renderObject.width/2,renderObject.y+renderObject.height/2);
        context.rotate(angle);
        const x = -(renderObject.width/2);
        const y = -(renderObject.height/2);
        context.drawImage(
            floatingElfImage,
            0,
            0,
            floatingElfImage.width,
            floatingElfImage.height,
            x,
            y,
            renderObject.width,
            renderObject.height
        );
        context.fillStyle = "white";
        const labelWidth = renderObject.width * ELF_LABEL_WIDTH_COEFFICENT;
        const labelHeight = labelWidth / 4;
        const labelY = y + renderObject.height * ELF_LABEL_Y;
        const labelX = x + halfElfWidth - labelWidth / 2;
        context.fillRect(
            Math.floor(labelX),Math.floor(labelY),Math.floor(labelWidth),Math.floor(labelHeight)
        );
        context.fillStyle = "black";
        context.fillText(
            renderObject.text,Math.floor(labelX+labelWidth/2),Math.floor(labelY+labelHeight/2)
        );
        context.restore();
    }

    this.noPixelScale = true;

    const getBouncingTimeNormal = (timestamp,variation) => {
        let timeNormal = timestamp / variation % 2;
        if(timeNormal > 1) {
            timeNormal = 2 - timeNormal;
        }
        return timeNormal / 2;
    }
    
    const backgroundImage = imageDictionary["backgrounds/chapter-select"];
    const invertedBackgroundImage = imageDictionary["backgrounds/chapter-select-invert"];
    const bSize = backgroundImage.width;
    this.renderBackground = (timestamp,inverted) => {
        const image = inverted ? invertedBackgroundImage : backgroundImage;
        const tNormal = timestamp % BACKGROUND_SCROLL_RATE / BACKGROUND_SCROLL_RATE / 2;
        context.drawImage(
            image,
            0,0,bSize,bSize,
            0,0-(largestDimension*tNormal*2),largestDimension,largestDimension
        );
        context.drawImage(
            image,
            0,0,bSize,bSize,
            0,largestDimension*(1-tNormal*2),largestDimension,largestDimension
        );
    }

    if(toChapterPane) {
        this.overlayPane = new ChapterPane(this.clearOverlay,this,true);
    }

    this.render = function(timestamp) {
        bannerYOffset = fullHeight * 0.05;
        centerYOffset = bannerYOffset - fullHeight * 0.025;
        stencilBackground.centerYOffset = centerYOffset;

        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);
        this.background.render(timestamp);
        const bannerImageWidth = fullWidth / 3;
        context.drawImage(
            bannerImage,0,0,bannerImage.width,bannerImage.height,
            halfWidth-bannerImageWidth/2,bannerYOffset,
            bannerImageWidth,bannerImageWidth*bannerImageRatio
        );
        playButtonLocation.width = fullWidth / 4;
        if(hoverType === hoverTypes.play) {
            renderHoverEffect(halfWidth,halfHeight+centerYOffset,playButtonLocation.width,playButtonLocation.height);
        }
        playButtonLocation.height = siloImageRatio * playButtonLocation.width;
        playButtonLocation.x = halfWidth-playButtonLocation.width / 2;
        playButtonLocation.y = halfHeight-playButtonLocation.height / 2 + centerYOffset;
        
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.drawImage(
            siloImage,0,0,siloImage.width,siloImage.height,
            playButtonLocation.x,
            playButtonLocation.y,
            playButtonLocation.width,
            playButtonLocation.height
        );

        context.globalCompositeOperation = "destination-over";
        stencilBackground.render(timestamp);
        context.restore();
        drawTextStencil(
            "white",
            "play",
            Math.floor(halfWidth-playTextTest.width),
            Math.floor(halfHeight-playTextTest.height) + 5 + centerYOffset,
        PLAY_BUTTON_SIZE,PLAY_BUTTON_PADDING);

        const elfWidth = fullWidth * 0.05;
        
        applyToAllFloatingElves("width",elfWidth);
        applyToAllFloatingElves("height",elfWidth*floatingElfRatio);

        halfElfWidth = floatingElf1.width / 2;
        halfElfHeight = floatingElf1.height / 2;


        context.font = `bold ${Math.ceil(elfWidth*ELF_FONT_COEFFICIENT)}px Arial`;
        context.textBaseline = "middle";
        context.textAlign = "center";

        const leftElvesX = fullWidth * 0.3 - elfWidth;

        floatingElf1.x = leftElvesX;
        floatingElf2.x = leftElvesX;

        const rightElvesX = fullWidth * 0.7 - halfElfWidth;
        floatingElf3.x = rightElvesX;
        floatingElf4.x = rightElvesX;

        const topElvesY = fullHeight / 4 - halfElfHeight + 40;
        floatingElf1.y = topElvesY;
        floatingElf3.y = topElvesY;

        const bottomElvesY = fullHeight * 0.75 - halfElfHeight + bannerYOffset / 2;
        floatingElf2.y = bottomElvesY;
        floatingElf4.y = bottomElvesY;

        renderFloatingElf(floatingElf1,-getBouncingTimeNormal(timestamp,bounceVariation1)+0.23,hoverType === hoverTypes.elf1);
        renderFloatingElf(floatingElf2,getBouncingTimeNormal(timestamp,bounceVariation2)-0.24,hoverType === hoverTypes.elf2);
        renderFloatingElf(floatingElf3,getBouncingTimeNormal(timestamp,bounceVariation3)-0.23,hoverType === hoverTypes.elf3);
        renderFloatingElf(floatingElf4,-getBouncingTimeNormal(timestamp,bounceVariation4)+0.24,hoverType === hoverTypes.elf4);

        context.font = VERSION_FONT;
        context.textAlign = "end";
        context.fillStyle = "white";
        context.fillText(VERSION_STRING,fullWidth+VERSION_X_OFFSET,fullHeight+VERSION_Y_OFFSET);

        context.drawImage(
            elfmartImage,0,0,elfmartImage.width,elfmartImage.height,
            ELFMART_MARGIN,
            fullHeight-LOGO_SIZE-ELFMART_MARGIN,
            LOGO_SIZE,LOGO_SIZE
        );

        if(this.overlayPane) {
            this.overlayPane.render(timestamp,BACKGROUND_MARGIN,BACKGROUND_MARGIN,fullWidth-DOUBLE_BACKGROUND_MARGIN,fullHeight-BACKGROUND_BOTTOM_MARGIN);
        }

    }
}
export default MainMenuRenderer;