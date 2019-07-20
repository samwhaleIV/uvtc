import { MOVE_SOURCE_WIDTH } from "../../renderers/components/battle/move.js";

const MovesList = [
    {
        name: "None",
        description: "This isn't a real move. It doesn't do anything at all.",
        type: "ui"
    },
    {
        name: "Nothing",
        description: "What is it good for? Absolutely nothing.",
        type: "ui",
        noTextBlur: true,
        process: (user,target) => {
            return {
                type: "text",
                text: "Nothing happened."
            };
        }
    },
    {
        name: "Start",
        type: "ui",
    },
    {
        name: "Back",
        type: "ui",
    },
    {
        name: "Skip",
        description: "Skip what's happening right now so you can continue kicking ass.",
        type: "ui",
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
        name: "Wimpy Punch",
        description: "Hey, a punch is a punch. Does minimal damage.",
        type:"malice",
        process: (user,target) => {
            target.health -= 1;
            if(!target.isPlayer) {
                return {
                    type: "text",
                    text: "It was mildly effective..."
                }
            }
        }
    },
    {
        name: "Iced Whiskey",
        type: "logic",
        description: "Pass your opponent some nice cold whiskey.",
        process: (user,target) => {
            return {
                type: "text",
                text: `${user.name} gave ${target.name} some whiskey`
            }
        }
    },
    {
        name:"Red Apple",
        type: "logic",
        description: "Eat an apple and heal 1 health to yourself.",
        process: (user,target) => {
            user.health += 1;
            return {
                type: "text",
                text: "An apple a day keeps the doctor away."
            }
        }
    },
    {
        name: "Return to Sender",
        description: "If your opponent last used a punch, you deal double its damage.",
        type: "malice",
        process: (user,target) => {
            return {
                type: "text",
                text: "This move is not done yet. SORRY."
            }
        }
    },
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
    move.wrappedName = processTextForWrapping(move.name);
    move.sourceX = MOVE_SOURCE_WIDTH * index;
    move.ID = index + 1;
});
export default Moves;
export {MovesList,Moves};
