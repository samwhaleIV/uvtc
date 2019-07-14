import GlobalState from "./global-state.js";
import { Moves, MovesList } from "./battle/moves.js";
import Chapters from "./chapter-data.js";
import RenderMove from "../renderers/components/battle/move.js";

MovesList.forEach(move => {
    move.render = (x,y,size,hover,textless) => RenderMove(move,x,y,size,hover,textless);
});

const getDefaultSlots = () => {
    return {
        1: "None",
        2: "None",
        3: "None"
    };
}

if(!GlobalState.data.unlockedMoves) {
    GlobalState.data.unlockedMoves = {};
}
if(!GlobalState.data.moveSlots || typeof GlobalState.data.moveSlots.logic[1] !== typeof "You have outdated save data") {
    GlobalState.data.moveSlots = {
        logic: getDefaultSlots(),
        fear: getDefaultSlots(),
        malice: getDefaultSlots()
    }
}

const MovesManager = new (function(){
    this.resetMoveSlots = () => {
        GlobalState.data.moveSlots.logic = getDefaultSlots();
        GlobalState.data.moveSlots.fear = getDefaultSlots();
        GlobalState.data.moveSlots.malice = getDefaultSlots();
    }
    this.setSlot = (type,slotID,moveName) => {
        GlobalState.data.moveSlots[type][slotID] = moveName;
    }
    this.getSlot = (type,slotID) => {
        return Moves[GlobalState.data.moveSlots[type][slotID]];
    }
    this.getSlots = type => {
        return [
            this.getSlot(type,1),
            this.getSlot(type,2),
            this.getSlot(type,3)
        ];
    }
    this.hasSlotType = type => {
        const slots = this.getSlots(type);
        return slots[0].name !== "None" || slots[1].name !== "None" || slots[2].name !== "None";
    }
    this.lockMove = moveName => {
        delete GlobalState.data.unlockedMoves[moveName];
    }
    this.unlockMove = moveName => {
        GlobalState.data.unlockedMoves[moveName] = true;
    }
    this.hasMove = moveName => {
        return GlobalState.data.unlockedMoves[moveName] ? true : false;
    }
    this.getUnlockedMoves = () => {
        const softCopy = {};
        Object.entries(GlobalState.data.unlockedMoves).forEach(entry => {
            softCopy[entry[0]] = entry[1];
        })
        return softCopy;
    }
    this.chapterMovesUnlocked = chapterID => {
        const chapter = Chapters[chapterID-1];
        if(!chapter) {
            throw Error(`Invalid chapter ID '${chapterID}'`);
        }
        const unlockableMoves = chapter.unlockableMoves;
        if(!unlockableMoves) {
            return 0;
        } else {
            let unlockedCount = 0;
            unlockableMoves.forEach(moveName => {
                if(GlobalState.data.unlockedMoves[moveName]) {
                    unlockedCount += 1;
                }
            });
            return unlockedCount;
        }
    }
    this.chapterMoveCount = chapterID => {
        const chapter = Chapters[chapterID-1];
        if(!chapter) {
            throw Error(`Invalid chapter ID '${chapterID}'`);
        }
        const unlockableMoves = chapter.unlockableMoves;
        if(!unlockableMoves) {
            return 0;
        } else {
            return unlockableMoves.length;
        }
    }
})();
export default MovesManager;
