import RotatingBackground from "./components/rotating-background.js";
import MovesManager from "../runtime/moves-manager.js";
import Moves from "../runtime/battle/moves.js";
import MoveSelectRenderer from "./move-select.js";

const ROW_TITLE_COLOR = "#2C2C2C";

const ATTACK_TYPE = "attack";
const DEFENSE_TYPE = "defense";
const SPECIAL_TYPE = "special";

const LABEL_ONE_TEXT = "select slots...";
const LABEL_TWO_TEXT = "choose wisely.";

const BANNER_IMAGE_PATH = "ui/atdesp";
const BACKGROUND_NAME = "spiral-move-select";

function MovesPaneRenderer(callback) {
    if(!callback) {
        throw Error("Move pane renderer is missing a callback method");
    } else if(typeof callback !== "function") {
        throw Error("Callback must be a function");
    }

    let selectionModal = null;

    const attackSlot =  getPlaceholderLocation();
    const defenseSlot = getPlaceholderLocation();
    const specialSlot = getPlaceholderLocation();

    attackSlot.value =  MovesManager.getSlot(ATTACK_TYPE);
    defenseSlot.value = MovesManager.getSlot(DEFENSE_TYPE);
    specialSlot.value = MovesManager.getSlot(SPECIAL_TYPE);

    const tryRestoreToNone = target => {
        if(!target.value) {
            target.value = Moves.None;
            MovesManager.setSlot(target.type,target.value.name);
        }
    }

    attackSlot.type = ATTACK_TYPE;
    defenseSlot.type = DEFENSE_TYPE;
    specialSlot.type = SPECIAL_TYPE;

    tryRestoreToNone(attackSlot);
    tryRestoreToNone(defenseSlot);
    tryRestoreToNone(specialSlot);

    const updateValue = function(newValue) {
        this.value = Moves[newValue];
        MovesManager.setSlot(this.type,newValue);
    }
    attackSlot.updateMove =  updateValue.bind(attackSlot);
    defenseSlot.updateMove = updateValue.bind(defenseSlot);
    specialSlot.updateMove = updateValue.bind(specialSlot);

    const exit = () => {
        if(selectionModal) {
            selectionModal = null;
            this.processMove(lastRelativeX,lastRelativeY);
            playSound("reverse-click");
        } else {
            callback();
        }
    }

    let exitButton = getPlaceholderLocation();

    const hoverTypes = {
        none: 0,
        exitButton: 1,
        attackSlot: attackSlot,
        defenseSlot: defenseSlot,
        specialSlot: specialSlot
    };

    let hoverType = hoverTypes.none;
    this.processClickEnd = () => {
        if(hoverType === hoverTypes.exitButton) {
            exit();
            return;
        }
        if(selectionModal) {
            selectionModal.processClickEnd();
            return;
        }
        switch(hoverType) {
            case hoverTypes.none:
                break;
            default:
                const slot = hoverType;
                const unlockedMoves = MovesManager.getUnlockedMoves();
                const moveOptions = Object.keys(unlockedMoves).sort().map(
                    moveName=>Moves[moveName]
                ).filter(move=>{
                    return move && move.type === slot.type;
                });
                const isAttackSlot = hoverType === hoverTypes.attackSlot;
                if(!isAttackSlot || (isAttackSlot && moveOptions.length === 0)) {
                    moveOptions.unshift(Moves.None);
                }
                playSound("click");
                selectionModal = new MoveSelectRenderer(moveOptions,newMove=>{
                    exit();
                    slot.updateMove(newMove)
                });
                selectionModal.title = `Select a${slot.type.charAt(0)==="a"?"n":""} ${slot.type} move...`;
                break;
        }
    }
    this.processMove = (x,y) => {
        if(contains(x,y,exitButton)) {
            hoverType = hoverTypes.exitButton;
            return;
        } else if(hoverType === hoverTypes.exitButton) {
            hoverType = hoverTypes.none;
        }
        if(selectionModal) {
            selectionModal.processMove(x,y);
            return;
        }
        if(contains(x,y,attackSlot)) {
            hoverType = hoverTypes.attackSlot;
        } else if(contains(x,y,defenseSlot)) {
            hoverType = hoverTypes.defenseSlot;
        } else if(contains(x,y,specialSlot)) {
            hoverType = hoverTypes.specialSlot;
        } else {
            hoverType = hoverTypes.none;
        }
    }
    this.processClick = this.processMove;
    let cancelDown = false;
    this.processKey = key => {
        if(key === kc.cancel) {
            cancelDown = true;
        }
    }
    this.processKeyUp = key => {
        if(key === kc.cancel) {
            cancelDown = false;
            exit();
        }
    }

    const renderMoveSlot = (target,x,y,size,withHover) => {
        target.value.render(x,y,size,withHover,false);
        target.x = x;
        target.y = y;
        target.width = size;
        target.height = size;
    }

    const bannerImage = imageDictionary[BANNER_IMAGE_PATH];

    const background = new RotatingBackground(BACKGROUND_NAME);
    background.rotationTime = 2 * 60 * 1000;
    background.clockwise = true;

    this.render = timestamp => {
        background.render(timestamp);
        exitButton = renderExitButton(0,0,hoverType===hoverTypes.exitButton,false,cancelDown);
        let innerAreaX = 50;
        let innerAreaY = exitButton.y + exitButton.height + 10;
        let innerAreaWidth = fullWidth - 100;
        let innerAreaHeight = fullHeight - innerAreaY - 10;

        let subAreaHeight = innerAreaHeight;
        let subAreaWidth = innerAreaHeight;
        if(subAreaWidth + 10 > fullWidth) {
            subAreaHeight = innerAreaWidth;
            subAreaWidth = innerAreaWidth;
        }
        const subAreaX = Math.floor((innerAreaX + innerAreaWidth / 2) - (subAreaWidth / 2));
        const subAreaY = Math.floor((innerAreaY + innerAreaHeight / 2) - (subAreaHeight / 2));


        const textScale = adaptiveTextScale * 2;
        const verticalTextMargin = Math.floor(subAreaHeight * 0.1);
        drawTextBlack(LABEL_ONE_TEXT,subAreaX + 5,subAreaY + verticalTextMargin,textScale);
        const drawTextTestResult = drawTextTest(LABEL_TWO_TEXT,textScale);
        drawTextBlack(LABEL_TWO_TEXT,
            subAreaX+subAreaWidth-drawTextTestResult.width-5,
            subAreaY+subAreaHeight-drawTextTestResult.height-verticalTextMargin,
            textScale
        );

        const slotSize = Math.floor(subAreaWidth * 0.3);
        const bannerHeight = Math.floor(slotSize / 3);
        
        const halfSlotSize = slotSize / 2;

        const slot1X = Math.floor((subAreaX + subAreaWidth*0.15)-halfSlotSize);
        const slot2X = Math.floor((subAreaX + subAreaWidth/2)-halfSlotSize);
        const slot3X = Math.floor((subAreaX + subAreaWidth*0.85)-halfSlotSize);

        const slotY = Math.floor((subAreaY + subAreaHeight / 2)-halfSlotSize+bannerHeight/2);
        const bannerY = slotY - bannerHeight;

        context.drawImage(bannerImage,0,0,27,9,slot1X,bannerY,slotSize,bannerHeight);
        context.drawImage(bannerImage,0,9,27,9,slot2X,bannerY,slotSize,bannerHeight);
        context.drawImage(bannerImage,0,18,27,9,slot3X,bannerY,slotSize,bannerHeight);

        renderMoveSlot(attackSlot,slot1X,slotY,slotSize,hoverType===hoverTypes.attackSlot);
        renderMoveSlot(defenseSlot,slot2X,slotY,slotSize,hoverType===hoverTypes.defenseSlot);
        renderMoveSlot(specialSlot,slot3X,slotY,slotSize,hoverType===hoverTypes.specialSlot);

        if(selectionModal) {
            context.font = "100 24px Roboto";
            context.fillStyle = ROW_TITLE_COLOR;
            context.textBaseline = "middle";
            context.textAlign = "center";
            context.fillText(selectionModal.title,halfWidth,innerAreaY-24);
            selectionModal.render(timestamp,innerAreaX,innerAreaY,innerAreaWidth,innerAreaHeight);
        }
    }
}
export default MovesPaneRenderer;
