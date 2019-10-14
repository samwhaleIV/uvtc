const fs = require("fs");
const path = require("path");
const xmlParser = require("fast-xml-parser");
const he = require("he");

const {execSync} = require('child_process');
const INPUT_FOLDER = "./input/";
const OUTPUT_PATH = "../map-data.js";
const OUTPUT_VARIABLE_PREFIX = "const rawMapData=";
const MAP_DEV_FOLDER = "../map-dev/maps/";
const MAP_DEV_INPUT_FORMAT = ".tmx";
const JSON_FILE_EXTENSION = ".json";
const MAP_DEV_OUTPUT_FORMAT = "JSON";
const TILED_PATH = `"C:\\Program Files\\Tiled\\tiled.exe"`;
const TILED_COMPILE = false;
const XML_PARSE_OPTIONS = {
    attributeNamePrefix : "",
    attrNodeName: "attr",
    textNodeName: "value",
    ignoreAttributes: false,
    ignoreNameSpace: true,
    allowBooleanAttributes: false,
    parseNodeValue: false,
    parseAttributeValue: true,
    trimValues: true,
    parseTrueNumberOnly: false,
    attrValueProcessor: val => he.decode(val,{isAttributeValue: true}),
    tagValueProcessor : val => he.decode(val),
    stopNodes: []
}

const MAP_VALUE_OFFSET = -1;
const MAP_COLLISION_OFFSET = -4097;
const MAP_LIGHTING_OFFSET = -4121;

const devMapFiles = [];
const shortDevMapFileList = [];
fs.readdirSync(MAP_DEV_FOLDER).forEach(fileName => {
    if(fileName.endsWith(MAP_DEV_INPUT_FORMAT)) {
        shortDevMapFileList.push(fileName);
        const targetName = fileName.split(MAP_DEV_INPUT_FORMAT)[0]
        devMapFiles.push({
            source: path.resolve(MAP_DEV_FOLDER + fileName),
            target: path.resolve(INPUT_FOLDER + targetName + JSON_FILE_EXTENSION),
            targetName: targetName
        });
    }
});
function process_csv_xml_data(layer) {
    return {
        data: layer.data.value.split(",").map(Number)
    };
}
function route_map_file_through_tiled(mapFile) {
    const command = `${TILED_PATH} --export-map ${MAP_DEV_OUTPUT_FORMAT} "${mapFile.source}" "${mapFile.target}"`;
    console.log("Compiling first pass: " + mapFile.targetName);
    let result = execSync(command);
    result = result.toString().trim();
    if(result) {
        console.log(result);
    }
}
const allMapData = [];
function self_compile_map_file(mapFile) {

    const xmlData = fs.readFileSync(mapFile.source).toString();
    const jsonData = xmlParser.parse(xmlData,XML_PARSE_OPTIONS);

    const rawMap = {};
    const map = jsonData.map;
    const backgroundLayer = map.layer[0];
    const foregroundLayer = map.layer[1];
    const collisionLayer = map.layer[2];
    let lightingLayer = null;
    if(map.layer[3]) {
        lightingLayer = map.layer[3]
    }

    rawMap.width = backgroundLayer.attr.width;
    rawMap.height = backgroundLayer.attr.height;

    rawMap.layers = [
        process_csv_xml_data(backgroundLayer),
        process_csv_xml_data(foregroundLayer),
        process_csv_xml_data(collisionLayer)
    ];
    if(lightingLayer !== null) {
        rawMap.layers.push(
            process_csv_xml_data(lightingLayer)
        );
    }
    allMapData.push({
        name: mapFile.targetName,
        data: rawMap
    });
    console.log("Fast compiled: " + mapFile.source);
    
}
function parse_tiled_output_folder() {
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
}
if(TILED_COMPILE) {
    devMapFiles.forEach(route_map_file_through_tiled);
    parse_tiled_output_folder();
} else {
    devMapFiles.forEach(self_compile_map_file);
}

const compiledMapData = {};
function processMapData(rawMap,name) {
    console.log("Compiling second pass: " + name)
    const map = {};

    map.background = rawMap.layers[0].data;
    map.foreground = rawMap.layers[1].data;
    map.collision = rawMap.layers[2].data;
    if(rawMap.layers[3]) {
        map.lighting = rawMap.layers[3].data;
    }

    map.columns = rawMap.width;
    map.rows = rawMap.height;

    for(let i = 0;i<map.background.length;i++) {
        map.background[i] = (map.background[i] || 1) + MAP_VALUE_OFFSET;
        map.foreground[i] = (map.foreground[i] || 1) + MAP_VALUE_OFFSET;
        if(map.collision[i] !== 0) {
            map.collision[i] = map.collision[i] + MAP_COLLISION_OFFSET;
        }
        if(map.lighting) {
            if(map.lighting[i] !== 0) {
                map.lighting[i] = map.lighting[i] + MAP_LIGHTING_OFFSET;
            }
        }
    }

    compiledMapData[name] = map;
}
allMapData.forEach(rawMap => processMapData(rawMap.data,rawMap.name));
console.log("Exporting compiled map data...")
fs.writeFileSync(OUTPUT_PATH,`${OUTPUT_VARIABLE_PREFIX}${JSON.stringify(compiledMapData)}`);
console.log("Done.");
