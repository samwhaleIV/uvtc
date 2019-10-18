/*
    key: {
        preloadSongs
        song
        linkTo
    }

    [key] should be a map ID
    [preloadSongs] should be an array or null
    [song] should be null or a song
    [linkTo] should be a map ID
    
    Note 1: linkTo is recursive: the engine will find the root link if there is multiple indirection

    Note 2: Bedrooms do not require song listings. Rooms are inherently programmed to link to their parent houses

    Note 3: Preloading songs is not required, but comes with a trade off.
    It is helpful to eliminate a loading segment or the amount of them,
    such as where we might opt in not to have one. I.e, for an important story moment.
*/

//This string should be... Well. I guess it's kinda obvious. Never mind.
const MUSIC_INTRO_SUFFIX = "_intro";

const MAIN_MENU_SONG = "main-menu";

//Put the root song names here and they are assumed to have their '<name> + <intro suffix>' files in the music folder just as any other song
//This is NOT used for songs that will play anywhere other than the over. Battles, menus, etc. will use something else.
//Be sure not to include the intro suffix string or your files are gonna have to be named like 'song_intro_intro'
const SongsWithIntros = [
	"cabin",
	"tumble_town",
	"tavern",
    "store",
    "elf_march",
    "elf_intro_theme",
    "wimpy",
	"training_room"
];
const BattleMusicLinkingManifest = {
    "tutorial-burr": "training_room",
    "wimpy-red-elf": null,
    "wimpy-green-elf": null
};
const ScriptedSongLinkingManifest = {
    "oops-wrong-song": "hero",
    "party-song": "cabin",
    "lights-off-meet-elves": null
}
const MusicLinkingManifest = {
    "tumble_showdown": {
        song: ScriptedSongLinkingManifest["lights-off-meet-elves"]
    },
    "north_pole_preview": {
        //Chapter 2 start scene
        song: "elf_march"
    },
    "tutorial_place": {
        song: "training_room_short"
    },
    "tavern": {
        song: "tavern"
    },
    "store": {
        song: "store"
    },
    "mail": {
        song: null
    },
    "tumble_woods": {
        song: "tumble_town"
    },
    "house_1": {
        song: "cabin"
    },
    "house_1_end": {
        linkTo: "house_1"
    },
    "house_2": {
        linkTo: "house_1"
    },
    "house_3": {
        linkTo: "house_1"
    },
    "house_4": {
        linkTo: "house_1"
    },
    "house_5": {
        linkTo: "house_1"
    },
    "house_6": {
        linkTo: "house_1"
    },
    "house_7": {
        linkTo: "house_1"
    },
    "house_8": {
        linkTo: "house_1"
    },
    "house_9": {
        linkTo: "house_1"
    },
    "house_10": {
        linkTo: "house_1"
    }
}
const SONG_INTRO_LOOKUP = {};
SongsWithIntros.forEach(song => {
    SONG_INTRO_LOOKUP[song] = song + MUSIC_INTRO_SUFFIX;
});
