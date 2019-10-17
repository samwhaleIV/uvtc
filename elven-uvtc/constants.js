"use strict";
const KEY_BINDS_KEY =      "KEY_BINDS_UVTC";
const VOLUME_STORAGE_KEY = "VOLUME_UVTC";
const SIZE_MODE_KEY =      "SIZE_MODE_KEY_UVTC";
const SOUND_MUTED_KEY =    "SOUND_MUTED_UVTC";
const MUSIC_MUTED_KEY =    "MUSIC_MUTED_UVTC";
const DEFAULT_KEY_BINDS = JSON.stringify({
    Enter: kc.accept,
    Escape: kc.cancel,
    Digit1: kc.special_1,
    Digit2: kc.special_2,
    KeyW: kc.up,
    KeyD: kc.right,
    KeyS: kc.down,
    KeyA: kc.left,
    F11: kc.fullscreen
});
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

const LogicLayerInteractStart = 8;

const WorldTextureAnimationRows = 4;
const WorldTextureAnimationStart = Math.pow(WorldTextureColumns,2) - WorldTextureColumns * WorldTextureAnimationRows;

const FootPrintTiles = {
    21: true,
    37: true,
    1552: true,
    1616: true,
    1680: true,
    1744: true
};
const FALLBACK_MAP_ID = "missing_map";

const OVERWORLD_MUSIC_FADE_TIME = 100;
const FAKE_OVERWORLD_LOAD_TIME = 500;
const VERSION_STRING = "you versus earth, v0.3.1";

const TRIGGER_ACTIVATED = Symbol("TRIGGER_ACTIVATED");
