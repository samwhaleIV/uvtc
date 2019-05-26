"use strict";
const canvas = document.getElementById("canvas");

let fullWidth;
let fullHeight;
let halfWidth;
let halfHeight;
let doubleWidth;
let doubleHeight;
let verticalSizeRatio;
let horizontalSizeRatio;
let largestDimension;
let halfLargestDimension;

let adaptiveTextScale;
let adaptiveTextSpacing;

let rainbowGradient;

function setSizeConstants() {
    fullWidth = canvas.width;
    fullHeight = canvas.height;
    halfWidth = fullWidth / 2;
    halfHeight = fullHeight / 2;
    doubleWidth = fullWidth * 2;
    doubleHeight = fullHeight * 2;
    horizontalSizeRatio = fullWidth / internalWidth;
    verticalSizeRatio = fullHeight / internalHeight;
    largestDimension = fullWidth > fullHeight ? fullWidth : fullHeight;
    halfLargestDimension = largestDimension / 2;
}

function createRainbowGradient() {
    const gradient = context.createLinearGradient(fullWidth*0.3,0,fullWidth*0.7,0);
    gradient.addColorStop(0,"red");
    gradient.addColorStop(1/6,"orange");
    gradient.addColorStop(2/6,"yellow");
    gradient.addColorStop(3/6,"green");
    gradient.addColorStop(4/6,"blue");
    gradient.addColorStop(5/6,"indigo");
    gradient.addColorStop(1,"violet");
    return gradient;
}

const internalWidth = 800;
const internalHeight = 600;

const heightByWidth = internalHeight / internalWidth;
let widthByHeight = internalWidth / internalHeight;

const backgroundCanvas = document.getElementById("background-canvas");
const context = canvas.getContext("2d");
const backgroundContext = backgroundCanvas.getContext("2d");

let electron = null;
let electronWindow = null;
if(typeof(require) !== "undefined") {
    electron = require("electron");
    electronWindow = electron.remote.getCurrentWindow();
}
//steamSetup();

let lastRelativeX = -1;
let lastRelativeY = -1;
const keyEventModes = {
    downOnly: Symbol("downOnly"),
    none: Symbol("none"),
    upAndDown: Symbol("upAndDown")
}
const pointerEventModes = {
    upOnly: Symbol("upOnly"),
    none: Symbol("none"),
    upAndDown: Symbol("upAndDown")
}
const keyEventTypes = {
    keyDown: Symbol("keyDown"),
    keyUp: Symbol("keyUp"),
}
const pointerEventTypes = {
    pointerUp: Symbol("pointerUp"),
    pointerDown: Symbol("pointerDown")
}
let pointerEventMode = keyEventModes.none;
let keyEventMode = pointerEventModes.none;

const pictureModeElement = document.getElementById("picture-mode-element");

const sizeModes = {
    fit: {
        name: "fit",
        displayName: "box fill"
    },
    stretch: {
        name: "stretch",
        displayName: "fill"
    },
    center: {
        name: "center",
        displayName: "box 1:1"
    }
}

const defaultSizeMode = sizeModes.stretch.name;
let canvasSizeMode = localStorage.getItem("canvasSizeMode") || defaultSizeMode;
let pictureModeElementTimeout = null;

let rendererState = null;
let animationFrame = null;
let paused = false;

function getRelativeEventLocation(event) {
    return {
        x: Math.floor(
            event.layerX / canvas.clientWidth * canvas.width
        ),
        y: Math.floor(
            event.layerY / canvas.clientHeight * canvas.height
        )
    }
}
function touchEnabled(event) {
    return !paused && event.isPrimary && rendererState;
}
function setPageTitle(title) {
    document.title = title;
}
function routeKeyEvent(keyCode,type) {
    switch(keyEventMode) {
        case keyEventModes.none:
            break;
        case keyEventModes.downOnly:
            if(type === keyEventTypes.keyDown) {
                rendererState.processKey(keyCode);
            }
            break;
        case keyEventModes.upAndDown:
            switch(type) {
                case keyEventTypes.keyDown:
                    rendererState.processKey(keyCode);
                    break;
                case keyEventTypes.keyUp:
                    rendererState.processKeyUp(keyCode);
                    break;
            }
            break;
    }
}
function routePointerEvent(event,type) {
    const relativeEventLocation = getRelativeEventLocation(
        event
    );
    lastRelativeX = relativeEventLocation.x;
    lastRelativeY = relativeEventLocation.y;
    switch(pointerEventMode) {
        case pointerEventModes.none:
            break;
        case pointerEventModes.upOnly:
            if(type === pointerEventTypes.pointerUp) {
                rendererState.processClick(
                    relativeEventLocation.x,
                    relativeEventLocation.y
                );
            }
            break;
        case pointerEventModes.upAndDown:
            switch(type) {
                case pointerEventTypes.pointerUp:
                    rendererState.processClickEnd(
                        relativeEventLocation.x,
                        relativeEventLocation.y
                    );
                    break;
                case pointerEventTypes.pointerDown:
                    rendererState.processClick(
                        relativeEventLocation.x,
                        relativeEventLocation.y
                    );
                    break;
            }
            break;
    }
}
canvas.onpointerup = event => {
    if(touchEnabled(event) && event.button === 0) {
        routePointerEvent(event,pointerEventTypes.pointerUp);
    }
}
canvas.onpointerdown = event => {
    if(touchEnabled(event) && event.button === 0) {
        routePointerEvent(event,pointerEventTypes.pointerDown);
    }
}
canvas.onpointermove = processMouseMove;
function processMouseMove(event) {
    if(touchEnabled(event)) {
        const relativeEventLocation = getRelativeEventLocation(
            event
        );
        lastRelativeX = relativeEventLocation.x;
        lastRelativeY = relativeEventLocation.y;
        if(rendererState.processMove) {
            rendererState.processMove(
                relativeEventLocation.x,
                relativeEventLocation.y
            );  
        }
    }
}
let keyBindings = (function(){
    const savedBinds = localStorage.getItem(KEY_BINDS_KEY);
    if(savedBinds) {
        return JSON.parse(savedBinds);
    } else {
        localStorage.setItem(KEY_BINDS_KEY,DEFAULT_KEY_BINDS);
        return JSON.parse(DEFAULT_KEY_BINDS);
    }
})();
const saveKeyBinds = () => {
    localStorage.setItem(KEY_BINDS_KEY,JSON.stringify(keyBindings));
}
const setKeyBinds = newBinds => {
    keyBindings = newBinds;
    saveKeyBinds();
}
const rewriteKeyboardEventCode = eventCode => {
    if(kc_inverse[eventCode]) {
        return eventCode;
    }
    return keyBindings[eventCode];
}
const keyup = event => {
    if(paused || !rendererState) {
        return;
    }
    routeKeyEvent(rewriteKeyboardEventCode(event.code),keyEventTypes.keyUp);
}
const keydown = event => {
    const keyCode = rewriteKeyboardEventCode(event.code)
    switch(keyCode) {
        case kc.fullscreen:
            if(!electron) {
                break;
            }
            const isFullScreen = !electronWindow.isFullScreen();
            electronWindow.setFullScreen(isFullScreen);
            if(pictureModeElementTimeout) {
                clearTimeout(pictureModeElementTimeout);
            }
            pictureModeElement.textContent = isFullScreen ? "fullscreen" : "not fullscreen";
            pictureModeElementTimeout = setTimeout(()=>{
                pictureModeElement.textContent = "";
                pictureModeElementTimeout = null;
            },600);
            break;
        case kc.picture_mode:
            cycleSizeMode();
            break;
    }
    if(paused || !rendererState) {
        return;
    }
    routeKeyEvent(keyCode,keyEventTypes.keyDown);
};
window.addEventListener("keydown",keydown);
window.addEventListener("keyup",keyup);

function applyLowResolutionTextAdapations() {
    adaptiveTextScale = lowResolutionAdaptiveTextScale;
    adaptiveTextSpacing = lowResolutionAdpativeTextSpacing;
}

function applyHighResolutionTextAdaptions() {
    adaptiveTextScale = highResolutionAdaptiveTextScale;
    adaptiveTextSpacing = highResolutionAdaptiveTextSpacing;
}
function applyMediumResolutionTextAdapations() {
    adaptiveTextScale = mediumResolutionAdaptiveTextScale;
    adaptiveTextSpacing = mediumResolutionAdaptiveTextSpacing;
}

let sizeApplicationDeferred = false;
function applySizeMode(forced=false) {
    if(!forced && rendererState.transitioning) {
        sizeApplicationDeferred = true;
        return;
    }
    let sizeMode;
    if(rendererState && rendererState.forcedSizeMode) {
        sizeMode = rendererState.forcedSizeMode;
        if(canvasSizeMode === sizeModes.center.name && rendererState.forcedSizeMode === sizeModes.fit.name) {
            sizeMode = sizeModes.center.name;
        } else if(canvasSizeMode === sizeModes.fit.name && rendererState.forcedSizeMode === sizeModes.center.name) {
            sizeMode = sizeModes.fit.name;
        }
    } else {
        sizeMode = canvasSizeMode;
    }
    if(sizeMode === sizeModes.stretch.name &&
        (
            window.innerWidth / window.innerHeight > maximumWidthToHeightRatio ||
            window.innerHeight / window.innerWidth > maximumHeightToWidthRatio
        ) && (rendererState ? !rendererState.disableAdapativeFill : true)
    ) {
        sizeMode = sizeModes.fit.name;
    }
    switch(sizeMode) {
        case sizeModes.fit.name:
            applyLowResolutionTextAdapations();
            canvas.width = internalWidth;
            canvas.height = internalHeight;
            if(window.innerWidth / window.innerHeight > widthByHeight) {
                const newWidth = window.innerHeight * widthByHeight;

                canvas.style.height = window.innerHeight + "px";
                canvas.style.width = newWidth + "px";

                canvas.style.top = "0px";
                canvas.style.left = (window.innerWidth / 2) - (newWidth / 2) + "px";
            } else {
                const newHeight = window.innerWidth * heightByWidth;

                canvas.style.width = window.innerWidth + "px";
                canvas.style.height = newHeight + "px";

                canvas.style.top = ((window.innerHeight / 2) - (newHeight / 2)) + "px";
                canvas.style.left = "0px";
            }
            break;
        default:
        case sizeModes.stretch.name:
            let zoomDivider = rendererState ? rendererState.zoomDivider || defaultFullScreenZoom : defaultFullScreenZoom;
            if(window.innerWidth >= maxHorizontalResolution) {
                zoomDivider = (window.innerWidth / maxHorizontalResolution) * defaultFullScreenZoom;
                applyHighResolutionTextAdaptions();
            } else if(window.innerWidth < smallScaleSnapPoint) {
                zoomDivider = smallFullScreenZoom;
                applyLowResolutionTextAdapations();
            } else if(window.innerWidth < mediumScaleSnapPoint) {
                zoomDivider = mediumFullScreenZoom;
                applyMediumResolutionTextAdapations();
            } else {
                applyHighResolutionTextAdaptions();
            }

            canvas.width = (window.innerWidth/zoomDivider)
            canvas.height = (window.innerHeight/zoomDivider);

            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            canvas.style.left = "0px";
            canvas.style.top = "0px";
            break;
        case sizeModes.center.name:
            applyLowResolutionTextAdapations();
            canvas.width = internalWidth;
            canvas.height = internalHeight;
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            canvas.style.left = ((window.innerWidth / 2) - (canvas.width / 2)) + "px";
            canvas.style.top = "4vh";
            break;
    }
    setSizeConstants();
    rainbowGradient = createRainbowGradient();
    if(rendererState && rendererState.updateSize) {
        rendererState.updateSize();
    }
    context.imageSmoothingEnabled = false;
}
function cycleSizeMode() {
    let newMode = defaultSizeMode;
    switch(canvasSizeMode) {
        default:
        case sizeModes.fit.name:
            newMode = sizeModes.center.name;
            break;
        case sizeModes.stretch.name:
            newMode = sizeModes.fit.name;
            break;
        case sizeModes.center.name:
            newMode = sizeModes.stretch.name;
            break;
    }
    if(pictureModeElementTimeout) {
        clearTimeout(pictureModeElementTimeout);
    }
    pictureModeElement.textContent = sizeModes[newMode].displayName;
    pictureModeElementTimeout = setTimeout(()=>{
        pictureModeElement.textContent = "";
        pictureModeElementTimeout = null;
    },600);
    canvasSizeMode = newMode;
    applySizeMode(false);
    localStorage.setItem("canvasSizeMode",newMode);
    console.log(`Canvas handler: Set size mode to '${newMode}'`);
}

function render(timestamp) {
    animationFrame = window.requestAnimationFrame(render); 

    backgroundContext.fill = "black";
    backgroundContext.fillRect(0,0,1,1);

    if(!paused) {
        const gamepads = navigator.getGamepads();
        let i = 0;
        while(i < gamepads.length) {
            if(gamepads[i] && gamepads[i].mapping === "standard") {
                processGamepad(gamepads[i],timestamp);
                i = gamepads.length;
            }
            i++;
        }
        rendererState.render(timestamp);
    }
}

function stopRenderer() {
    if(!rendererState) {
        console.warn("Warning: The renderer is already stopped and cannot be stopped further.");
        return;
    }
    window.cancelAnimationFrame(animationFrame);
    rendererState = null;
    console.log("Renderer stopped");
}

function startRenderer() {
    const wasPaused = paused;
    paused = false;
    if(!rendererState) {
        console.error("Error: Missing renderer state; the renderer cannot start.");
        return;
    }
    animationFrame = window.requestAnimationFrame(render);
    if(rendererState.start) {
        rendererState.start(performance.now());
    }
    console.log("Canvas handler: Renderer started");
}

function setRendererState(newRendererState) {
    rendererState = newRendererState;
    applySizeMode(true);
    if(rendererState.processKey) {
        if(rendererState.processKeyUp) {
            keyEventMode = keyEventModes.upAndDown;
        } else {
            keyEventMode = keyEventModes.downOnly;
        }
    } else {
        console.warn("Canvas handler: This renderer state is possibly misconfigured for key events");
        keyEventMode = keyEventModes.none;
    }
    if(rendererState.processClick) {
        if(rendererState.processClickEnd) {
            pointerEventMode = pointerEventModes.upAndDown;
        } else {
            pointerEventMode = pointerEventModes.upOnly;
        }
    } else {
        console.warn("Canvas handler: This renderer state is possibly misconfigured for pointer events");
        pointerEventMode = pointerEventModes.none;
    }
}

function pauseRenderer() {
    paused = true;
    console.log("Canvas handler: Paused renderer");
}

function forceRender() {
    if(!rendererState) {
        console.error("Error: Missing renderer state; the renderer cannot render.");
        return;
    }
    rendererState.render(
        context,performance.now()
    );
}
window.onresize = () => {
    applySizeMode(false);
};
applySizeMode(true);
