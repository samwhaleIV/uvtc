import MainMenuRenderer from "./main-menu.js";
import ElvesFillIn from "./components/elves-fill-in.js";
import WorldSettingsRenderer from "./world-settings.js";
import MovesPaneRenderer from "./moves-pane.js";
import BoxFaderEffect from "./components/box-fader-effect.js";
import { OpenSound, CloseSound } from "../runtime/tones.js";

const ICON_PART_1_WIDTH = 64;
const ICON_PART_2_WIDTH = 58;
const ICON_ROW_SCALE_FACTOR = 4;
const HORIZONTAL_FALLBACK_MARGIN = 50;

function WorldUIRenderer(world) {

    const iconImage = imageDictionary["ui/escape-menu"];
    const iconImageRatio = iconImage.width / iconImage.height;
    const iconImageRatioInverse = iconImage.height / iconImage.width;

    const blurImage = imageDictionary["ui/escape-blur"];
    const hoverFX = imageDictionary["ui/escape-menu-fx"];

    const partOneRatio = ICON_PART_1_WIDTH / iconImage.height;
    const partTwoRatio = ICON_PART_2_WIDTH / iconImage.height;

    let loadStart = null;
    let loading = false;

    let leaveStart = null;
    let leaving = false;

    const transitionTime = 200;

    let leavingCallback = null;
    let panel = null;
    let transitioning = true;
    const exit = () => {
        transitioning = true;
        loadStart = null;
        leaveStart = performance.now();
        leaving = true;
        CloseSound();
    }
    const clearPanel = noSound => {
        panel = null;
        if(!noSound) {
            playSound("reverse-click");
        }
    }

    const iconMap = getPlaceholderLocation();
    const internalIconMap = {
        elfmart: {
            hoverID: 1,
            x: 2,
            y: 1,
            width: 28,
            height: 32
        },
        settings: {
            width: 32,
            height: 10,
            x: 33,
            y: 1,
            hoverID: 2
        },
        mainMenu: {
            width: 33,
            height: 23,
            x: 33,
            y: 11,
            hoverID: 3
        },
        moves: {
            x: 65,
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
    const hoverTypes = {
        elfmart: internalIconMap.elfmart.hoverID,
        settings: internalIconMap.settings.hoverID,
        mainMenu: internalIconMap.mainMenu.hoverID,
        moves: internalIconMap.moves.hoverID,
        help: internalIconMap.help.hoverID
    };
    
    let hoverType = null;
    
    this.processClick = (x,y) => {
        if(transitioning) {
            return;
        }
        if(panel) {
            panel.processClick(x,y);
            return;
        }
        this.processMove(x,y);
    }
    let lastSave = 0;
    const saveTimeout = 1000;
    this.processClickEnd = (x,y) => {
        if(transitioning) {
            return;
        }
        if(panel) {
            panel.processClickEnd(x,y);
            return;
        }
        if(hoverType) {
            switch(hoverType) {
                case internalIconMap.elfmart.hoverID:
                    exit();
                    break;
                case internalIconMap.settings.hoverID:
                    playSound("click");
                    panel = new WorldSettingsRenderer(clearPanel);
                    break;
                case internalIconMap.mainMenu.hoverID:
                    playSound("click");
                    setFaderEffectsRenderer(new BoxFaderEffect());
                    faderEffectsRenderer.fillInLayer = new ElvesFillIn();
                    transitioning = true;
                    world.saveState(true);
                    world.fader.fadeOut(MainMenuRenderer);
                    break;
                case internalIconMap.moves.hoverID:
                    playSound("click");

                    panel = new MovesPaneRenderer(clearPanel);
                    break;
                case internalIconMap.help.hoverID:
                    const now = performance.now();
                    if(now > lastSave + saveTimeout) {
                        world.saveState(true);
                        world.showAlert("Your progress has been saved!");
                        lastSave = now;
                    }
                    break;
            }
        }
    }
    this.processMove = (x,y) => {
        if(transitioning) {
            return;
        }
        if(panel) {
            panel.processMove(x,y);
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
        if(panel) {
            panel.processKey(key);
            return;
        }
        switch(key) {
            case kc.up:
            case kc.down:
            case kc.left:
            case kc.right:
                break;
            default:
                return;
        }
        switch(hoverType) {
            default:
                hoverType = hoverTypes.elfmart;
                break;
            case hoverTypes.elfmart:
                switch(key) {
                    case kc.left:
                    case kc.up:
                        hoverType = hoverTypes.help;
                        break;
                    case kc.down:
                    case kc.right:
                        hoverType = hoverTypes.settings;
                        break;
                }
                break;
            case hoverTypes.settings:
                switch(key) { 
                    case kc.up:
                    case kc.left:
                        hoverType = hoverTypes.elfmart;
                        break;
                    case kc.right:
                    case kc.down:
                        hoverType = hoverTypes.mainMenu;
                        break;
                }
                break;
            case hoverTypes.mainMenu:
                switch(key) {
                    case kc.left:
                    case kc.up:
                        hoverType = hoverTypes.settings;
                        break;
                    case kc.down:
                    case kc.right:
                        hoverType = hoverTypes.moves;
                        break;
                }
                break;
            case hoverTypes.moves:
                switch(key) {
                    case kc.up:
                    case kc.left:
                        hoverType = hoverTypes.mainMenu;
                        break;
                    case kc.down:
                    case kc.right:
                        hoverType = hoverTypes.help;
                        break;
                }
                break;
            case hoverTypes.help:
                switch(key) {
                    case kc.up:
                    case kc.left:
                        hoverType = hoverTypes.moves;
                        break;
                    case kc.down:
                    case kc.right:
                        hoverType = hoverTypes.elfmart;
                        break;
                }
                break;
        }
    }
    this.processKeyUp = key => {
        if(transitioning) {
            return;
        }
        if(panel) {
            panel.processKeyUp(key);
            return;
        }
        if(key === kc.accept) {
            if(!hoverType) {
                hoverType = hoverTypes.elfmart;
            } else {
                this.processClickEnd(-1,-1);
            }
        } else if(key === kc.cancel) {
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
    }
    this.renderParts = timeNormal => {
        if(timeNormal < 0) {
            timeNormal = 0;
        }
        let height = Math.max(Math.floor(fullHeight / ICON_ROW_SCALE_FACTOR / iconImage.height) * iconImage.height,iconImage.height*4);

        const testWidth = fullWidth - HORIZONTAL_FALLBACK_MARGIN;
        if(height * iconImageRatio > testWidth) {
            height = Math.max(Math.floor(testWidth * iconImageRatioInverse / iconImage.height)*iconImage.height,iconImage.height);
        }

        let padding = Math.round(height / 25);

        const backgroundHeight = height + padding + padding;
        context.fillStyle = "rgba(0,0,0,0.87)";
        const yBase = Math.floor(halfHeight-height/2);
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

            context.drawImage(iconImage,0,0,ICON_PART_1_WIDTH,iconImage.height,adjustedHalfWidth-part1Width,yBase,part1Width,height);
            context.drawImage(iconImage,ICON_PART_1_WIDTH,0,ICON_PART_2_WIDTH,iconImage.height,part2X,yBase,part2Width,height);
        }
    }
    this.render = timestamp => {
        if(panel) {
            panel.render(timestamp,0,0,fullWidth,fullHeight);
            return;
        }
        if(loading) {
            const progress = (timestamp - loadStart) / transitionTime;
            if(progress >= 1) {
                OpenSound();
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
export default WorldUIRenderer;
