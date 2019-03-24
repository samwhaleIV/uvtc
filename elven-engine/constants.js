"use strict";
const PI2 = Math.PI * 2;
const ellipsis = "…";

const maxHorizontalResolution = 1920;
const mediumScaleSnapPoint = 1600;
const smallScaleSnapPoint = 810;

const defaultFullScreenZoom = 1.25;
const mediumFullScreenZoom = 1;
const smallFullScreenZoom = 0.8;

const maximumWidthToHeightRatio = 2;
const maximumHeightToWidthRatio = 1.25;

const highResolutionAdaptiveTextScale = 3;
const highResolutionAdaptiveTextSpacing = 4;

const mediumResolutionAdaptiveTextScale = 3;
const mediumResolutionAdaptiveTextSpacing = 4;

const lowResolutionAdaptiveTextScale = 2;
const lowResolutionAdpativeTextSpacing = 1;

let leftBumperCode = {code:"LeftBumper"};
let rightBumperCode = {code:"RightBumper"};
let aButtonCode = {code:"Space"};
let yButtonCode = {code:"F10"};
let bButtonCode = {code:"Escape"};
let upButtonCode = {code:"KeyW"};
let downButtonCode = {code:"KeyS"};
let leftButtonCode = {code:"KeyA"};
let rightButtonCode = {code:"KeyD"};
let startButtonCode = {code:"Enter"};

const textControlCodes = {
    "\n": /\n/g,
    "R": /R/g,
    "G": /G/g,
    "B": /B/g,
    "Y": /Y/g,
    "P": /P/g,
    "O": /P/g,
    "X": /X/g
}
const textColorLookup = {
    "R": "red",
    "G": "green",
    "B": "blue",
    "Y": "yellow",
    "P": "purple",
    "O": "orange",
    "X:": 0
}
const popupControlCharacters = {
    "-": true,
    " ": true,
    ",": true,
    ".": true,
    "?": true,
    "!": true,
    " ": true
}
popupControlCharacters[ellipsis] = true;
