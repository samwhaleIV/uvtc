const stringLookup = {
    bookcase_1: "there's a lot of books on this shelf.",
    bed_1: "a sleeping bag on a hardwood floor, a fine luxury.",
    bookcase_2: "lots of books here... a lot of them seem to mention some kind of card game?",
    bookcase_3: "this bookcase demonstrates that it's okay to be small.\nway to go bookcase!",
    table_1: "these plastic, foldable tables have seen a lot of life.\nare they for parties?",
    table_2: "these tables are pretty much everywhere.",
    counter_1: "this must be a kitchen... seems to be missing a few things, though.",
    counter_2: "this is the cleanest kitchen you've seen in your entire life.",
    sink_1: "it's important to wash your hands!",
    toilet_1: "it's important to use toilets!",
    bathtub_1: "it's important to wash...\nyourself.",
    bookcase_4: "this bookcase doesn't have very many books on it.",
    bookcase_5_1: "this bookcase has a few intersting books on it.",
    bookcase_5_2: "one book is called 'the cat lady manifesto'",
    bookcase_5_3: "Rif i loved my children as much as i love my cats, i'd have children.R",
    bookcase_6_1: "this bookcase is trying to be an edgy reflection of society.",
    bookcase_6_2: "is it working?",
    bookcase_7_1: "this bookcase seems to be more inappropriate than the other bookcases.",
    bookcase_7_2: "hey... what're you wearing?",
    couch_1: "this couch looks too clean to sit on.\nwho gets a white couch anyways?",
    tv_1: "i'm the tv!\nit's so nice to meet you!\nwatch me anytime.",
    jims_journey: "that was quite the journey...\nyou may use the door, now.",
    jims_kink: "if you whisper something in my right ear, i'll get out of your way.",
    jims_intrigue: "oh. my. i'll be getting out of your way now.",
    jims_postop: "let's stay in touch\n*wink*"
}
const getString = function(ID) {
    return stringLookup[ID];
}
const getSyllableMap = function(word) {
    return wordSyllableMaps[word];
}
