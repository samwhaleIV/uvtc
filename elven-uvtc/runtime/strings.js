const stringLookup = {
    debug: "so... this is it, huh? the fancy text renderer? and you say it has velocity? that's cool, i guess.",
    debug_2: "so... what the hell are you even supposed to be? an alien? an ant? a bad and sad attempt at art? well, good job... i guess.",
    nobody_home: "hmm... it looks like nobody is home right now."
}
const getString = function(ID) {
    return stringLookup[ID];
}
const getSyllableMap = function(word) {
    return wordSyllableMaps[word];
}
