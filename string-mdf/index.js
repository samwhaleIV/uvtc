const fs = require("fs");
const opn = require("opn");

const scriptFile = "../elven-uvtc/runtime/scripts.js";
const inputFolder = "../elven-uvtc/runtime/maps";
const stringsFilePath = "../elven-uvtc/runtime/strings.js";

const AUTO_STRING_PREFIX = "AUTO_";

const walk = function(dir) {
    //https://stackoverflow.com/a/16684530
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + "/" + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}
String.prototype.replaceAll = function(search,replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const filesToReplaceStringsFrom = walk(inputFolder);
filesToReplaceStringsFrom.push(scriptFile);
console.log(walk(inputFolder));

let stringsFileLines = fs.readFileSync(stringsFilePath).toString().split("\r\n");
let highestAutoID = 0;
let whereToInsertIntoStrings = 1;
for(let i = 1;i<stringsFileLines.length;i++) {
    const line = stringsFileLines[i].trim().split(":")[0];
    if(line === "}") {
        whereToInsertIntoStrings = i;
        break;
    }
    if(line.startsWith(AUTO_STRING_PREFIX)) {
        const ID = Number(line.split(AUTO_STRING_PREFIX)[1]);
        if(ID > highestAutoID) {
            highestAutoID = ID;
        }
    }
}

const newStrings = {};

for(let i = 0;i<filesToReplaceStringsFrom.length;i++) {
    const fileName = filesToReplaceStringsFrom[i];
    const startFileText = fs.readFileSync(fileName).toString();
    const fileText = startFileText.replaceAll("\\n","\n").split("");
    let fileTextBuffer = "";

    let lastCharacterWasEscapeSequence = false;
    let stringBuffer = "";
    let inRegularString = false;
    for(let i = 0;i<fileText.length;i++) {
        const character = fileText[i];
        if(stringBuffer !== "") {
            if(character === "'") {
                if(lastCharacterWasEscapeSequence) {
                    stringBuffer += "'";
                } else {
                    stringBuffer += '"';
                    const tokenName = `${AUTO_STRING_PREFIX}${++highestAutoID}`;
                    newStrings[tokenName] = stringBuffer.replaceAll("\n","\\n");
                    fileTextBuffer += `"${tokenName}"`;
                    stringBuffer = "";
                }
            } else {
                if(character !== "\\") {
                    stringBuffer += character;
                }
            }
        } else {
            if(character === "'" && !inRegularString) {
                stringBuffer += '"';
            } else {
                fileTextBuffer += character;
            }
        }
        lastCharacterWasEscapeSequence = character === "\\";
        if(character === '"') {
            inRegularString = !inRegularString;
        }
    }

    if(startFileText !== fileTextBuffer) {
        fs.writeFileSync(fileName,fileTextBuffer);
    }
}

const newStringEntries = Object.entries(newStrings);
let lastLine = stringsFileLines[whereToInsertIntoStrings-1] + ",";
stringsFileLines[whereToInsertIntoStrings-1] = lastLine;
if(newStringEntries.length) {
    for(let i = 0;i<newStringEntries.length;i++) {
        const entry = newStringEntries[i];
        const shouldAddComma = i !== newStringEntries.length - 1;
        stringsFileLines.splice(whereToInsertIntoStrings,0,`    ${entry[0]}: ${entry[1]}${shouldAddComma?",":""}`);
        whereToInsertIntoStrings++;
    }
    fs.writeFileSync(stringsFilePath,stringsFileLines.join("\r\n"));
}

//opn("file:///C:/Users/jedisammy4/Documents/uvtc/string-baker.html");

