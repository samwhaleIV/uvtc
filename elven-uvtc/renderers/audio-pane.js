function AudioPane(callback,parent) {

    let fadeInStart = null;
    let fadeOutStart = null;
    const fadeInTime = 300;
    this.transitioning = true;

    let musicVolumeNormal = getMusicVolume();
    let soundVolumeNormal = getSoundVolume();

    const updateMusicVolume = normal => {
        musicVolumeNormal = normal;
        setMusicVolume(normal);
    }
    const updateSoundVolume = normal => {
        soundVolumeNormal = normal;
        setSoundVolume(normal);
    }

    const getVolumeNormal = (x,xStart,width) => {
        if(x < xStart) {
            return 0;
        } else if(x > xStart + width) {
            return 1;
        } else {
            return (x - xStart) / width;
        }
    }

    let slider1 = getPlaceholderLocation();
    let slider2 = getPlaceholderLocation();

    let elfSlider1 = getPlaceholderLocation();
    let elfSlider2 = getPlaceholderLocation();

    let exitLabel = getPlaceholderLocation();

    const sliderOnColor = "#EF0067";
    const sliderOffColor = "#1E1E1E";

    const sliderImage = imageDictionary["ui/menu-elf-slide"];
    const sliderImageRatio = sliderImage.height / sliderImage.width;

    this.transitioning = false;

    let hoverTypes = {
        none:0,
        slider1: 1,
        slider2: 2,
        elfSlider1: 3,
        elfSlider2: 4,
        exitLabel: 5
    };
    let hoverType = hoverTypes.none;

    this.exit = () => {
        if(callback) {
            this.transitioning = true;
            fadeOutStart = performance.now();
            this.fadeOutEnd = () => {
                callback(lastRelativeX,lastRelativeY);
            }
        }
    }

    this.processKey = function(key) {
        if(this.transitioning) {
            return;
        }
    }
    this.processKeyUp = function(key) {
        if(this.transitioning) {
            return;
        }
        switch(key) {
            case kc.cancel:
                this.exit();
                break;
        }
    }

    this.capturing = null;

    this.processClick = function(x,y) {
        if(this.transitioning) {
            return;
        }
        this.processMove(x,y);
        switch(hoverType) {
            case hoverTypes.elfSlider1:
            case hoverTypes.slider1:
                this.capturing = hoverTypes.slider1;
                break;
            case hoverTypes.elfSlider2:
            case hoverTypes.slider2:
                this.capturing = hoverTypes.slider2;
                break;
        }
    }
    this.processClickEnd = function(x,y) {
        this.capturing = null;
        if(this.transitioning) {
            return;
        }
        switch(hoverType) {
            case hoverTypes.elfSlider1:
            case hoverTypes.slider1:
                updateMusicVolume(
                    getVolumeNormal(x,slider1.x,slider1.width)
                );
                saveVolumeChanges();
                break;
            case hoverTypes.elfSlider2:
            case hoverTypes.slider2:
                playSound("energy");
                updateSoundVolume(
                    getVolumeNormal(x,slider2.x,slider2.width)
                );
                saveVolumeChanges();
                break;
            case hoverTypes.exitLabel:
                this.exit();
                break;
        }
        this.processMove(x,y);
    }
    this.processMove = function(x,y) {
        if(this.transitioning) {
            return;
        }
        if(this.capturing !== null) {
            if(this.capturing === hoverTypes.slider1) {
                updateMusicVolume(
                    getVolumeNormal(x,slider1.x,slider1.width)
                );
            } else if(this.capturing === hoverTypes.slider2) {
                updateSoundVolume(
                    getVolumeNormal(x,slider2.x,slider2.width)
                );
            }
            return;
        }
        if(contains(x,y,elfSlider2)) {
            hoverType = hoverTypes.elfSlider2;
        } else if(contains(x,y,elfSlider1)) {
            hoverType = hoverTypes.elfSlider1;
        } else if(contains(x,y,slider1)) {
            hoverType = hoverTypes.slider1;
        } else if(contains(x,y,slider2)) {
            hoverType = hoverTypes.slider2;
        } else if(contains(x,y,exitLabel)) {
            hoverType = hoverTypes.exitLabel;
        } else {
            hoverType = hoverTypes.none;
        }
    }


    this.render = (timestamp,x,y,width,height) => {
        const halfWidth = width / 2;
        let restorationRequired = false;
        if(fadeOutStart) {
            const fadeOutDelta = (timestamp - fadeOutStart) / fadeInTime;
            if(fadeOutDelta >= 1) {
                this.fadeOutEnd();
                return;
            }
            restorationRequired = true;
            context.save();
            context.globalAlpha = 1 - fadeOutDelta;
        } else {
            if(!fadeInStart) {
                fadeInStart = timestamp;
            }
            const fadeInDelta = (timestamp - fadeInStart) / fadeInTime;
            if(fadeInDelta < 1) {
                context.save();
                context.globalAlpha = fadeInDelta;
                restorationRequired = true;
            } else {
                this.transitioning = false;
            }
        }

        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "white";
        context.fillRect(x,y,width,height);
        context.globalCompositeOperation = "destination-over";
        parent.renderBackground(timestamp,true);
        context.restore();


        let fullSliderWidth = halfWidth;
        let sliderHeight = 60;
        let elfWidth = 70;

        if(fullSliderWidth <= internalWidth - 150) {
            fullSliderWidth = internalWidth - 150;
        }
        if(fullHeight <= internalHeight) {
            sliderHeight = 50;
            elfWidth = 60;
        }

        const halfSliderHeight = sliderHeight / 2;

        slider1.x = Math.floor(x + halfWidth - fullSliderWidth / 2);
        slider1.y = Math.floor(height * 0.33);
        slider1.width = fullSliderWidth;
        slider1.height = sliderHeight;

        slider2.x = slider1.x;
        slider2.y = Math.floor(height * 0.66);
        slider2.width = fullSliderWidth;
        slider2.height = sliderHeight;

        let leftWidth = musicVolumeNormal * fullSliderWidth;
        let rightWidth = fullSliderWidth - leftWidth;
        context.fillStyle = sliderOnColor;
        context.fillRect(slider1.x,slider1.y,leftWidth,sliderHeight);
        context.fillStyle = sliderOffColor;
        context.fillRect(slider1.x+leftWidth,slider1.y,rightWidth,sliderHeight);

        leftWidth = soundVolumeNormal * fullSliderWidth;
        rightWidth = fullSliderWidth - leftWidth;
        context.fillStyle = sliderOnColor;
        context.fillRect(slider2.x,slider2.y,leftWidth,sliderHeight);
        context.fillStyle = sliderOffColor;
        context.fillRect(slider2.x+leftWidth,slider2.y,rightWidth,sliderHeight);

        const labelWidth = 150;
        context.fillStyle = "black";
        context.fillRect(slider1.x,slider1.y-sliderHeight,labelWidth,sliderHeight);
        context.fillRect(slider2.x,slider2.y-sliderHeight,labelWidth,sliderHeight);
        context.fillStyle = "white";
        context.font = "100 24px Roboto";
        context.textAlign = "center";
        context.textBaseline = "middle";

        const labelTextX = slider1.x+labelWidth/2;
        context.fillText("music",labelTextX,slider1.y-halfSliderHeight);
        context.fillText("sound",labelTextX,slider2.y-halfSliderHeight);

        const elfHeight = sliderImageRatio * elfWidth;

        const elfYOffset = elfHeight / 2 - halfSliderHeight;
        const elfXOffset = elfWidth / 2;

        elfSlider1.x = slider1.x + slider1.width * musicVolumeNormal - elfXOffset;
        elfSlider1.y = slider1.y - elfYOffset;

        elfSlider2.x = slider2.x + slider2.width * soundVolumeNormal - elfXOffset;
        elfSlider2.y = slider2.y - elfYOffset;

        elfSlider1.width = elfWidth;
        elfSlider2.width = elfWidth;

        elfSlider1.height = elfHeight;
        elfSlider2.height = elfHeight;

        context.drawImage(
            sliderImage,0,0,sliderImage.width,sliderImage.height,
            elfSlider1.x,elfSlider1.y,elfWidth,elfHeight
        );
        context.drawImage(
            sliderImage,0,0,sliderImage.width,sliderImage.height,
            elfSlider2.x,elfSlider2.y,elfWidth,elfHeight
        );

        exitLabel = renderExitButton(x,y,hoverType===hoverTypes.exitLabel,false);

        if(restorationRequired) {
            context.restore();
        }
    }
}

export default AudioPane;