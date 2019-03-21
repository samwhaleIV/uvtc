const stringLookup = {
    debug: "so... you really think you can dance? it's okay if you don't think you can, i just would be really happy if you could."
}
const wordSyllableMaps = {"so":[true,false],"you":[true,false,false],"really":[true,false,false,true,false,false],"think":[true,false,false,false,false],"can":[true,false,false],"dance":[true,false,false,false,false],"it's":[true,false,false,false],"okay":[true,false,true,false],"if":[true,false],"don't":[true,false,false,false,false],"i":[true],"just":[true,false,false,false],"would":[true,false,false,false,false],"be":[true,false],"happy":[true,false,true,false,true]};
const getString = function(ID) {
    return stringLookup[ID];
}
const getSyllableMap = function(word) {
    return wordSyllableMaps[word];
}
