import GlobalState from "./global-state.js";
import ChapterKeysManifest from "./chapter-keys-manifest.js";
const allKeys = [];
Object.values(ChapterKeysManifest).forEach(keySet => {
    keySet.forEach(key => {
        allKeys.push(key);
    });
});
const ClearAllChapters = () => {
    allKeys.forEach(key => {
        delete GlobalState.data[key];
    });
    deleteMapAndPlayerData();
}
const deleteMapAndPlayerData = () => {
    delete GlobalState.data.last_player_pos;
    delete GlobalState.data.last_map;
}
const ChapterManager = new (function(){
    this.clearActiveChapter = () => {
        const chapterKeys = ChapterKeysManifest[
            GlobalState.data.activeChapter
        ];
        chapterKeys.forEach(key => {
            delete GlobalState.data[key];
        });
        deleteMapAndPlayerData();
        GlobalState.data.activeChapter = 0;
    }
    this.setChapter = chapterID => {
        if(GlobalState.data.activeChapter) {
            this.clearActiveChapter();
        } else {
            ClearAllChapters();
        }
        GlobalState.data.activeChapter = chapterID;
        GlobalState.save();
    }
    this.setActiveChapterCompleted = () => {
        GlobalState.data.highestChapterFinished = GlobalState.data.activeChapter;
        this.clearActiveChapter();
        GlobalState.save();
    }
})();
export default ChapterManager;
