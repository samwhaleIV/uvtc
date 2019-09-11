const fs = require("fs");
const path = require("path");

const {execSync} = require('child_process');
const INPUT_FOLDER = "./input/";
const OUTPUT_PATH = "../map-data.js";
const OUTPUT_VARIABLE_PREFIX = "const rawMapData=";
const MAP_DEV_FOLDER = "../map-dev/maps/";
const MAP_DEV_INPUT_FORMAT = ".tmx";
const JSON_FILE_EXTENSION = ".json";
const MAP_DEV_OUTPUT_FORMAT = "JSON";

const devMapFiles = [];
fs.readdirSync(MAP_DEV_FOLDER).forEach(fileName => {
    if(fileName.endsWith(MAP_DEV_INPUT_FORMAT)) {
        const targetName = fileName.split(MAP_DEV_INPUT_FORMAT)[0]
        devMapFiles.push({
            source: path.resolve(MAP_DEV_FOLDER + fileName),
            target: path.resolve(INPUT_FOLDER + targetName + JSON_FILE_EXTENSION)
        });
    }
});
console.log(devMapFiles);
devMapFiles.forEach(mapFile=>{
    console.log(execSync(`"C:\Program Files\Tiled\tiled.exe" --export-map ${MAP_DEV_OUTPUT_FORMAT} ${mapFile.source} ${mapFile.target}`));
});

const MAP_VALUE_OFFSET = -1;
const MAP_COLLISION_OFFSET = -4097;

const allMapData = [];
const compiledMapData = {};
fs.readdirSync(INPUT_FOLDER).forEach(fileName => {
    const file = `${INPUT_FOLDER}${fileName}`;
    const fileResult = fs.readFileSync(file);
    let fileDisplayName = fileName.split(".");
    fileDisplayName.pop();
    fileDisplayName = fileDisplayName.join(".");
    allMapData.push({
        name: fileDisplayName,
        data: JSON.parse(fileResult.toString())
    });
});

function processMapData(rawMap,name) {
    const map = {};

    map.background = rawMap.layers[0].data;
    map.foreground = rawMap.layers[1].data;
    map.collision = rawMap.layers[2].data;

    map.columns = rawMap.width;
    map.rows = rawMap.height;

    for(let i = 0;i<map.background.length;i++) {
        map.background[i] = (map.background[i] || 1) + MAP_VALUE_OFFSET;
        map.foreground[i] = (map.foreground[i] || 1) + MAP_VALUE_OFFSET;
        if(map.collision[i] !== 0) {
            map.collision[i] = map.collision[i] + MAP_COLLISION_OFFSET;
        }
    }

    compiledMapData[name] = map;
}

allMapData.forEach(rawMap => processMapData(rawMap.data,rawMap.name));
fs.writeFileSync(OUTPUT_PATH,`${OUTPUT_VARIABLE_PREFIX}${JSON.stringify(compiledMapData)}`);
