import ScrollingBackground from "../../renderers/components/scrolling-background.js";
import RotatingBackground from "../../renderers/components/rotating-background.js";

const backgroundPadding = 20;

const getDynamicFillBackground = image => {
    return new (function(){
        const imageWidth = image.width;
        const imageHeight = image.height;
        const heightToWidth = image.width / image.height;
        const widthToHeight = image.height / image.width;
        this.render = () => {
            if(greaterWidth) {
                const height = fullWidth*widthToHeight;
                context.drawImage(
                    image,
                    0,0,imageWidth,imageHeight,
                    0,halfHeight-height/2,fullWidth,fullWidth,height
                );
            } else {
                const width = fullHeight*heightToWidth;
                context.drawImage(
                    image,
                    0,0,imageWidth,imageHeight,
                    halfWidth-width/2,0,width,fullHeight
                );
            }
        }
    })();
}

const getGenericBackground = (layer1Image,layer2Image) => {
    return new (function(){
        const scrollingBackground = new ScrollingBackground(
            layer1Image,backgroundPadding
        );
        const foreground = getDynamicFillBackground(
            imageDictionary[`backgrounds/${layer2Image}`]
        );
        this.render = timestamp => {
            scrollingBackground.render(timestamp);
            context.save();
            context.globalCompositeOperation = "multiply";
            foreground.render();
            context.restore();
        }
    })();
}

const BattleManifest = {
    "tiny-arm-elf": {
        name: "Tiny Arm Elf",
        leftBoxBorder: "#F8529A",
        leftBoxColor: "#FF71B9",
        leftBoxHealth: "#D34784",

        rightBoxHealth: "#59B9FF",
        rightBoxColor: "#14A5F9",
        rightBoxBorder: "#0074C6",

        holeRingColor: "rgba(0,148,255,0.33)",

        getBackground: function() {
            return getGenericBackground("checkered","tiny-arm");
        }
    },
    "wimpy-red-elf": {
        name: "Wimpy Red Elf",
        leftBoxBorder: "#BF0000",
        leftBoxHealth: "#F74646",
        leftBoxColor: "#CE2D2D",

        rightBoxBorder: "#717171",
        rightBoxColor: "#C3C3C3",
        rightBoxHealth: "#222222",

        noOuterRing: true,

        holeRingColor: "rgba(255,128,128,0.3)",
        getBackground: function() {
            return new (function(){
                const scrollingBackground = new ScrollingBackground("checkered-dark",0);
                const rotatingBackground = new RotatingBackground("wimpy-red");
                rotatingBackground.rotationTime = 20000;
                rotatingBackground.clockwise = true;
                this.render = timestamp => {
                    scrollingBackground.render(timestamp);
                    context.save();
                    context.globalCompositeOperation = "overlay";
                    context.globalAlpha = "0.9";
                    rotatingBackground.render(timestamp);
                    context.restore();
                }
            })();
        }

    },
    "boney-elf": {
        name: "Boney Elf",
        leftBoxBorder: "#F8529A",
        leftBoxHealth: "#D34784",
        leftBoxColor: "#FF79C1",

        rightBoxHealth: "#FF59A8",
        rightBoxBorder: "#C60060",
        rightBoxColor: "#EC0F83",

        holeRingColor: "rgba(0,128,255,0.33)",

        getBackground: function() {
            return getGenericBackground("checkered","boney");
        }
    },
    "burr": {
        name: "Burr",
        leftBoxColor: "#F18445",
        leftBoxHealth: "#FFCD4F",
        leftBoxBorder: "#AF6033",

        rightBoxBorder: "#EFEFEF",
        rightBoxColor: "rgb(240,240,240)",
        rightBoxHealth: "#262626",
        holeRingColor: "#262626",

        backgroundColor: "#E57834",

        getBackground: function() {
            const scrollingBackground = new ScrollingBackground("checkered",0);
            return {
                render: timestamp => {
                    scrollingBackground.render(timestamp);
                    context.save();
                    context.fillStyle = this.backgroundColor;
                    context.globalCompositeOperation = "multiply";
                    context.fillRect(0,0,fullWidth,fullHeight);
                    context.restore();
                }
            }
        }
    }
}
const fallbackStyle = BattleManifest["tiny-arm-elf"];
const styleProperties = Object.keys(fallbackStyle);
Object.values(BattleManifest).forEach(styleSet => {
    styleProperties.forEach(propertyName => {
        if(!styleSet[propertyName]) {
            if(propertyName === "name") {
                styleSet[propertyName] = "<Missing style info>";
            } else {
                styleSet[propertyName] = fallbackStyle[propertyName];
            }
        }
    });
});
export default BattleManifest;
