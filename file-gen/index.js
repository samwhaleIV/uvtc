const fs = require("fs");
const opn = require("opn");

const imagePath = "../elven-uvtc/images/";
const imageManifestPath = "../elven-uvtc/image-files.js";

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
const imageFiles = walk(imagePath);
const innerLines = [];
imageFiles.forEach(imageFile=>{
    const path = imageFile.split(imagePath)[1].substring(1);
    if(path.endsWith(".pdn")) {
        return;
    }
    if(path.startsWith("backgrounds/")) {
        const backgroundName = path.split("backgrounds/")[1];
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
fs.writeFileSync(imageManifestPath,outputFile.join("\r\n")+"\r\n");
