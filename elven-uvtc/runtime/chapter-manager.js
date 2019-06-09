import GlobalState from "./global-state.js";
import ChapterKeysManifest from "./chapter-keys-manifest.js";
const ChapterManager = new (function(){
    this.clearActiveChapter = () => {
        const chapterKeys = ChapterKeysManifest[
            GlobalState.data.activeChapter
        ];
        chapterKeys.forEach(key => {
            delete GlobalState.data[key];
        });
        delete GlobalState.data.last_player_pos;
        delete GlobalState.data.last_map;
        GlobalState.data.activeChapter = 0;
    }
    this.setChapter = chapterID => {
        if(GlobalState.data.activeChapter) {
            this.clearActiveChapter();
        }
        GlobalState.data.activeChapter = chapterID;
        GlobalState.save();
    }
    this.setActiveChapterCompleted = () => {
        this.clearActiveChapter();
        GlobalState.data.highestChapterFinished = GlobalState.data.activeChapter;
        GlobalState.save();
    }
})();
export default ChapterManager;
