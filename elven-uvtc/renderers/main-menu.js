function MainMenuRenderer() {
   
    this.updateSize = function() {
    }

    const hoverTypes = {
        none: Symbol("none"),

    }

    this.background = new RotatingBackground("stars-menu");

    this.processKey = function(key) {
        switch(key) {
            case "Space":
                break;
            case "Escape":
                break;
        }
    }
    this.processKeyUp = function(key) {
        switch(key) {
            default:break;
        }
    }

    this.processClick = function(x,y) {
        this.processMove(x,y);
        if(hoverIndex >= 0) {
            showHoverSpecialEffect = true;
        }
    }


    this.processClickEnd = function(x,y) {
        showHoverSpecialEffect = false;
        switch(hoverType) {
            default:break;
        }
        this.processMove(x,y);
    }

    this.processMove = function(mouseX,mouseY) {
       
        hoverType = hoverTypes.none;
        hoverIndex = defaultHoverIndex;
    }
    const titleText = "you versus trading cards";


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

    const renderButton = (x,y,width,height,withHover,text,textXOffset,textYOffset) => {
        context.fillStyle = "rgba(255,255,255,0.12)";
        context.fillRect(x,y,width,height);
        drawTextWhite(
            text,
            Math.round(x+(width/2)-textXOffset),
            Math.round(y+(height/2)-textYOffset),
            3
        );
    }

    const stencilBackground = new RotatingBackground("spiral-menu");
    stencilBackground.rotationTime = 10000;
    stencilBackground.clockwise = true;

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
    
        const siloImageWidth = fullWidth * 0.25;
        const siloImageHeight = siloImageRatio * siloImageWidth;
        
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.drawImage(
            siloImage,0,0,siloImage.width,siloImage.height,
            halfWidth-siloImageWidth/2,
            halfHeight-siloImageHeight/2,
            siloImageWidth,
            siloImageHeight
        );

        context.globalCompositeOperation = "destination-over";
        context.fillStyle = "red";
        stencilBackground.render(timestamp);

        context.restore();



        drawTextStencil(
            "white",
            playText,
            Math.floor(halfWidth-playTextTest.width),
            Math.floor(halfHeight-playTextTest.height) + 5,
        4,4);

        const totalButtonWidth = fullWidth * 0.6;
        const buttonWidth = totalButtonWidth / 3;
        const halfButtonWidth = buttonWidth / 2;
        const buttonDistance = buttonWidth + halfButtonWidth;

        const buttonY = Math.floor((fullHeight*0.88)-titleTestResult.height);

        renderButton(halfWidth-buttonWidth/2,buttonY,buttonWidth,rowHeight,false,settingsText,settingsTextTest.width,settingsTextTest.height);
        renderButton(halfWidth-buttonDistance-12,buttonY,buttonWidth,rowHeight,false,musicMuted?"no music":"music on",noMusicTextTest.width,noMusicTextTest.height);
        renderButton(halfWidth+buttonWidth/2+12,buttonY,buttonWidth,rowHeight,false,soundMuted?"no sound":"sound on",noSoundTextTest.width,noSoundTextTest.height);

    }
}
