import FastStatic from "./fast-static.js";

function FastStaticWrapper(
    grainSize,staticGenerator,cacheSize,blockCount,blockSize
) {
    const staticEffect = new FastStatic();
    const scale = grainSize;
    let ready = false;
    staticEffect.unload();
    staticEffect.preload(()=>{
        ready = true;
    },staticGenerator,cacheSize,blockCount,blockSize);
    this.render = () => {
        if(!ready) {
            return;
        }
        staticEffect.render(0,0,fullWidth,fullHeight,scale);
    }
}
export default FastStaticWrapper;
