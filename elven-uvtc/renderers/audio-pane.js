function AudioPane(callback,parent) {

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

    const sliderOnColor = "#EF0067";
    const sliderOffColor = "#1E1E1E";

    const sliderImage = imageDictionary["ui/menu-elf-slide"];
    const sliderImageRatio = sliderImage.height / sliderImage.width;

    this.leaving = false;

    let hoverTypes = {
        none:0,
        slider1: 1,
        slider2: 2,
        elfSlider1: 3,
        elfSlider2: 4
    };
    let hoverType = hoverTypes.none;

    this.exit = () => {
        if(callback) {
            callback(lastRelativeX,lastRelativeY);
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

    this.capturing = null;

    this.processClick = function(x,y) {
        if(this.leaving) {
            return;
        }
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
        this.processMove(x,y);
    }
    this.processClickEnd = function(x,y) {
        this.capturing = null;
        if(this.leaving) {
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
        } else {
            hoverType = hoverTypes.none;
        }
    }


    this.render = (timestamp,x,y,width,height) => {
        const widthNormal = fullWidth / 1920;
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "white";
        context.fillRect(x,y,width,height);
        context.globalCompositeOperation = "destination-over";
        parent.renderBackground(timestamp,true);
        context.restore();


        const fullSliderWidth = halfWidth;
        const sliderHeight = 60;
        const halfSliderHeight = sliderHeight / 2;

        slider1.x = Math.floor(halfWidth / 2);
        slider1.y = Math.floor(height * 0.33 - halfSliderHeight);
        slider1.width = fullSliderWidth;
        slider1.height = sliderHeight;

        slider2.x = Math.floor(slider1.x);
        slider2.y = Math.floor(height * 0.66 - halfSliderHeight);
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
        context.font = "24px Roboto";
        context.textAlign = "center";
        context.textBaseline = "middle";

        const labelTextX = slider1.x+labelWidth/2;
        context.fillText("music",labelTextX,slider1.y-halfSliderHeight);
        context.fillText("sound",labelTextX,slider2.y-halfSliderHeight);

        const elfWidth = 80;
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
    }
}

export default AudioPane;