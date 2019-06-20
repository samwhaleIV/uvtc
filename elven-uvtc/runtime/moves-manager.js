import GlobalState from "./global-state.js";
import { Moves, MovesList } from "./battle/moves.js";
import Chapters from "./chapter-data.js";

const getDefaultSlots = () => {
    return {
        1: Moves.None,
        2: Moves.None,
        3: Moves.None
    };
}

if(!GlobalState.data.unlockedMoves) {
    GlobalState.data.unlockedMoves = {};
}
if(!GlobalState.data.moveSlots) {
    GlobalState.data.moveSlots = {
        logic: getDefaultSlots(),
        fear: getDefaultSlots(),
        malice: getDefaultSlots()
    }
}

const MovesManager = new (function(){
    this.setSlot = (type,slotID,moveName) => {
        GlobalState.data.moveSlots[type][slotID] = moveName;
    }
    this.getSlot = (type,slotID) => {
        return GlobalState.data.moveSlots[type][slotID];
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
