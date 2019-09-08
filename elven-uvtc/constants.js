"use strict";
const internalWidth = 800;
const internalHeight = 600;

const soundGain = 1;
const musicNodeGain = 1;

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

const WorldTextureAnimationRows = 4;
const WorldTextureAnimationStart = Math.pow(WorldTextureColumns,2) - WorldTextureColumns * WorldTextureAnimationRows;

const footPrintTiles = {
    21: true
};
const FALLBACK_MAP_ID = "bedroom_1";

const OVERWORLD_MUSIC_FADE_TIME = 100;
const FAKE_OVERWORLD_LOAD_TIME = 500;
const VERSION_STRING = "you versus earth, v0.2.2";

const PENDING_CODE = Symbol("Pending");
