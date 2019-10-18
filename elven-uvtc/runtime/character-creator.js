const CharacterMakers = {
    "jim":              defaultCharacterMaker,
    "frogert":          defaultCharacterMaker,
    "wimpy-red-elf":    elfCharacterMaker,
    "ice-man":          defaultCharacterMaker,
    "chili-wife":       defaultCharacterMaker,
    "chili":            defaultCharacterMaker,
    "tree-lee":         defaultCharacterMaker,
    "jam":              defaultCharacterMaker,
    "wizard-elf":       elfCharacterMaker,
    "tiny-arm-elf":     elfCharacterMaker,
    "wimpy-green-elf":  elfCharacterMaker
};
const CharacterColors = {
    "jim":              "blue",
    "frogert":          "green",
    "wimpy-red-elf":    "red",
    "red-elfette":      "red",
    "boney-elf":        "deeppink",
    "wizard-elf":       "blueviolet",
    "headless-elf":     "darkorange",
    "jester-elf":       "goldenrod",
    "mascara":          "deeppink",
    "burr":             "darkorange",
    "shiver":           "blueviolet",
    "ice-man":          "cyan",
    "tree-lee":         "blueviolet",
    "chili":            "darkorange",
    "chili-wife":       "deeppink",
    "jam":              "blue",
    "boxy":             "blueviolet",
    "louis":            "green",
    "wizard-elf":       "blueviolet",
    "tiny-arm-elf":     "cyan",
    "wimpy-green-elf":  "green",
    "rock-elf-spy":     "red",
    "enigma":           "red"
};
const CharacterDisplayNames = {
    "jim":              "Jim",
    "frogert":          "Frogert",
    "wimpy-red-elf":    "Wimpy Red Elf",
    "red-elfette":      "Red Elfette",
    "boney-elf":        "Boney Elf",
    "wizard-elf":       "Wizard Elf",
    "headless-elf":     "Headless Elf",
    "jester-elf":       "Jester Elf",
    "mascara":          "Mascara",
    "burr":             "Burr",
    "shiver":           "Shiver",
    "ice-man":          "Ice Man",
    "tree-lee":         "Tree Lee",
    "chili":            "Chili",
    "chili-wife":       "Chillene",
    "jam":              "Jam",
    "boxy":             "Boxy",
    "louis":            "Louis",
    "wizard-elf":       "Wizard Elf",
    "tiny-arm-elf":     "Tiny Arm Elf",
    "wimpy-green-elf":  "Wimpy Green Elf",
    "rock-elf-spy":     "Rock Elf Spy",
    "enigma":           "Enigma"
};
const ColorLookup = {};
Object.entries(textColorLookup).forEach(entry => {
    ColorLookup[entry[1]] = entry[0];
});
delete ColorLookup[0];
function applyPopupAttributes(character,characterName) {
    character.prefix = getPrefix(characterName);
    character.characterName = characterName;
}
function defaultCharacterMaker(world,characterName,direction,isElf=false) {
    const character = new (isElf ? world.elfSprite:world.sprite)(direction,characterName);
    applyPopupAttributes(character,characterName);
    return character;
};
function elfCharacterMaker(world,characterName,direction,isElf=false) {
    return defaultCharacterMaker(world,characterName,direction,true);
};
function customSizeCharacterMaker(world,characterName,direction,width,height) {
    const character = new world.sprite(direction,characterName,width,height);
    applyPopupAttributes(character,characterName);
    return character;
};
function getColorCode(characterName) {
    const color = CharacterColors[characterName];
    if(!color) {
        throw Error(`Text name color not found for '${characterName}'`);
    }
    const colorCode = ColorLookup[color];
    if(!colorCode) {
        throw Error(`Color '${color}' is an invalid text rendering color`)
    }
    return colorCode;
};
function getPrefix(characterName) {
    const colorCode = getColorCode(characterName);
    let displayName = CharacterDisplayNames[characterName];
    if(!displayName) {
        displayName = characterName;
    }
    return `${colorCode}${displayName}:${colorCode} `;
};
function getColoredName(characterName) {
    const colorCode = getColorCode(characterName);
    let displayName = CharacterDisplayNames[characterName];
    if(!displayName) {
        displayName = characterName;
    }
    return `${colorCode}${displayName}${colorCode}`;
};
function getPrefixMask(character,maskedName) {
    if(!character.characterName) {
        throw Error(`A character with a masked name must also have a real name. Everyone needs a true identity`);
    }
    const colorCode = getColorCode(character.characterName);
    return `${colorCode}${maskedName}:${colorCode} `;
};
function getSpeakingPrefix(character,customPrefix) {
    return customPrefix ? getPrefixMask(character,customPrefix) : character.prefix;
};
async function speakMethod(world,character,message,customPrefix) {
    const prefix = getSpeakingPrefix(character,customPrefix);
    await world.showNamedPopup(message,prefix);
};
async function speakMethod_multiple(world,character,messages,customPrefix) {
    const prefix = getSpeakingPrefix(character,customPrefix);
    await world.showNamedPopups(messages,prefix);
};
function GetOverworldCharacterSpriteless(world,name) {
    const character = {};
    character.prefix = getPrefix(name);
    character.characterName = name;
    character.coloredName = getColoredName(name);
    character.say = async (message,customPrefix=null) => {
        await speakMethod(world,character,message,customPrefix);
    }
    character.speech = async (messages,customPrefix=null) => {
        await speakMethod_multiple(world,character,messages,customPrefix);
    }
    return character;
}
function GetOverworldCharacter(world,name,direction=null,spriteLess=false) {
    if(spriteLess) {
        return GetOverworldCharacterSpriteless(world,name);
    }
    const characterMaker = CharacterMakers[name];
    if(!characterMaker) {
        throw Error(`Character '${name}' does not exist`);
    }
    const character = characterMaker(world,name,direction);
    character.say = async (message,customPrefix=null) => {
        await speakMethod(world,character,message,customPrefix);
    }
    character.speech = async (messages,customPrefix=null) => {
        await speakMethod_multiple(world,character,messages,customPrefix);
    }
    character.move = async (...steps) => {
        await world.moveSprite(character.ID,steps);
    }
    character.coloredName = getColoredName(name);
    return character;
}
export default GetOverworldCharacter;
