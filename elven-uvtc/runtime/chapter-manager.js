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
        GlobalState.data.highestChapterFinished = GlobalState.data.activeChapter;
        ClearChapter();
        GlobalState.save();
    }
})();
export default ChapterManager;
