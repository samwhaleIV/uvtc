import { MOVE_SOURCE_WIDTH } from "../../renderers/components/battle/move.js";

const Moves = {};
const MovesList = [
    {
        name: "None",
        type: "ui"
    },
    {
        name: "Nothing",
        type: "ui",
        noTextBlur: true
    },
    {
        name: "Wimpy",
        type: "attack"
    },
    {
        name: "Iced Whiskey",
        type: "defense"
    },
    {
        name:"Red Apple",
        type: "defense"
    },
    {
        name: "Return to Sender",
        type: "attack"
    },
    {
        name: "Jingle Bells",
        type: "defense"
    },
    {
        name: "Submission",
        type: "special"
    },
    {
        name: "Cry",
        type: "special"
    },
    {name:"Poison Apple"},
    {name:"Wooden Sword"},
    {name:"Wooden Shield"},
    {name:"Midus Touch"},
    {name:"Hot Porridge"},
    {name:"Stress Eating"},
    {name:"Banish"},
    {name:"Trust"},
    {name:"Treason"},
    {name:"Friendship"},
    {name:"Vitamins"}
];
MovesList.forEach((move,index) => {
    Moves[move.name] = move;
    move.wrappedName = processTextForWrapping(move.name);
    move.sourceX = MOVE_SOURCE_WIDTH * index;
    move.ID = index + 1;
});
export default Moves;
export {MovesList,Moves};
