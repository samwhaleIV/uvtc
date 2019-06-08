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

const MusicLinkingManifest = {
    "tavern": {
        song: null
    },
    "store": {
        song: null
    },
    "mail": {
        song: null
    },
    "tumble_woods": {
        song: "tumble_town"
    },
    "house_1": {
        song: "cabinTEST"
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
