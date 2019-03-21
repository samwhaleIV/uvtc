const makeSyllableMap = function(wordLength,syllables) {
    const map = [];
    const distance = Math.floor(wordLength / syllables);
    let i = 0;
    while(i<wordLength){
        map.push(i % distance === 0);
        i++;
    }
    return map;
}
const processRawStrings = function() {
    let allWords = [];
    let allWordsLookup = {};
    Object.entries(stringLookup).forEach(rawString => {

        const ID = rawString[0];
        const fullString = rawString[1];

        let word = "";
        for(let i = 0;i<fullString.length;i++) {
            const character = fullString[i];
            switch(character) {
                default:
                    word += character;
                    break;
                case ellipsis:
                case "-":
                case " ":
                case ",":
                case ".":
                case "?":
                case "!":
                case " ":
                    if(word) {
                        if(!wordSyllableMaps[word] && !allWordsLookup[word]) {
                            allWords.push(word);
                        }
                        allWordsLookup[word] = true;
                        word = "";
                    }
                    break;
            }
        }
        if(word && !wordSyllableMaps[word] && !allWordsLookup[word]) {
            allWords.push(word);
        }
    });
    return allWords;
}
