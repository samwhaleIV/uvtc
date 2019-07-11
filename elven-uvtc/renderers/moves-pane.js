import RotatingBackground from "./components/rotating-background.js";
import MovesManager from "../runtime/moves-manager.js";
import Moves from "../runtime/battle/moves.js";
import MoveSelectRenderer from "./move-select.js";

const ROW_TITLE_COLOR = "#2C2C2C";

const COLUMN_SHADOW_AMOUNT = 2.5;

const COLUMN_COLOR = "#F2F2F2";
const COLUMN_SHADOW_COLOR = "rgba(0,0,0,0.15)";

const SLOT_AREA_RATIO_WIDTH = 12 / 10;
const SLOT_AREA_RATIO_HEIGHT = 10 / 12;
const COLUMN_WIDTH_FACTOR = 0.22;

const LOGIC_TEXT = "Logic";
const MALICE_TEXT = "Malice";
const FEAR_TEXT = "Fear";

function MovesPaneRenderer(callback) {
    if(!callback) {
        throw Error("Move pane renderer is missing a callback method");
    } else if(typeof callback !== "function") {
        throw Error("Callback must be a function");
    }

    const moveLookupOrder = ["logic","malice","fear"];

    let selectionModal = null;

    const slots = [[],[],[]];
    for(let x = 0;x<3;x++) {
        for(let y = 0;y<3;y++) {
            const slot = getPlaceholderLocation();
            const type = moveLookupOrder[x];
            const slotID = y + 1;
            slot.value = MovesManager.getSlot(type,slotID) || Moves.None;
            slot.type = type;
            slot.ID = slotID;
            (function(type,slotID){
                slot.updateMove = newMove => {
                    MovesManager.setSlot(type,slotID,newMove);
                    slot.value = MovesManager.getSlot(type,slotID);
                }
            })(type,slotID);
            slots[x][y] = slot;
        }
    }

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
        l1: 2,
        l2: 3,
        l3: 4,
        m1: 5,
        m2: 6,
        m3: 7,
        f1: 8,
        f2: 9,
        f3: 10
    };
    const slotLookup = {};
    slotLookup[hoverTypes.l1] = slots[0][0];
    slotLookup[hoverTypes.l2] = slots[0][1];
    slotLookup[hoverTypes.l3] = slots[0][2];

    slotLookup[hoverTypes.m1] = slots[1][0];
    slotLookup[hoverTypes.m2] = slots[1][1];
    slotLookup[hoverTypes.m3] = slots[1][2];

    slotLookup[hoverTypes.f1] = slots[2][0];
    slotLookup[hoverTypes.f2] = slots[2][1];
    slotLookup[hoverTypes.f3] = slots[2][2];

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
                const slot = slotLookup[hoverType];
                const moveOptions = Object.keys(MovesManager.getUnlockedMoves()).sort().map(
                    moveName=>Moves[moveName]
                ).filter(move=>{
                    return move && move.type === slot.type;
                });
                moveOptions.unshift(Moves.None);
                playSound("click");
                selectionModal = new MoveSelectRenderer(moveOptions,newMove=>{
                    exit();
                    slot.updateMove(newMove)
                });
                selectionModal.title = `Select a ${slot.type} move...`;
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

        for(let slotY = 0;slotY<3;slotY++) {
            for(let slotX = 0;slotX<3;slotX++) {
                const slot = slots[slotX][slotY];
                if(contains(x,y,slot)) {
                    const categoryCharacter = "lmf"[slotX];
                    const targetString = `${categoryCharacter}${slotY+1}`;
                    hoverType = hoverTypes[targetString];
                    return;
                }
            }
        }

        hoverType = hoverTypes.none;
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

    const renderColumn = (x,y,width,height) => {
        context.fillStyle = COLUMN_COLOR;
        context.fillRect(x,y,width,height);
    }
    const renderMoveSlot = (target,x,y,size,withHover) => {
        target.value.render(x,y,size,withHover,false);
        target.x = x;
        target.y = y;
        target.width = size;
        target.height = size;
    }

    const background = new RotatingBackground("spiral-move-select");
    background.rotationTime = 2 * 60 * 1000;
    background.clockwise = true;

    this.render = timestamp => {

        background.render(timestamp);
        exitButton = renderExitButton(0,0,hoverType===hoverTypes.exitButton,false,cancelDown);

        let innerAreaX = 50;
        let innerAreaY = exitButton.y + exitButton.height + 10;
        let innerAreaWidth = fullWidth - 100;
        let innerAreaHeight = fullHeight - innerAreaY - 10;

        let slotsAreaWidth;
        let slotsAreaHeight;
        let slotsAreaX;
        let slotsAreaY;
        if(innerAreaWidth * SLOT_AREA_RATIO_HEIGHT > innerAreaHeight) {
            slotsAreaHeight = innerAreaHeight;
            slotsAreaWidth = innerAreaHeight * SLOT_AREA_RATIO_WIDTH;
        } else {
            slotsAreaWidth = innerAreaWidth;
            slotsAreaHeight = slotsAreaWidth * SLOT_AREA_RATIO_HEIGHT;
        }
        slotsAreaX = Math.round(innerAreaX + innerAreaWidth / 2 - slotsAreaWidth / 2);
        slotsAreaY = Math.round(innerAreaY + innerAreaHeight / 2 - slotsAreaHeight / 2);
        slotsAreaWidth = Math.round(slotsAreaWidth);
        slotsAreaHeight = Math.round(slotsAreaHeight);

        let columnWidth = slotsAreaWidth * COLUMN_WIDTH_FACTOR;
        let columnHeight = slotsAreaHeight - 100;
        let columnY = slotsAreaY + 70;
        const textY = slotsAreaY + 35;

        const leftX = Math.round(slotsAreaX);
        const centerX = Math.round(slotsAreaX+slotsAreaWidth/2-columnWidth/2);
        const rightX = Math.round(slotsAreaX+slotsAreaWidth-columnWidth);

        const textXOffset = columnWidth / 2;

        columnWidth = Math.round(columnWidth);

        context.font = "100 28px Roboto";
        context.fillStyle = ROW_TITLE_COLOR;
        context.textBaseline = "middle";
        context.textAlign = "center";

        context.fillText(LOGIC_TEXT,leftX+textXOffset,textY);
        context.fillText(MALICE_TEXT,centerX+textXOffset,textY);
        context.fillText(FEAR_TEXT,rightX+textXOffset,textY);

        context.shadowColor = COLUMN_SHADOW_COLOR;
        context.shadowBlur = COLUMN_SHADOW_AMOUNT;
        renderColumn(leftX,columnY,columnWidth,columnHeight,0);
        renderColumn(centerX,columnY,columnWidth,columnHeight,1);
        renderColumn(rightX,columnY,columnWidth,columnHeight,2);
        context.shadowBlur = 0;

        const moveSize = columnWidth - 20;
        const row1Y = columnY + 10;
        const row2Y = Math.round(columnY + columnHeight / 2 - moveSize / 2);
        const row3Y = columnY + columnHeight - 10 - moveSize;
        const columnXOffset = 10;

        const column1X = leftX+columnXOffset;
        const column2X = centerX+columnXOffset;
        const column3X = rightX+columnXOffset;

        const row1 = slots[0];
        renderMoveSlot(row1[0],column1X,row1Y,moveSize,hoverType===hoverTypes.l1);
        renderMoveSlot(row1[1],column1X,row2Y,moveSize,hoverType===hoverTypes.l2);
        renderMoveSlot(row1[2],column1X,row3Y,moveSize,hoverType===hoverTypes.l3);

        const row2 = slots[1];
        renderMoveSlot(row2[0],column2X,row1Y,moveSize,hoverType===hoverTypes.m1);
        renderMoveSlot(row2[1],column2X,row2Y,moveSize,hoverType===hoverTypes.m2);
        renderMoveSlot(row2[2],column2X,row3Y,moveSize,hoverType===hoverTypes.m3);

        const row3 = slots[2];
        renderMoveSlot(row3[0],column3X,row1Y,moveSize,hoverType===hoverTypes.f1);
        renderMoveSlot(row3[1],column3X,row2Y,moveSize,hoverType===hoverTypes.f2);
        renderMoveSlot(row3[2],column3X,row3Y,moveSize,hoverType===hoverTypes.f3);

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
