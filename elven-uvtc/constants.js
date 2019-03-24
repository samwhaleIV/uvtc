"use strict";
leftBumperCode = {code:"LeftBumper"};
rightBumperCode = {code:"RightBumper"};
aButtonCode = {code:"Enter"};
yButtonCode = {code:"KeyP"};
bButtonCode = {code:"KeyZ"};
upButtonCode = {code:"KeyW"};
downButtonCode = {code:"KeyS"};
leftButtonCode = {code:"KeyA"};
rightButtonCode = {code:"KeyD"};
startButtonCode = {code:"Enter"};

const hoverPadding = 2.5;
const doubleHoverPadding = hoverPadding + hoverPadding; 
const flatHoverPadding = Math.floor(hoverPadding);
const flatDoubleHoverPadding = flatHoverPadding + flatHoverPadding;

const ACoolBlueColor = "#008DFF";

const WorldTextureSize = 16;
const WorldTextureScale = 3;
const WorldTileSize = WorldTextureSize * WorldTextureScale;
const WorldTextureColumns = 64;
const footPrintTiles = {
    21: true
}
