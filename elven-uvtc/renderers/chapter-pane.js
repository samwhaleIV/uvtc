import WorldRenderer from "../renderers/world.js";
import GlobalState from "../../../elven-engine/runtime/global-state.js";
import Chapters from "../runtime/chapters.js";
import UIPrompt from "./components/ui-prompt.js";
import ChapterManager from "../runtime/chapter-manager.js";
import MovesManager from "../runtime/moves-manager.js";

function ChapterPane(callback,parent,instant=false) {

    const movesIcon = imageDictionary["ui/moves"];

    let prompt = null;
    const clearPrompt = () => {
        prompt = null;
        this.processMove(lastRelativeX,lastRelativeY);
    }

    let leftButton = getPlaceholderLocation();
    let rightButton = getPlaceholderLocation();
    let centerButton = getPlaceholderLocation();
    let exitLabel = getPlaceholderLocation();

    const hoverTypes = {
        none: 0,
        leftButton: 1,
        centerButton: 2,
        rightButton: 3,
        exitLabel: 4
    };
    let hoverType = hoverTypes.none;

    const warpInTime = 200;
    let fadeOutStart;
    let fadeOutTime = 400;

    this.leaving = false;

    this.fadeOutEnd = null;

    this.exit = () => {
        if(callback) {
            fadeOutStart = performance.now();
            this.leaving = true;
            this.fadeOutEnd = () => {
                callback(lastRelativeX,lastRelativeY);
            }
        }
    }
    let cancelDown = false;
    this.processKey = function(key) {
        if(this.leaving) {
            return;
        }
        if(prompt && prompt.shown) {
            prompt.processKey(key);
            return;
        }
        if(key === kc.cancel) {
            cancelDown = true;
        }
    }
    this.processKeyUp = function(key) {
        if(this.leaving) {
            return;
        }
        if(prompt && prompt.shown) {
            prompt.processKeyUp(key);
            return;
        }
        switch(key) {
            case kc.cancel:
                cancelDown = false;
                this.exit();
                break;
        }
    }
    this.processClick = function(x,y) {
        if(this.leaving) {
            return;
        }
        if(prompt && prompt.shown) {
            prompt.processClick(x,y);
            return;
        }
        this.processMove(x,y);
    }
    const exitText = "exit";
    this.processClickEnd = function(x,y) {
        if(this.leaving) {
            return;
        }
        if(prompt && prompt.shown) {
            prompt.processClickEnd(x,y);
            return;
        }
        switch(hoverType) {
            case hoverTypes.exitLabel:
                this.exit();
                break;
            case hoverTypes.leftButton:
                if(this.leftButtonText === exitText) {
                    this.exit();
                } else if(this.leftButtonText) {
                    playSound("click");
                    this.chapterBack();
                }
                break;
            case hoverTypes.centerButton:
                const loadWorld = () => {
                    ChapterManager.setChapter(this.chapterNumber);
                    parent.fader.fadeOut(WorldRenderer);
                    let startTime = 0;
                    let timeOffset = 0;
                    faderEffectsRenderer.fillInLayer = {
                        render: timestamp => {
                            parent.renderBackground(timestamp-timeOffset,true);
                        }
                    }
                    faderEffectsRenderer.pauseCallbackOnce = () => {
                        startTime = performance.now();
                    }
                    faderEffectsRenderer.callbackOnce = () => {
                        timeOffset = rendererState.fader.start - startTime;
                    }
                }

                const highestChapter = GlobalState.data.highestChapterFinished || 0;
                if(this.chapterNumber > highestChapter + 1) {
                    prompt = new UIPrompt("You must finish the previous chapter\nbefore you can play this chapter!",{
                        text: "Okay",
                        callback: clearPrompt
                    });
                    prompt.show();
                } else {
                    if(GlobalState.data.activeChapter === this.chapterNumber) {
                        prompt = new UIPrompt("Chapter already in progress.\nDo you want to start over?",{
                            text: "Yes",
                            callback: () => {
                                clearPrompt();
                                loadWorld();
                            }
                        },{
                            text: "No",
                            callback: () => {
                                if(GlobalState.data.tippedAboutMenu) {
                                    clearPrompt();
                                } else {
                                    const newPrompt = new UIPrompt("Tip: Use the play button on the main\nmenu to continue your current chapter.",{
                                        text: "Got it",
                                        callback: clearPrompt
                                    },{
                                        text: "Don't tell me again",
                                        callback: () => {
                                            GlobalState.data.tippedAboutMenu = true;
                                            GlobalState.save();
                                            clearPrompt();
                                        }
                                    });
                                    newPrompt.show();
                                    prompt = newPrompt;
                                }
                            }
                        });
                        prompt.show();
                    } else {
                        if(GlobalState.data.activeChapter) {
                            prompt = new UIPrompt("A different chapter is active.\nDo you want end it?",{
                                text: "Yes, start this chapter",
                                callback: () => {
                                    clearPrompt();
                                    loadWorld();
                                }
                            },{
                                text: "Keep current chapter",
                                callback: clearPrompt
                            });
                            prompt.show();
                        } else {
                            loadWorld();
                        }
                    }
                }
                break;
            case hoverTypes.rightButton:
                if(this.rightButtonText === exitText) {
                    this.exit();
                    break;
                } else if(this.rightButtonText) {
                    if(this.chapterNumber === Chapters.length) {
                        playSound("energy");
                    } else {
                        playSound("click");
                    }
                    this.chapterForward();
                }
                break;
        }
        this.processMove(x,y);
    }
    this.processMove = function(x,y) {
        if(this.leaving) {
            return;
        }
        if(prompt && prompt.shown) {
            prompt.processMove(x,y);
            return;
        }
        if(contains(x,y,leftButton)) {
            hoverType = hoverTypes.leftButton;
        } else if(contains(x,y,centerButton)) {
            hoverType = hoverTypes.centerButton;
        } else if(contains(x,y,rightButton)) {
            hoverType = hoverTypes.rightButton;
        } else if(contains(x,y,exitLabel)) {
            hoverType = hoverTypes.exitLabel;
        } else {
            hoverType = hoverTypes.none;
        }
    }

    this.renderCenterImage = size => {
        let halfSize = size / 2;
        const image = this.currentImage;
        const x = Math.floor(halfWidth - halfSize);
        const y = Math.floor(halfHeight - halfSize);
        context.drawImage(
            image,
            0,0,image.width,image.height,
            x,y,size,size
        );
        if(this.moveProgress !== null) {
            size = size / 5;
            size = Math.ceil(size / 32)*32;

            context.drawImage(
                movesIcon,
                this.moveProgress*32,this.moveCount*32,32,32,
                x,y,size,size
            );

        }
    }

    this.chapterForward = () => {
        const newChapter = this.chapterNumber + 1;
        if(newChapter > Chapters.length) {
            return;
        }
        this.changeChapterPage(newChapter);
    }
    this.chapterBack = () => {
        const newChapter = this.chapterNumber - 1;
        if(newChapter < 1) {
            return;
        }
        this.changeChapterPage(newChapter);
    }

    this.moveProgress = null;
    
    this.changeChapterPage = chapterNumber => {
        if(chapterNumber > Chapters.length) {
            throw Error("Chapter number greater than chapter count");
        }
        let chapterImage = imageDictionary[`ui/chapters/${chapterNumber}`];
        if(!chapterImage) {
            chapterImage = imageDictionary[ERROR_IMAGE];
        }
        const finalChapter = chapterNumber === Chapters.length;
        this.currentImage = chapterImage;
        this.chapterTitle = finalChapter ? "Final Chapter" : `Chapter ${chapterNumber}`;
        this.chapterSubTitle = Chapters[chapterNumber-1].title;
        if(chapterNumber === 1) {
            this.leftButtonText = "";
        } else {
            this.leftButtonText = `chapter ${chapterNumber-1}`;
        }
        if(finalChapter) {
            this.rightButtonText = "";
        } else {
            this.rightButtonText = `chapter ${chapterNumber+1}`;
        }
        this.chapterNumber = chapterNumber;
        const unlockableCount = MovesManager.chapterMoveCount(chapterNumber);
        if(unlockableCount) {
            const progress = MovesManager.chapterMovesUnlocked(chapterNumber);
            this.moveProgress = progress;
            this.moveCount = unlockableCount-1;
        } else {
            this.moveProgress = null;
            this.moveCount = null;
        }
    }

    if(GlobalState.data.activeChapter) {
        this.changeChapterPage(GlobalState.data.activeChapter);
    } else {
        let highestChapter = GlobalState.data.highestChapterFinished;
        if(highestChapter) {
            highestChapter++;
            if(highestChapter > Chapters.length) {
                highestChapter = Chapters.length;
            }
            this.changeChapterPage(highestChapter);
        } else {
            this.changeChapterPage(1);
        }
    }

    this.centerButtonText = "P  L  A  Y";

    let startTime;
    if(instant) {
        startTime = 1;
    }
    this.render = (timestamp,x,y,width,height) => {
        if(!startTime) {
            startTime = timestamp;
        }
        const delta = timestamp - startTime;
        if(delta < warpInTime) {
            const startHeight = height;
            const startWidth = width;
            height = delta / warpInTime * height;
            width = delta / warpInTime * width;
            x = (x + startWidth / 2) - width / 2;
            y = (y + startHeight / 2) - height / 2;
        } else if(fadeOutStart) {
            let alpha = 1 - ((timestamp - fadeOutStart) / fadeOutTime);
            if(alpha <= 0) {
                this.fadeOutEnd();
                return;
            }
            context.save();
            if(alpha < 0) {
                alpha = 0;
            }
            context.globalAlpha = alpha;
        }

        const fontSize = 21;

        const robotoOffset = 2.5 * widthNormal;

        const imageSize = halfHeight;

        const sideButtonWidth = 180;
        const sideButtonHeight = 70;
        const centerButtonHeight = 70;
        const centerButtonWidth = 150;

        const halfButtonWidth = sideButtonWidth / 2;
        const halfButtonHeight = sideButtonHeight / 2;

        const leftButtonCenterX = halfWidth - imageSize / 2 - halfButtonWidth - fontSize;
        const rightButtonCenterX = halfWidth + imageSize / 2 + halfButtonWidth + fontSize;

        leftButton.x = Math.floor(leftButtonCenterX - halfButtonWidth);
        leftButton.y = Math.floor(halfHeight - halfButtonHeight);
        rightButton.x = Math.floor(rightButtonCenterX - halfButtonWidth);
        rightButton.y = leftButton.y;
        leftButton.width = Math.floor(sideButtonWidth);
        leftButton.height = Math.floor(sideButtonHeight);
        rightButton.width = leftButton.width;
        rightButton.height = leftButton.height;

        centerButton.height = Math.floor(centerButtonHeight);
        centerButton.width = Math.floor(centerButtonWidth);
        centerButton.y = Math.floor(halfHeight - centerButton.height / 2);
        centerButton.x = Math.floor(halfWidth - centerButton.width / 2);

        context.save();
        context.globalCompositeOperation = "destination-out";
        context.fillStyle = "white";
        context.fillRect(x,y,width,height);
        context.globalCompositeOperation = "source-over";
        this.renderCenterImage(imageSize);
        if(hoverType === hoverTypes.centerButton) {
            renderButtonHover(centerButton.x,centerButton.y,centerButton.width,centerButton.height);
        }
        context.globalCompositeOperation = "destination-out";
        drawRectangle(centerButton,"black");
        context.globalCompositeOperation = "destination-over";
        parent.renderBackground(timestamp);
        context.restore();

        if(this.leftButtonText) {
            if(hoverType === hoverTypes.leftButton) {
                renderButtonHover(leftButton.x,leftButton.y,leftButton.width,leftButton.height);
            }
            drawRectangle(leftButton,"black");
        }

        if(this.rightButtonText) {
            if(hoverType === hoverTypes.rightButton) {
                renderButtonHover(rightButton.x,rightButton.y,rightButton.width,rightButton.height);
            }
            drawRectangle(rightButton,"black");
        }

        context.font = "100 21px Roboto";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "white";

        context.fillText(this.leftButtonText,leftButtonCenterX,halfHeight+robotoOffset);
        context.fillText(this.rightButtonText,rightButtonCenterX,halfHeight+robotoOffset);
        context.fillText(this.centerButtonText,halfWidth,halfHeight+robotoOffset);

        context.font = "300 21px Roboto";
        const subtitleWidth = context.measureText(this.chapterSubTitle).width;

        const subtitleBoxCenterY = halfHeight + imageSize / 2 + fontSize;
        context.fillStyle = "black";
        context.fillRect(Math.round(halfWidth-fontSize-subtitleWidth/2),subtitleBoxCenterY,Math.round(subtitleWidth+fontSize+fontSize)+4,50);
        context.fillStyle = "white";

        context.fillText(this.chapterSubTitle,halfWidth,subtitleBoxCenterY+25+robotoOffset);
        context.font = "300 38px Roboto";
        context.fillText(this.chapterTitle,halfWidth,halfHeight - imageSize / 2 - 42);

        exitLabel = renderExitButton(x,y,hoverType===hoverTypes.exitLabel,false,cancelDown);
        
        if(fadeOutStart) {
            context.restore();
        }

        if(prompt) {
            prompt.render(timestamp);
        }
    }
}
export default ChapterPane;
