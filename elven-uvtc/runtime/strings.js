const stringLookup = {
    debug: "so... this is it, huh? the fancy text renderer? and you say it has velocity? that's cool, i guess."
}
const getString = function(ID) {
    return stringLookup[ID];
}
const getSyllableMap = function(word) {
    return wordSyllableMaps[word];
}
