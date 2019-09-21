import Chapter1State from "./chapters/chapter-1.js";
import Chapter2State from "./chapters/chapter-2.js";
import Chapter3State from "./chapters/chapter-3.js";
import Chapter4State from "./chapters/chapter-4.js";
import Chapter5State from "./chapters/chapter-5.js";
import Chapter6State from "./chapters/chapter-6.js";
import Chapter7State from "./chapters/chapter-7.js";
import Chapter8State from "./chapters/chapter-8.js";
import Chapter9State from "./chapters/chapter-9.js";
import Chapter10State from "./chapters/chapter-10.js";
import Chapter11State from "./chapters/chapter-11.js";
import Chapter12State from "./chapters/chapter-12.js";

const Chapters = [
    {
        title: "Culture Shock",
        unlockableMoves: [
            "Iced Whiskey",
            "Wimpy Punch",
            "Red Apple",
            "Return to Sender"
        ],
        startMap: "bedroom_1",
        chapterState: Chapter1State
    },
    {
        title: "Christmas Is Cancelled",
        unlockableMoves: [
            "Jingle Bells",
            "Submission"
        ],
        startMap: "north_pole_preview",
        chapterState: Chapter2State
    },
    {
        title: "New World",
        unlockableMoves: [
        ],
        startMap: "bedroom_1_oop",
        chapterState: Chapter3State
    },
    {
        title: "Goldilocks",
        unlockableMoves: [
            "Midus Touch",
            "Porridge"
        ],
        chapterState: Chapter4State
    },
    {
        title: "With A Little Help From My Friends",
        unlockableMoves: [
            "Friendship",
            "Vitamins"
        ],
        chapterState: Chapter5State
    },
    {
        title: "Them Bones",
        chapterState: Chapter6State
    },
    
    {
        title: "Poe's Law",
        chapterState: Chapter7State
    },
    {
        title: "Polar Express",
        chapterState: Chapter8State
    },
    {
        title: "One Night In Elfmart",
        chapterState: Chapter9State
    },
    {
        title: "Cloud City",
        chapterState: Chapter10State
    },
    {
        title: "Murder, Kill, Maim",
        chapterState: Chapter11State
    },
    {
        title: "The Most Wonderful Time Of The Year",
        chapterState: Chapter12State
    }
];
export default Chapters;
