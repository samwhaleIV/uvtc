import WorldRenderer from "../renderers/world.js";
import SettingsPaneRenderer from "../renderers/settings-pane.js";
import RotatingBackground from "../renderers/components/rotating-background.js";

function MainMenuRenderer() {
   
    this.updateSize = function() {
    }

    const hoverTypes = {
        none: Symbol("none"),
        music: Symbol("music"),
        settings: Symbol("settings"),
        sound: Symbol("sound"),
        play: Symbol("play"),
        elfmart: Symbol("elfmart")
    }

    let hoverType = hoverTypes.none;
    this.background = new RotatingBackground("stars-menu");

    let showHoverSpecialEffect = false;

    this.processKey = function(key) {
        if(this.settingsPane) {
            this.settingsPane.processKey(key);
            return;
        }
        switch(key) {
            case "Space":
                break;
            case "Escape":
                break;
        }
    }
    this.processKeyUp = function(key) {
        if(this.settingsPane) {
            this.settingsPane.processKeyUp(key);
            return;
        }
        switch(key) {
            default:break;
        }
    }

    this.processClick = function(x,y) {
        this.processMove(x,y);
        if(hoverType !== hoverTypes.none) {
            showHoverSpecialEffect = true;
        }
    }

    this.settingsPane = null;

    this.processClickEnd = function(x,y) {
        if(this.transitioning) {
            return;
        }
        if(this.settingsPane) {
            this.settingsPane.processClickEnd(x,y);
            return;
        }
        showHoverSpecialEffect = false;
        switch(hoverType) {
            case hoverTypes.music:
                toggleMusicMute();
                playSound("click");
                break;
            case hoverTypes.sound:
                toggleSoundMute();
                playSound("click");
                break;
            case hoverTypes.settings:
                this.settingsPane = SettingsPaneRenderer;
                SettingsPaneRenderer.exit = (x,y) => {
                    this.settingsPane = null;
                    this.processMove(x,y);
                }
                playSound("click");
                break;
            case hoverTypes.play:
                playSound("click");
                this.fader.fadeOut(WorldRenderer,"bedroom_1");
                faderEffectsRenderer.fillInLayer = stencilBackground;
                let startTime = 0;
                faderEffectsRenderer.pauseCallbackOnce = () => {
                    startTime = performance.now();
                }
                faderEffectsRenderer.callbackOnce = () => {
                    faderEffectsRenderer.callbackOnce
                    stencilBackground.timeOffset = rendererState.fader.start - startTime;
                }

                break;
            case hoverTypes.elfmart:
                break;
        }
        this.processMove(x,y);
    }

    this.processMove = function(mouseX,mouseY) {
        if(this.settingsPane) {
            this.settingsPane.processMove(mouseX,mouseY);
            return;
        }
        if(mouseY >= lastButtonLocations[0].y) {
            if(mouseY <= lastButtonLocations[0].y + lastButtonLocations[0].height) {
                if(mouseX >= lastButtonLocations[2].x) {
                    if(mouseX <= lastButtonLocations[2].x + lastButtonLocations[2].width) {
                        hoverType = hoverTypes.sound;
                        return;
                    } 
                } else if(mouseX >= lastButtonLocations[1].x) {
                    if(mouseX <= lastButtonLocations[1].x + lastButtonLocations[1].width) {
                        hoverType = hoverTypes.settings;
                        return;
                    }
                } else if(mouseX >= lastButtonLocations[0].x) {
                    if(mouseX <= lastButtonLocations[0].x + lastButtonLocations[0].width) {
                        hoverType = hoverTypes.music;
                        return;
                    }
                }
            }
        } else {
            if(mouseX >= playButtonLocation.x &&
               mouseX <= playButtonLocation.x + playButtonLocation.width &&
               mouseY >= playButtonLocation.y &&
               mouseY <= playButtonLocation.y + playButtonLocation.height) {
                hoverType = hoverTypes.play;
                return;
            }
        }
        hoverType = hoverTypes.none;
    }
    const titleText = "you versus 'finding a title'";


    const titleTestResult = drawTextTest(titleText,5);
    titleTestResult.width /= 2;

    const siloImage = imageDictionary["ui/silo"];
    const elfmartImage = imageDictionary["ui/elfmart"];

    const settingsText = "settings";
    const settingsTextTest = drawTextTest(settingsText,3);
    
    settingsTextTest.width /= 2;
    settingsTextTest.height /= 2;

    const noSoundText = "sound on";
    const noMusicText = "music on";
    
    const noSoundTextTest = drawTextTest(noSoundText,3);
    const noMusicTextTest = drawTextTest(noMusicText,3);
    noSoundTextTest.width /= 2;
    noSoundTextTest.height /= 2;
    noMusicTextTest.width /= 2;
    noMusicTextTest.height /= 2;
    
    const playText = "play";
    const playTextTest = drawTextTest(playText,4);
    playTextTest.width /= 2;
    playTextTest.height /= 2;

    const siloImageRatio = siloImage.height / siloImage.width;

    const renderButton = (button,withHover,text,textXOffset,textYOffset) => {
        context.fillStyle = "rgba(255,255,255,0.12)";
        context.fillRect(button.x,button.y,button.width,button.height);
        if(withHover) {
            context.fillStyle = ACoolBlueColor;
            context.fillRect(
                button.x-hoverPadding,
                button.y-hoverPadding,
                button.width+doubleHoverPadding,
                button.height+doubleHoverPadding
            );
        }
        drawTextWhite(
            text,
            Math.round(button.x+(button.width/2)-textXOffset),
            Math.round(button.y+(button.height/2)-textYOffset),
            3
        );
    }

    const stencilBackground = new RotatingBackground("spiral-menu");
    stencilBackground.rotationTime = 10000;
    stencilBackground.clockwise = true;

    const getPlaceholderLocation = () => {
        return {
            x: -1,
            y: -1,
            width: 0,
            height: 0
        }
    }

    const lastButtonLocations = [
        getPlaceholderLocation(),
        getPlaceholderLocation(),
        getPlaceholderLocation()
    ];

    const playButtonLocation = getPlaceholderLocation();

    this.fader = getFader();

    this.render = function(timestamp) {
        context.fillStyle = "black";
        context.fillRect(0,0,fullWidth,fullHeight);
        const textY = Math.floor((fullHeight*0.12)-titleTestResult.height);
        const rowHeight = titleTestResult.height+20;
        this.background.render(timestamp);
        context.fillStyle = "rgba(255,255,255,0.12)";

        context.fillRect(0,textY-10,fullWidth,rowHeight);
        drawTextWhite(
            titleText,
            Math.floor(halfWidth-titleTestResult.width),
            textY,
            5
        );

        context.drawImage(
            elfmartImage,0,0,elfmartImage.width,elfmartImage.height,
            10,
            fullHeight-96-10,
            96,96
        );

        playButtonLocation.width = fullWidth * 0.25;

        if(hoverType === hoverTypes.play) {
            const halfRadius = playButtonLocation.width / 2;
            const gradient = context.createRadialGradient(
                halfWidth,halfHeight,
                0,
                
                halfWidth,halfHeight,
                halfRadius
            );

            gradient.addColorStop(0,"cyan");
            gradient.addColorStop(1,"rgba(0,0,0,0.5)");
            context.fillStyle = gradient;
            context.fillRect(halfWidth-halfRadius,halfHeight-halfRadius,playButtonLocation.width,playButtonLocation.width);

        }

        playButtonLocation.height = siloImageRatio * playButtonLocation.width;
        playButtonLocation.x = halfWidth-playButtonLocation.width / 2;
        playButtonLocation.y = halfHeight-playButtonLocation.height / 2;
        
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
            "cyan",
            playText,
            Math.floor(halfWidth-playTextTest.width),
            Math.floor(halfHeight-playTextTest.height) + 5,
        4,4);

        const totalButtonWidth = fullWidth * 0.6;
        const buttonWidth = totalButtonWidth / 3;
        const halfButtonWidth = buttonWidth / 2;
        const buttonDistance = buttonWidth + halfButtonWidth;

        const buttonY = Math.floor((fullHeight*0.88)-titleTestResult.height);

        const b1 = lastButtonLocations[0];
        const b2 = lastButtonLocations[1];
        const b3 = lastButtonLocations[2];

        b2.x = halfWidth-buttonWidth/2;
        b2.y = buttonY;
    
        b1.x = halfWidth-buttonDistance-12;
        b1.y = buttonY;

        b3.x = halfWidth+buttonWidth/2+12;
        b3.y = buttonY;

        b2.height = rowHeight;
        b1.height = rowHeight;
        b3.height = rowHeight;
        b2.width = buttonWidth;
        b1.width = buttonWidth;
        b3.width = buttonWidth;


        renderButton(b1,hoverType===hoverTypes.music,musicMuted?"no music":"music on",noMusicTextTest.width,noMusicTextTest.height);
        renderButton(b2,hoverType===hoverTypes.settings,settingsText,settingsTextTest.width,settingsTextTest.height);
        renderButton(b3,hoverType===hoverTypes.sound,soundMuted?"no sound":"sound on",noSoundTextTest.width,noSoundTextTest.height);

        if(this.settingsPane) {
            this.settingsPane.render(timestamp);
        }

        this.fader.render(timestamp);
    }
}
export default MainMenuRenderer;
