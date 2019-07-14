const SHADOW_STRING_DELIMITER = "|";
const OUTPUT_VARIABLE_PREFIX = "const wordSyllableMaps=";

const wordFeed = document.getElementById("word-feed");
const numberInput = document.getElementById("number-input");

var processNextWord = function(){void "Abandon all hope ye who enter here"};
var wordIndex = 0;

var neededWords = [];
const stringLookup = {};
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
    const allWordsLookup = {};
    Object.keys(stringLookup).forEach(fullString => {
        let word = "";
        let lastCharacter = null;
        for(let i = 0;i<fullString.length;i++) {
            const character = fullString[i];
            const nextCharacter = fullString[i+1];

            //This pattern matching is to be identical to that of
            //the method 'applySonographToPopupFeed' found at '/renderers/components/world/popup.js'
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
                        if(!wordSyllableMaps[word]) {
                            allWordsLookup[word] = true;
                        }
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
        if(wordSyllableMaps[word]) {
            return;
        }
        allWordsLookup[word] = true;
    });
    return Object.keys(allWordsLookup);
}

function start() {
    nextWord = function(event) {
        wordIndex++;
        const word = wordFeed.textContent;
        const syllableNumber = event.key === "q" ? word.length : Number(event.key);
        wordSyllableMaps[word] = makeSyllableMap(word.length,syllableNumber);
        wordFeed.textContent = neededWords[wordIndex];
        if(wordIndex >= neededWords.length) {
            document.body.innerHTML = `${OUTPUT_VARIABLE_PREFIX}${JSON.stringify(wordSyllableMaps)};`
        }
        event.preventDefault();
    }
    wordFeed.textContent = neededWords[wordIndex];
}

fetch("string-mdf/shadow-strings.txt").then(response=>response.text()).then(text=>{
    text.split(SHADOW_STRING_DELIMITER).filter(word=>
        word.indexOf("_") < 0 &&
        !word.endsWith(".js") &&
        !word.startsWith("{") &&
        !word.endsWith("}") &&
        !word.startsWith("./") &&
        !word.startsWith("../") &&
        !word.startsWith(".../")
    ).forEach((item,i)=>stringLookup[item]=true);
    neededWords = processRawStrings();
    start();
});
