const CharacterColors = {
    "jim": "blue",
    "frogert": "green",
    "wimpy-red-elf": "red",
    "red-elfette": "red",
    "boney-elf": "deeppink",
    "wizard-elf": "blueviolet",
    "headless-elf": "darkorange",
    "jester-elf": "goldenrod",
    "mascara": "deeppink",
    "burr": "darkorange",
    "shiver": "blueviolet"
}
const CharacterDisplayNames = {
    "jim": "Jim",
    "frogert": "Frogert",
    "wimpy-red-elf": "Wimpy Red Elf",
    "red-elfette": "Red Elfette",
    "boney-elf": "Boney Elf",
    "wizard-elf": "Wizard Elf",
    "headless-elf": "Headless Elf",
    "jester-elf": "Jester Elf",
    "mascara": "Mascara",
    "burr": "Burr",
    "shiver": "Shiver"
}
const colorLookup = {}
Object.entries(textColorLookup).forEach(entry => {
    colorLookup[entry[1]] = entry[0];
});
delete colorLookup[0];
const getColorCode = characterName => {
    const color = CharacterColors[characterName];
    if(!color) {
        throw Error(`Text name color not found for '${characterName}`);
    }
    const colorCode = colorLookup[color];
    if(!colorCode) {
        throw Error(`Color '${color}' is an invalid text rendering color`)
    }
    return colorCode;
}
const getPrefix = characterName => {
    const colorCode = getColorCode(characterName);
    let displayName = CharacterDisplayNames[characterName];
    if(!displayName) {
        displayName = characterName;
    }
    return `${colorCode}${displayName}:${colorCode} `;
}
const getColoredName = characterName => {
    const colorCode = getColorCode(characterName);
    let displayName = CharacterDisplayNames[characterName];
    if(!displayName) {
        displayName = characterName;
    }
    return `${colorCode}${displayName}${colorCode}`;
}
const getPrefixMask = (character,maskedName) => {
    if(!character.characterName) {
        throw Error(`A character with a masked name must also have a real name. Everyone needs a true identity`);
    }
    const colorCode = getColorCode(character.characterName);
    return `${colorCode}${maskedName}:${colorCode} `;
}
const getSpeakingPrefix = (character,customPrefix) => customPrefix ? getPrefixMask(character,customPrefix) : character.prefix;
const speakMethod = async (world,character,message,customPrefix) => {
    const prefix = getSpeakingPrefix(character,customPrefix);
    await world.showNamedTextPopup(message,prefix);
}
const speakMethodID = async (world,character,messageID,customPrefix) => {
    const prefix = getSpeakingPrefix(character,customPrefix);
    await world.showNamedTextPopupID(messageID,prefix);
}
const speakMethod_multiple = async (world,character,messages,customPrefix) => {
    const prefix = getSpeakingPrefix(character,customPrefix);
    await world.showNamedTextPopups(messages,prefix);
}
const speakMethodID_multiple = async (world,character,messageIDs,customPrefix) => {
    const prefix = getSpeakingPrefix(character,customPrefix);
    await world.showNamedTextPopupsID(messageIDs,prefix);
}
const defaultCharacterMaker = (world,direction,characterName,isElf=false) => {
    const character = new world.sprite(direction,characterName,isElf);
    character.prefix = getPrefix(characterName);
    character.characterName = characterName;
    return character;
}
const characterMakers = {
    "jim": (world,characterName,direction) => {
        return defaultCharacterMaker(world,direction,characterName);
    },
    "frogert": (world,characterName,direction) => {
        return defaultCharacterMaker(world,direction,characterName);
    },
    "wimpy-red-elf": (world,characterName,direction) => {
        return defaultCharacterMaker(world,direction,characterName,true);
    }
}
function GetOverworldCharacterSpriteless(world,name) {
    const character = {};
    character.prefix = getPrefix(name);
    character.characterName = name;
    character.coloredName = getColoredName(name);
    character.say = async (message,customPrefix=null) => {
        await speakMethod(world,character,message,customPrefix);
    }
    character.sayID = async (messageID,customPrefix=null) => {
        await speakMethodID(world,character,messageID,customPrefix);
    }
    character.speech = async (messages,customPrefix=null) => {
        await speakMethod_multiple(world,character,messages,customPrefix);
    }
    character.speechID = async (messageIDs,customPrefix=null) => {
        await speakMethodID_multiple(world,character,messageIDs,customPrefix);
    }
    return character;
}
function GetOverworldCharacter(world,name,direction=null,spriteLess=false) {
    if(spriteLess) {
        return GetOverworldCharacterSpriteless(world,name);
    }
    const characterMaker = characterMakers[name];
    if(!characterMaker) {
        throw Error(`Character '${name}' does not exist`);
    }
    const character = characterMaker(world,name,direction);
    character.say = async (message,customPrefix=null) => {
        await speakMethod(world,character,message,customPrefix);
    }
    character.sayID = async (messageID,customPrefix=null) => {
        await speakMethodID(world,character,messageID,customPrefix);
    }
    character.speech = async (messages,customPrefix=null) => {
        await speakMethod_multiple(world,character,messages,customPrefix);
    }
    character.speechID = async (messageIDs,customPrefix=null) => {
        await speakMethodID_multiple(world,character,messageIDs,customPrefix);
    }
    character.move = async (...steps) => {
        await world.moveSprite(character.ID,steps);
    }
    character.coloredName = getColoredName(name);
    return character;
}
export default GetOverworldCharacter;
