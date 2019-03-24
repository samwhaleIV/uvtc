const stringLookup = {
    debug: "so... this is it, huh? the fancy text renderer? and you say it has velocity? that's cool, i guess.",
    debug_2: "so... what the hell are you even supposed to be? an alien? an ant? a bad and sad attempt at art? well, good job... i guess.",
    nobody_home: "hmm... it looks like nobody is home right now.",
    bookcase_1: "there's some books in the bookcase... one says 'cards... cards never change.'",
    bookcase_2: "these books seem really inappropriate to have right here in the open.",
    bookcase_3_1: "there's a book called 'the cat lady manifesto'",
    bookcase_3_2: "'if i loved my children as much as my cats, i'd have children.'",
    bookcase_3_3: "what an interesting read...",
    bookcase_4_1: "there's a book called 'generic motivational book'",
    bookcase_4_2: "'success breeds competition, competition breeds success'",
    bed_1: "this RbedR looks like it's quite a bit bigger than you.",
    toilet_1: "it's important to use this sometimes.",
    bathtub_1: "it's important to clean yourself.",
    sink_1: "it's important to clean your hands."
}
const getString = function(ID) {
    return stringLookup[ID];
}
const getSyllableMap = function(word) {
    return wordSyllableMaps[word];
}
