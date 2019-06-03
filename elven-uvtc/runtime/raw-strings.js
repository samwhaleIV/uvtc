const syllableMemo = {};
const makeSyllableMap = function(wordLength,syllables) {
    const lookup = `${wordLength},${syllables}`;
    const stored = syllableMemo[lookup];
    if(stored) {
        return stored;
    }
    const map = [];
    const distance = Math.round(wordLength / syllables);
    let i = 0;
    let remainingSyllables = syllables;
    while(i<wordLength){
        const isSyllable = i % distance === 0;
        map.push(remainingSyllables > 0 && isSyllable ? 1 : 0);
        if(isSyllable) remainingSyllables--;
        i++;
    }
    syllableMemo[lookup] = map;
    return map;
}
const processRawStrings = function() {
    let allWords = [];
    let allWordsLookup = {};
    Object.entries(stringLookup).forEach(rawString => {

        const ID = rawString[0];
        const fullString = rawString[1];

        let word = "";
        let lastCharacter = null;
        for(let i = 0;i<fullString.length;i++) {

            //This has to be compatiable (essentially identical) to the method found within applySonographToPopupFeed
            const character = fullString[i];
            const nextCharacter = fullString[i+1];

            switch(character) {
                default:
                    if(character === "'") {
                        if(!popupControlCharacters[lastCharacter] && lastCharacter
                        && !popupControlCharacters[nextCharacter] && nextCharacter
                        ) {
                            word += character;
                        }
                    } else if(!textControlCodes[character]) {
                        word += character;
                    }
                    break;
                case ellipsis:
                case "-":
                case "*":
                case " ":
                case ",":
                case ".":
                case "?":
                case "!":
                case " ":
                    if(word) {
                        word = word.toLowerCase();
                        if(!wordSyllableMaps[word] && !allWordsLookup[word]) {
                            allWords.push(word);
                            console.log(word);
                        }
                        allWordsLookup[word] = true;
                        word = "";
                    }
                    break;
            }

            lastCharacter = character;
        }
        if(!word){
            return;
        }
        word = word.toLowerCase();
        if(!wordSyllableMaps[word] && !allWordsLookup[word]) {
            allWords.push(word);
            console.log(word);
        }
    });
    return allWords;
}
