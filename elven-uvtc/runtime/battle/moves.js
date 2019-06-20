import { MOVE_SOURCE_WIDTH } from "../../renderers/components/battle/move.js";

const MovesList = [
    {
        name:"None",
        description:"This isn't a real move. It doesn't do anything at all.",
        type:"ui"
    },
    {
        name:"Skip",
        description:"Skip what's happening right now so you can continue kicking ass.",
        type: "ui"
    },
    {
        name:"Logic",
        type:"ui"
    },
    {
        name:"Malice",
        type:"ui"
    },
    {
        name:"Fear",
        type:"ui"
    },
    {
        name:"Wimpy Punch",
        description:"Is this really the best you can do?",
        type:"malice"
    },
    {
        name:"Iced Whiskey",
        type:"logic"
    },
    {name:"Red Apple"},
    {name:"Return to Sender"},
    {name:"Poison Apple"},
    {name:"Submission"},
    {name:"Jingle Bells"},
    {name:"Wooden Sword"},
    {name:"Wooden Shield"},
    {name:"Cry"},
    {name:"Midus Touch"},
    {name:"Hot Porridge"},
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
