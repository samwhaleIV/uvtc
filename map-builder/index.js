const fs = require("fs");

const INPUT_FOLDER = "./input/";
const OUTPUT_PATH = "../map-data.js";
const OUTPUT_VARIABLE_PREFIX = "const rawMapData=";

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
