import GlobalState from "./global-state.js";
import { AllChapterKeys } from "./chapter-keys-manifest.js";

const ClearAllChapterKeys = () => {
    AllChapterKeys.forEach(key => {
        delete GlobalState.data[key];
    });
}
const DeleteMapAndPlayerData = () => {
    delete GlobalState.data.last_player_pos;
    delete GlobalState.data.last_map;
}
const ClearChapter = () => {
    ClearAllChapterKeys();
    DeleteMapAndPlayerData();
    GlobalState.data.activeChapter = 0;
}

const ChapterManager = new (function(){
    this.setChapter = chapterID => {
        ClearChapter();
        GlobalState.data.activeChapter = chapterID;
        GlobalState.save();
    }
    this.setActiveChapterCompleted = () => {
        let maxCompleteChapter = GlobalState.data.highestChapterFinished;
        let currentChapter = GlobalState.data.activeChapter;
        if(!maxCompleteChapter) {
            if(!currentChapter) {
                maxCompleteChapter = 0;
                currentChapter = 0;
            } else {
                maxCompleteChapter = currentChapter;
            }
        } else if(!currentChapter) {
            currentChapter = 0;
        }
        GlobalState.data.highestChapterFinished = Math.max(maxCompleteChapter,currentChapter);
        ClearChapter();
        GlobalState.save();
    }
})();
export default ChapterManager;
