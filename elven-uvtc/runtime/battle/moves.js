import { MOVE_SOURCE_WIDTH } from "../../renderers/components/battle/move.js";

const MovesList = [
    {name:"None"},
    {name:"Logic"},
    {name:"Malice"},
    {name:"Fear"},
    {name:"Iced Whiskey"},
    {name:"Red Apple"},
    {name:"Return to Sender"},
    {name:"Poison Apple"},
    {name:"Submission"},
    {name:"Jingle Bells"},
    {name:"Wooden Sword"},
    {name:"Wooden Shield"},
    {name:"Cry"},
    {name:"Midus Touch"},
    {name: "Hot Porridge"},
    {name:"Stress Eating"},
    {name:"Banish"},
    {name:"Trust"},
    {name:"Treason"},
    {name:"Friendship"},
    {name:"Vitamins"}
];
const Moves = {};
MovesList.forEach((move,index) => {
    Moves[move.name] = move;
    move.sourceX = MOVE_SOURCE_WIDTH * index;
    move.ID = index + 1;
});
export default Moves;
export {MovesList,Moves};
