import WorldRenderer from "../renderers/world.js";
import SettingsPaneRenderer from "../renderers/controls-pane.js";
import RotatingBackground from "../renderers/components/rotating-background.js";
import ChapterPane from "./chapter-pane.js";
import AudioPane from "./audio-pane.js";
import CreditsRenderer from "./credits.js";

function MainMenuRenderer() {

    const hoverTypes = {
        none: Symbol("none"),
        play: Symbol("play"),
        elf1: Symbol("elf1"),
        elf2: Symbol("elf1"),
        elf3: Symbol("elf1"),
        elf4: Symbol("elf1")
    };

    let hoverType = hoverTypes.none;
    this.background = new RotatingBackground("stars-menu");

    let showHoverSpecialEffect = false;

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
        showHoverSpecialEffect = true;
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
        showHoverSpecialEffect = false;
        if(this.overlayPane) {
            this.overlayPane.processClickEnd(x,y);
            return;
        }
        switch(hoverType) {
            case hoverTypes.elf1:
                this.overlayPane = new AudioPane(this.clearOverlay,this);
                break;
            case hoverTypes.elf2:
                this.overlayPane = new SettingsPaneRenderer(this.clearOverlay,this);
                break;
            case hoverTypes.elf3:
                playSound("click");
                this.overlayPane = new ChapterPane(this.clearOverlay,this);
                break;
            case hoverTypes.elf4:
                playSound("click");
                this.leaveWithFillInLayer(CreditsRenderer);
                break;
            case hoverTypes.play:
                this.leaveWithFillInLayer(WorldRenderer);
                break;
        }
        this.processMove(x,y);
    }

    this.song = "main-menu";

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
    const stencilBackground = new RotatingBackground("spiral-menu");
    stencilBackground.rotationTime = 10000;
    stencilBackground.clockwise = true;

    this.updateSize = function() {
        stencilBackground.startHeight = fullHeight;
    }

    const playButtonLocation = getPlaceholderLocation();
    const playTextTest = drawTextTest("play",4);
    playTextTest.width /= 2;
    playTextTest.height /= 2;

    const floatingElf1 = getPlaceholderLocation();
    const floatingElf2 = getPlaceholderLocation();
    const floatingElf3 = getPlaceholderLocation();
    const floatingElf4 = getPlaceholderLocation();

    floatingElf1.text = "Audio";
    floatingElf2.text = "Controls";
    floatingElf3.text = "Chapters";
    floatingElf4.text = "Credits";

    let halfElfWidth;
    let halfElfHeight;

    const applyToAllFloatingElves = (property,value) => {
        floatingElf1[property] = value;
        floatingElf2[property] = value;
        floatingElf3[property] = value;
        floatingElf4[property] = value;
    }
    const renderHoverEffectElf = renderObject => {
        renderHoverEffect(renderObject.x+renderObject.width/2,renderObject.y+renderObject.height/2,renderObject.width*2,renderObject.height*2);
    }

    const renderFloatingElf = (renderObject,angle) => {
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
        const labelWidth = renderObject.width * 1.5;
        const labelHeight = labelWidth / 4;
        const labelY = y + renderObject.height * 0.53;
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

    const baseBounceTime = 50000;
    const bounceVariation1 = baseBounceTime - 2932;
    const bounceVariation2 = baseBounceTime - 2321;
    const bounceVariation3 = baseBounceTime - 1234;
    const bounceVariation4 = baseBounceTime - 2019;

    const getBouncingTimeNormal = (timestamp,variation) => {
        let timeNormal = timestamp / variation % 2;
        if(timeNormal > 1) {
            timeNormal = 2 - timeNormal;
        }
        return timeNormal / 2;
    }
    
    const backgroundImage = imageDictionary["backgrounds/chapter-select"];
    const invertedBackgroundImage = imageDictionary["backgrounds/chapter-select-invert"];
    const backgroundScrollRate = 30000;
    const bSize = backgroundImage.width;
    this.renderBackground = (timestamp,inverted) => {
        const image = inverted ? invertedBackgroundImage : backgroundImage;
        const tNormal = timestamp % backgroundScrollRate / backgroundScrollRate / 2;
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

    this.render = function(timestamp) {
        bannerYOffset = fullHeight * 0.05;
        centerYOffset = bannerYOffset - fullHeight * 0.025;
        stencilBackground.centerYOffset = centerYOffset;

        const renderNormal = fullWidth / 1920;

        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);
        this.background.render(timestamp);
        const bannerImageWidth = fullWidth / 3;
        context.drawImage(
            bannerImage,0,0,bannerImage.width,bannerImage.height,
            halfWidth-bannerImageWidth/2,bannerYOffset,
            bannerImageWidth,bannerImageWidth*bannerImageRatio
        );
        playButtonLocation.width = fullWidth * 0.25;
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
        4,4);

        const elfWidth = fullWidth * 0.05;
        
        applyToAllFloatingElves("width",elfWidth);
        applyToAllFloatingElves("height",elfWidth*floatingElfRatio);

        halfElfWidth = floatingElf1.width / 2;
        halfElfHeight = floatingElf1.height / 2;


        context.font = `bold ${Math.ceil(elfWidth*0.18)}px Arial`;
        context.textBaseline = "middle";
        context.textAlign = "center";

        const leftElvesX = fullWidth * 0.3 - elfWidth;

        floatingElf1.x = leftElvesX;
        floatingElf2.x = leftElvesX;

        const rightElvesX = fullWidth * 0.7 - halfElfWidth;
        floatingElf3.x = rightElvesX;
        floatingElf4.x = rightElvesX;

        const topElvesY = fullHeight * 0.25 - halfElfHeight + 40;
        floatingElf1.y = topElvesY;
        floatingElf3.y = topElvesY;

        const bottomElvesY = fullHeight * 0.75 - halfElfHeight + bannerYOffset / 2;
        floatingElf2.y = bottomElvesY;
        floatingElf4.y = bottomElvesY;

        if(hoverType === hoverTypes.elf1) {
            renderHoverEffectElf(floatingElf1);
        }
        renderFloatingElf(floatingElf1,-getBouncingTimeNormal(timestamp,bounceVariation1)+0.23);
        if(hoverType === hoverTypes.elf2) {
            renderHoverEffectElf(floatingElf2);
        }
        renderFloatingElf(floatingElf2,getBouncingTimeNormal(timestamp,bounceVariation2)-0.24);
        if(hoverType === hoverTypes.elf3) {
            renderHoverEffectElf(floatingElf3);
        }
        renderFloatingElf(floatingElf3,getBouncingTimeNormal(timestamp,bounceVariation3)-0.23);
        if(hoverType === hoverTypes.elf4) {
            renderHoverEffectElf(floatingElf4);
        }
        renderFloatingElf(floatingElf4,-getBouncingTimeNormal(timestamp,bounceVariation4)+0.24);

        const fontSize = 26/1920*fullWidth;
        context.font = `${fontSize}px Roboto`;
        context.textAlign = "end";
        context.fillStyle = "white";
        const offsetFactor = fontSize / 26;
        context.fillText(VERSION_STRING,fullWidth-offsetFactor*10,fullHeight-offsetFactor*25);

        if(this.overlayPane) {
            const margin = renderNormal * 20;
            const extraBottomSpace = margin + renderNormal*50;

            this.overlayPane.render(timestamp,margin,margin,fullWidth-margin-margin,fullHeight-extraBottomSpace);
        }

        const logoSize = fullWidth * 0.075;
        context.drawImage(
            elfmartImage,0,0,elfmartImage.width,elfmartImage.height,
            10,
            fullHeight-logoSize-10,
            logoSize,logoSize
        );

    }
}
export default MainMenuRenderer;
