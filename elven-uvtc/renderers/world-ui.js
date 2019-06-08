import ControlsPaneRenderer from "./controls-pane.js";
import AudioPaneRenderer from "./audio-pane.js";
import MainMenuRenderer from "./main-menu.js";

function WorldUIRenderer(world) {

    const iconImage = imageDictionary["ui/escape-menu"];
    const iconImageRatio = iconImage.width / iconImage.height;

    const blurImage = imageDictionary["ui/escape-blur"];
    const hoverFX = imageDictionary["ui/escape-menu-fx"];

    const iconPart1Width = 65;
    const iconPart2Width = 57;

    const partOneRatio = iconPart1Width / iconImage.height;
    const partTwoRatio = iconPart2Width / iconImage.height;

    let loadStart = null;
    let loading = false;

    let leaveStart = null;
    let leaving = false;

    const transitionTime = 200;

    let hoverType = null;

    let leavingCallback = null;
    let popup = null;
    let transitioning = true;
    const exit = () => {
        transitioning = true;
        loadStart = null;
        leaveStart = performance.now();
        leaving = true;
        playSound("reverse-click");
    }
    const clearPopup = () => {
        popup = null;
    }
    const controlsPane = new ControlsPaneRenderer(clearPopup,this);
    const audioPane = new AudioPaneRenderer(clearPopup,this);

    const iconMap = getPlaceholderLocation();
    const internalIconMap = {
        elfmart: {
            hoverID: 1,
            x: 1,
            y: 1,
            width: 32,
            height: 32
        },
        settings: {
            width: 31,
            height: 10,
            x: 34,
            y: 1,
            hoverID: 2
        },
        mainMenu: {
            width: 32,
            height: 23,
            x: 34,
            y: 11,
            hoverID: 3
        },
        moves: {
            x: 66,
            y: 4,
            width: 30,
            height: 27,
            hoverID: 4
        },
        help: {
            width: 24,
            height: 32,
            x: 97,
            y: 1,
            hoverID: 5
        }
    }
    
    this.processClick = (x,y) => {
        if(transitioning) {
            return;
        }
        if(popup) {
            popup.processClick(x,y);
            return;
        }
        this.processMove(x,y);
    }
    this.processClickEnd = (x,y) => {
        if(transitioning) {
            return;
        }
        if(popup) {
            popup.processClickEnd(x,y);
            return;
        }
        if(hoverType) {
            switch(hoverType) {
                case internalIconMap.elfmart.hoverID:
                    break;
                case internalIconMap.settings.hoverID:
                    break;
                case internalIconMap.mainMenu.hoverID:
                    playSound("click");
                    const pattern = context.createPattern(
                        imageDictionary["backgrounds/corrupt"],
                        "repeat"
                    );
                    faderEffectsRenderer.fillInLayer = {
                        render: () => {
                            context.fillStyle = pattern;
                            context.fillRect(0,0,fullWidth,fullHeight);
                        }
                    };
                    transitioning = true;
                    world.fader.fadeOut(MainMenuRenderer);
                    break;
                case internalIconMap.moves.hoverID:
                    break;
                case internalIconMap.help.hoverID:
                    break;
            }
        }
    }
    this.processMove = (x,y) => {
        if(transitioning) {
            return;
        }
        if(popup) {
            popup.processMove(x,y);
            return;
        }
        if(contains(x,y,iconMap)) {
            x = iconImage.width / iconMap.width * (x-iconMap.x);
            y = iconImage.height / iconMap.height * (y-iconMap.y);

            if(contains(x,y,internalIconMap.elfmart)) {
                hoverType = internalIconMap.elfmart.hoverID;

            } else if(contains(x,y,internalIconMap.settings)) {
                hoverType = internalIconMap.settings.hoverID;

            } else if(contains(x,y,internalIconMap.mainMenu)) {
                hoverType = internalIconMap.mainMenu.hoverID;

            } else if(contains(x,y,internalIconMap.moves)) {
                hoverType = internalIconMap.moves.hoverID;

            } else if(contains(x,y,internalIconMap.help)) {
                hoverType = internalIconMap.help.hoverID;

            } else {
                hoverType = 0;
            }
        } else {
            hoverType = 0;
        }
    }
    this.processKey = key => {
        if(transitioning) {
            return;
        }
        if(popup) {
            popup.processKey(key);
            return;
        }
    }
    this.processKeyUp = key => {
        if(transitioning) {
            return;
        }
        if(popup) {
            popup.processKeyUp(key);
            return;
        }
        if(key === kc.cancel) {
            exit();
        }
    }
    this.renderBackground = () => {
        context.fillStyle = "rgba(255,255,255,0.8)";
        context.fillRect(0,0,fullWidth,fullHeight);
    }
    this.show = callback => {
        leaving = false;
        transitioning = true;
        leavingCallback = callback;
        loadStart = performance.now();
        loading = true;
        hoverType = null;
        //Do something that transitions then sets transitioning to false
    }
    this.renderParts = timeNormal => {
        if(timeNormal < 0) {
            timeNormal = 0;
        }
        const height = 250;
        const padding = 30;
        const backgroundHeight = height + padding + padding;
        context.fillStyle = "rgba(0,0,0,0.87)";
        const yBase = halfHeight-height/2;
        if(timeNormal >= 1) {
            context.drawImage(blurImage,0,0,blurImage.width,blurImage.height,0,0,fullWidth,fullHeight);
            context.fillRect(0,yBase-padding,fullWidth,backgroundHeight);
            const imageWidth = height * iconImageRatio;
            iconMap.x = halfWidth-height*partOneRatio;
            iconMap.y = yBase;
            iconMap.width = imageWidth;
            iconMap.height = height;
            if(hoverType) {
                context.drawImage(
                    hoverFX,0,(hoverType-1)*iconImage.height,hoverFX.width,iconImage.height,
                    iconMap.x,iconMap.y,iconMap.width,iconMap.height
                );
            }
            context.drawImage(
                iconImage,0,0,iconImage.width,iconImage.height,
                iconMap.x,iconMap.y,iconMap.width,iconMap.height
            );
        } else {
            context.save();
            context.globalAlpha = timeNormal;
            context.drawImage(blurImage,0,0,blurImage.width,blurImage.height,0,0,fullWidth,fullHeight);
            context.restore();

            let adjustedHalfWidth = halfWidth * timeNormal;
            if(adjustedHalfWidth > halfWidth) {
                adjustedHalfWidth = halfWidth;
            }
            context.fillRect(0,yBase-padding,adjustedHalfWidth,backgroundHeight);
            const part2X = fullWidth-adjustedHalfWidth
            context.fillRect(part2X,yBase-padding,adjustedHalfWidth,backgroundHeight);

            const part1Width = partOneRatio * height;
            const part2Width = partTwoRatio * height;

            context.drawImage(iconImage,0,0,iconPart1Width,iconImage.height,adjustedHalfWidth-part1Width,yBase,part1Width,height);
            context.drawImage(iconImage,iconPart1Width,0,iconPart2Width,iconImage.height,part2X,yBase,part2Width,height);
        }
    }
    this.render = timestamp => {
        if(popup) {
            popup.render(timestamp,0,0,fullWidth,fullHeight);
        } else {
            if(loading) {
                const progress = (timestamp - loadStart) / transitionTime;
                if(progress >= 1) {
                    playSound("click");
                    loading = false;
                    transitioning = false;
                }
                this.renderParts(progress);
            } else if(leaving) {
                const progress = (timestamp - leaveStart) / transitionTime;
                if(progress >= 1) {
                    if(leavingCallback) {
                        leavingCallback();
                    }
                    return;
                }
                this.renderParts(1-progress);
            } else {
                this.renderParts(1);
            }
        }
    }
}
export default WorldUIRenderer;
