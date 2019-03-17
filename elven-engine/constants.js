"use strict";
const PI2 = Math.PI * 2;

const maxHorizontalResolution = 1920;
const mediumScaleSnapPoint = 1600;
const smallScaleSnapPoint = 810;

const defaultFullScreenZoom = 1.25;
const mediumFullScreenZoom = 1;
const smallFullScreenZoom = 0.8;

const maximumWidthToHeightRatio = 2.25;
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
