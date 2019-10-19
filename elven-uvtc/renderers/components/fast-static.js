const DEFAULT_CACHE_SIZE = 1000;
const DEFAULT_BLOCK_COUNT = 5;
const ONE_HUNDRED_BLOCK_SIZE = 100;

let cacheSize = null;
let loaded = false;
let staticBitmap = null;

function DefaultStaticGenerator() {
    const shade = Math.floor(256 * Math.random());
    return `rgb(${shade},${shade},${shade})`;
}
function GetOneHundredBlock(staticGenerator,blockSize) {
    const oneHundredBlock = new OffscreenCanvas(
        blockSize,blockSize
    );
    const oneHundredContext = oneHundredBlock.getContext(
        "2d",{alpha:true}
    );
    for(let x = 0;x<blockSize;x++) {
    for(let y = 0;y<blockSize;y++) {
        oneHundredContext.fillStyle = staticGenerator.call(null,x,y);
        oneHundredContext.fillRect(x,y,1,1);
    }}
    return oneHundredBlock.transferToImageBitmap();
}
function GetOneHundredBlocks(count,blockSize,staticGenerator) {
    const blocks = new Array(count);
    for(let i = 0;i<count;i++) {
        blocks[i] = GetOneHundredBlock(staticGenerator,blockSize);
    }
    const closeAll = () => blocks.forEach(block=>block.close());
    const getRandom = () => blocks[Math.floor(Math.random()*count)];
    return {
        blocks: blocks,
        getRandom: getRandom,
        closeAll: closeAll
    }
}
function GenerateStatic(staticGenerator,newCacheSize,blockCount,blockSize) {
    if(!staticGenerator || typeof staticGenerator !== "function") {
        staticGenerator = DefaultStaticGenerator;
    }
    if(isNaN(newCacheSize) || !isFinite(newCacheSize)) {
        newCacheSize = DEFAULT_CACHE_SIZE;
    }
    if(isNaN(blockCount) || !isFinite(blockCount)) {
        blockCount = DEFAULT_BLOCK_COUNT;
    }
    if(isNaN(blockSize) || !isFinite(blockSize)) {
        blockSize = ONE_HUNDRED_BLOCK_SIZE;
    }
    const staticBlocks = GetOneHundredBlocks(blockCount,blockSize,staticGenerator);
    cacheSize = newCacheSize;
    const offscreenCanvas = new OffscreenCanvas(
        cacheSize,cacheSize
    );
    const offscreenContext = offscreenCanvas.getContext(
        "2d",{alpha:true}
    );
    for(let y = 0;y<newCacheSize;y+=blockSize) {
    for(let x = 0;x<newCacheSize;x+=blockSize) {
        offscreenContext.drawImage(
            staticBlocks.getRandom(),
            x,y,
            blockSize,
            blockSize
        );
    }}
    staticBlocks.closeAll();
    if(staticBitmap !== null) {
        staticBitmap.close();
    }
    staticBitmap = offscreenCanvas.transferToImageBitmap();
}
async function PreloadStatic(
    callback,grainSize,staticGenerator,cacheSize,blockCount,blockSize
) {
    if(loaded) {
        if(callback) {
            callback();
        }
        return;
    }
    GenerateStatic(
        grainSize,staticGenerator,cacheSize,blockCount,blockSize
    );
    if(callback) {
        callback();
    }
    loaded = true;
}
function DeleteStatic() {
    loaded = false;
    if(staticBitmap) {
        staticBitmap.close();
    }
    staticBitmap = null;
}
function FastStatic() {
    this.preload = PreloadStatic;
    this.unload = DeleteStatic;
    this.render = (x,y,width,height,scale) => {
        scale = Math.max(scale,0.1);
        const horizontalPixels = Math.floor(
            width / scale
        );
        const verticalPixels = Math.floor(
            height / scale
        );
        const sourceX = Math.floor(
            Math.random() * (cacheSize-horizontalPixels)
        );
        const sourceY = Math.floor(
            Math.random() * (cacheSize-verticalPixels)
        );
        context.drawImage(
            staticBitmap,
            sourceX,sourceY,horizontalPixels,verticalPixels,
            x,y,width,height
        );
    }
}
export default FastStatic;
export { FastStatic, PreloadStatic, DeleteStatic }
