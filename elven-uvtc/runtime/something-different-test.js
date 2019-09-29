import CrazyFlyingShitEffect from "../renderers/components/crazy-flying-shit.js";
import SpriteForeground from "../renderers/components/battle/sprite-foreground.js";

function SomethingDifferentTest(layers) {
    const getTree = posX => {
        return this.getForegroundObject(116,2,4,posX,8);
    }
    layers[0].push(
        getTree(0.4),
        getTree(0.9),
        getTree(-0.5),
        getTree(1.5),
    );
    layers[1].push(
        getTree(0.25),
        getTree(0.75),
        getTree(-0.5),
        getTree(1.5),         
    );
    layers[2].push(
        getTree(0.20),
        getTree(0.75)
    );

    this.backgroundEffects.addLayer(new CrazyFlyingShitEffect(1,2.5,0.001,80,200,"white"));
    this.opponentSprite = new SpriteForeground("wimpy-red-elf",true,null,null,0.2);
    this.tileset = imageDictionary["battle/test-tileset"];
    //this.fogColor = defaultFogColor;
    
    (async function(){
        await delay(100);
        while(true) {
            await this.opponent.move(0.5);
            await delay(500);
            await this.opponent.move(-0.5);
            await delay(500);
            await this.opponent.move(-0.5);
            await delay(500);
            await this.opponent.move(0.5);
            await delay(500);
        }
    }).call(this);
}
export default SomethingDifferentTest;
