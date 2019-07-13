const fs = require("fs");
const opn = require("opn");

const scriptFile = "../elven-uvtc/runtime/scripts.js";
const inputFolder = "../elven-uvtc/runtime/maps";
const stringsFilePath = "../elven-uvtc/runtime/strings.js";
const shadowStringsPath = "./shadow-strings.txt";
const mapManifestPath = "../elven-uvtc/runtime/maps/manifest.js";
const opponentsFolder = "../elven-uvtc/runtime/battle/opponents";

const walk = function(dir) {
    //https://stackoverflow.com/a/16684530
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + "/" + file;
        const stat = fs.statSync(file);
        if(stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else {
            if(!file.endsWith("manifest.js")) {
                results.push(file);
            }
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

function createMapManifest() {
    function makeLine(fileName) {
        return `import ".${fileName}";`;
    }
    const lines = [];
    console.log(filesToReplaceStringsFrom);
    filesToReplaceStringsFrom.forEach(fileName=>{
        if(fileName.startsWith(inputFolder)) {
            const name = fileName.split(inputFolder)[1];
            lines.push(makeLine(name));
        }
    });
    fs.writeFileSync(mapManifestPath,lines.join("\r\n")+"\r\n");
}
function createOpponentManifest() {
    function makeLine(fileName) {
        return `import ".${fileName}";`;
    }
    const lines = [];
    const files = walk(opponentsFolder);
    console.log(files);
    files.forEach(fileName=>{
        if(fileName.startsWith(opponentsFolder)) {
            const name = fileName.split(opponentsFolder)[1];
            lines.push(makeLine(name));
        }
    });
    fs.writeFileSync(opponentsFolder + "/manifest.js",lines.join("\r\n")+"\r\n");
}

function createShadowStringsFile() {
    const strings = {};

    const targetStringType = '"';

    for(let i = 0;i<filesToReplaceStringsFrom.length;i++) {

        const fileName = filesToReplaceStringsFrom[i];
        const startFileText = fs.readFileSync(fileName).toString();
        const fileText = startFileText.split("");
    
        let inSequence = false;
        let stringBuffer = "";

        for(let i = 0;i<fileText.length;i++) {
            const character = fileText[i];
            if(character === targetStringType) {
                if(inSequence) {
                    strings[stringBuffer] = true;
                    stringBuffer = "";
                    inSequence = false;
                } else {
                    inSequence = true;
                }
            } else if(inSequence) {
                stringBuffer += character;
            }
        }
        if(stringBuffer) {
            strings[stringBuffer] = true;
            stringBuffer = ""; 
        }
    }

    fs.writeFileSync(shadowStringsPath,Object.keys(strings).join("|"));
}

createShadowStringsFile();
createMapManifest();
createOpponentManifest();
//opn("file:///C:/Users/jedisammy4/Documents/uvtc/string-baker.html");
