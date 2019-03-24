const fs = require("fs");

const inputFolder = "./input/";
const outputPath = "../map-data.js";

const WorldMapValueOffset = -1;
const CollisionMapValueOffset = -4097;


const allMapData = [];
const compiledMapData = {};
fs.readdirSync(inputFolder).forEach(fileName => {
    const file = `${inputFolder}${fileName}`;
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
        map.background[i] = (map.background[i] || 1) + WorldMapValueOffset;
        map.foreground[i] = (map.foreground[i] || 1) + WorldMapValueOffset;
        if(map.collision[i] !== 0) {
            map.collision[i] = map.collision[i] + CollisionMapValueOffset;
        }
    }

    compiledMapData[name] = map;
}

allMapData.forEach(rawMap => processMapData(rawMap.data,rawMap.name));
fs.writeFileSync(outputPath,`const rawMapData = ${JSON.stringify(compiledMapData)}`);
