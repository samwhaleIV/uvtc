import { MOVE_SOURCE_WIDTH } from "../../renderers/components/battle/move.js";

const Moves = {};
const MovesList = [
    {
        name: "None",
        type: "ui",
        noTextBlur: true
    },
    {
        name: "Nothing",
        type: "ui",
        noTextBlur: true
    },
    {
        name: "Wimpy",
        internalDescription: "The default punching",
        type: "attack"
    },
    {
        name: "Iced Whiskey",
        internalDescription: "Drunk, frozen, post processing hell",
        type: "special"
    },
    {
        name:"Red Apple",
        internalDescription: "Replace regular heart with an apple that has passive regen",
        type: "defense"
    },
    {
        name: "Disappointment",
        internalDescription: "It does nothing but remind you that it is doing nothing",
        type: "special"
    },
    {
        name: "Jingle Bells",
        internalDescription: "Makes annoying sounds instead of punch/whatever sounds",
        type: "special"
    },
    {
        name: "Snowball",
        internalDescription: "A snowball throwing attack",
        type: "attack"
    },
    {
        name: "Bright Idea",
        internalDescription: "Like a long stick but it's a lamp, it can turn on and off"
    },
    {
        name: "Training Sword",
        internalDescription: "A sword forged from the branches of elfmas tree"
    }

];
MovesList.forEach((move,index) => {
    Moves[move.name] = move;
    move.wrappedName = processTextForWrapping(move.name);
    move.sourceX = MOVE_SOURCE_WIDTH * index;
    move.ID = index + 1;
});
export default Moves;
export {MovesList,Moves};
