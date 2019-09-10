const fs = require("fs");

const ROOT = "../elven-uvtc/";
const MANIFEST_FILE_NAME = "manifest.js";
const SCRIPT_FILE = ROOT + "runtime/scripts.js";
const MAPS_FOLDER = ROOT + "runtime/maps";
const SHADOW_STRINGS_PATH = "./shadow-strings.txt";
const MAP_MANIFEST_PATH = ROOT + "runtime/maps/" + MANIFEST_FILE_NAME;
const OPPONENTS_FOLDER = ROOT + "runtime/battle/opponents";
const OPPONENTS_MANIFEST_PATH = OPPONENTS_FOLDER + "/" + MANIFEST_FILE_NAME;
const SHADOW_STRING_DELIMITER = "|";

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
            if(!file.endsWith(MANIFEST_FILE_NAME)) {
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


//createShadowStringsFile();
createManifest(MAPS_FOLDER,MAP_MANIFEST_PATH);
createManifest(OPPONENTS_FOLDER,OPPONENTS_MANIFEST_PATH);

function createManifest(folderPath,manifestPath) {
    function makeLine(fileName) {
        return `import ".${fileName}";`;
    }
    const lines = [];
    const files = walk(folderPath);
    console.log(files);
    files.forEach(fileName=>{
        if(fileName.startsWith(folderPath)) {
            const name = fileName.split(folderPath)[1];
            lines.push(makeLine(name));
        }
    });
    fs.writeFileSync(manifestPath,lines.join("\r\n")+"\r\n");
}

function createShadowStringsFile() {
    const files = walk(MAPS_FOLDER);
    files.push(SCRIPT_FILE);
    const strings = {};
    const targetStringType = '"';

    for(let i = 0;i<files.length;i++) {

        const fileName = files[i];
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
    const fileText = Object.keys(strings).join(SHADOW_STRING_DELIMITER);
    fs.writeFileSync(SHADOW_STRINGS_PATH,fileText);
}
