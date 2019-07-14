const fs = require("fs");

const IMAGE_PATH = "../elven-uvtc/images/";
const IMAGE_MANIFEST_PATH = "../elven-uvtc/image-files.js";
const BACKGROUNDS_FOLDER_START = "backgrounds/";
const PAINT_DOT_NET_FILE_EXTENSION = ".pdn";

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
            results.push(file);
        }
    });
    return results;
}
String.prototype.replaceAll = function(search,replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
function getImageRegular(path) {
    return `getFile("${path}",FileTypes.Image)`;
}
function getImageBackground(path) {
    return `getFile("${path}",FileTypes.BackgroundImage)`;
}
const imageFiles = walk(IMAGE_PATH);
const innerLines = [];
imageFiles.forEach(imageFile=>{
    const path = imageFile.split(IMAGE_PATH)[1].substring(1);
    if(path.endsWith(PAINT_DOT_NET_FILE_EXTENSION)) {
        return;
    }
    if(path.startsWith(BACKGROUNDS_FOLDER_START)) {
        const backgroundName = path.split(BACKGROUNDS_FOLDER_START)[1];
        innerLines.push(getImageBackground(backgroundName));
    } else {
        innerLines.push(getImageRegular(path));
    }
});
const outputFile = [
    '"use strict";',
    "ImagePaths.push(",
    ...innerLines.map((line,idx)=>`    ${line}${idx===innerLines.length-1?"":","}`),
    ");"
];
fs.writeFileSync(IMAGE_MANIFEST_PATH,outputFile.join("\r\n")+"\r\n");
