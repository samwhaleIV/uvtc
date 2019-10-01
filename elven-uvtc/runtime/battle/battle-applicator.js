import SpriteForeground from "../../renderers/components/battle/sprite-foreground.js";

const endPoints = [
    "opponentInjured",
    "roundEnd",
    "roundStart",
    "gameOver",
    "playerInjured"
];

const bindEndPoints = (target,endPointSpecification) => {
    const fallbackEndPoint = function() {
        void undefined;
    }
    let skipEndPointCheck = false;
    if(!endPointSpecification) {
        endPointSpecification = endPoints.reduce((pv,cv)=>{
            pv[cv] = fallbackEndPoint;
            return pv;
        },{});
        skipEndPointCheck = true;
    }
    Object.entries(endPointSpecification).forEach(entry => {
        const name = entry[0];
        let method = entry[1];
        if(!method) {
            method = fallbackEndPoint;
        }
        target[name] = method.bind(target);
    })
    if(!skipEndPointCheck) {
        endPoints.forEach(name => {
            if(!target[name]) {
                target[name] = fallbackEndPoint.bind(target);
            }
        });
    }
}

function SomethingDifferentApplicator(layers,specification) {
    function ApplyEffectsList(list,target) {
        if(!list.length) {
            list = [list];
        }
        list.forEach(target.addLayer);
    }
    if(specification.effects) {
        if(specification.effects.background) {
            ApplyEffectsList(specification.effects.background,this.backgroundEffects);
        }
        if(specification.effects.foreground) {
            ApplyEffectsList(specification.effects.foreground,this.foregroundEffects);
        }
        if(specification.effects.global) {
            ApplyEffectsList(specification.effects.global,this.globalEffects);
        }
    }
    if(specification.layers) {
        for(let i = 0;i<3;i++) {
            if(specification.layers[i]) {
                layers[i].push(...specification.layers[i]);
            }
        }
    }
    if(specification.opponentSprite) {
        const parameters = specification.opponentSprite;
        if(parameters.impactFrame) {
            this.opponent.impactFrame = parameters.impactFrame;
        }
        if(!parameters.name) {
            parameters.name = "wimpy-red-elf";
            parameters.isElf = true;
            parameters.customHeight = null;
            parameters.customWidth = null;
        }
        if(parameters.isElf) {
            parameters.customWidth = null;
            parameters.customHeight = null;
        }
        this.opponentSprite = new SpriteForeground(
            parameters.name,
            parameters.isElf || false,
            parameters.customWidth || null,
            parameters.customHeight || null,
            parameters.yOffset || 0
        );
    }
    if(specification.tileset || (specification.tileset = "test-tileset")) {
        this.tileset = imageDictionary[`battle/${specification.tileset}`];
    }
    if(specification.fogColor) {
        this.fogColor = specification.fogColor;
    }
    if(specification.opponentMaxHealth >= 0) {
        this.opponentMaxHealth = specification.opponentMaxHealth;
    }
    if(specification.playerMaxHealth >= 0) {
        this.playerMaxHealth = specification.playerMaxHealth;
    }
    bindEndPoints(this,specification.endPoints);
}
export default SomethingDifferentApplicator;
