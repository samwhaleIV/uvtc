"use strict";
const hoverPadding = 2.5;
const doubleHoverPadding = hoverPadding + hoverPadding; 
const flatHoverPadding = Math.floor(hoverPadding);
const flatDoubleHoverPadding = flatHoverPadding + flatHoverPadding;

const ACoolBlueColor = "#008DFF";
const ADarkerBlueColor = "#1d85d8";

const WorldTextureSize = 16;
const WorldTextureScale = 3;
const WorldTileSize = WorldTextureSize * WorldTextureScale;
const WorldTextureColumns = 64;
const footPrintTiles = {
    21: true
};
const FIRST_MAP_ID = "bedroom_1";
const FAST_AS_FUCK_TRANSITIONS = "sometimes";
