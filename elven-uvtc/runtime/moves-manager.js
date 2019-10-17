import GlobalState from "./global-state.js";
import { Moves, MovesList } from "./battle/moves.js";
import Chapters from "./chapters.js";
import RenderMove from "../renderers/components/battle/move.js";

MovesList.forEach(move => {
    move.render = (x,y,size,hover,textless) => RenderMove(move,x,y,size,hover,textless);
});

const defaultSlot = "None";

const setSlotsDefault = () => {
    GlobalState.data.moveSlots = {
        attack:  defaultSlot,
        defense: defaultSlot,
        special: defaultSlot
    }
}

if(!GlobalState.data.unlockedMoves) {
    GlobalState.data.unlockedMoves = {};
}
if(!GlobalState.data.moveSlots ||
    GlobalState.data.moveSlots.logic ||
    GlobalState.data.moveSlots.fear || 
    GlobalState.data.moveSlots.malice
) {
    setSlotsDefault();
}

const MovesManager = new (function(){
    this.resetMoveSlots = () => setSlotsDefault();
    this.setSlot = (type,moveName) => {
        GlobalState.data.moveSlots[type] = moveName;
    }
    this.getSlot = type => {
        return Moves[GlobalState.data.moveSlots[type]];
    }
    this.hasSlotType = type => {
        const slot = this.getSlot(type);
        return slot && slot.name !== defaultSlot;
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
        });
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
