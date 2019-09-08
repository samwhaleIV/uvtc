import { MOVE_SOURCE_WIDTH } from "../../renderers/components/battle/move.js";

const getPossessiveName = target => {
    if(target.isPlayer) {
        return "your";
    } else {
        if(target.name.endsWith("s")) {
            return target.name + "'";
        } else {
            return target.name + "'s";
        }
    }
}

const Moves = {};
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
        process: () => {
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
        type: "malice",
        isPunch: true,
        damage: 1,
        process: function(user,target) {
            target.health -= this.damage;
            if(user.isPlayer) {
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
            if(target.state.liquorHandle) {
                return target.state.liquorHandle();
            }
            return {
                type: "text",
                text: `${user.name} gave ${target.name} some whiskey.`
            }
        }
    },
    {
        name:"Red Apple",
        type: "logic",
        description: "Eat an apple and heal 1 health to yourself.",
        healingAmount: 1,
        process: function(user) {
            user.health += this.healingAmount;
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
        multiplier: 2,
        process: function(user,target) {
            if(target.lastMove.isPunch) {
                const punchDamage = target.lastMove.damage * this.multiplier;
                target.health -= punchDamage;
                return {
                    type: "text",
                    text: `${user.name} dealt ${punchDamage} damage to ${target.name}!`
                }
            } else {
                return {
                    type: "text",
                    text: "But it failed!"
                }
            }
        }
    },
    {
        name: "Jingle Bells",
        description: "Ring the bells and your opponent may miss their next move!",
        type: "logic",
        process: (_,target) => {
            target.setStatus({
                name: "Ringing Ears",
                priority: 100,
                imageID: 1,
                odds: 0.5,
                outgoingFilter: function(user) {
                    user.clearStatus("Ringing Ears");
                    if(Math.random() > this.odds) {
                        return {
                            directive: "block",
                            events: {
                                type: "text",
                                text: "Ringing Ears caused it to fail!"
                            }
                        }
                    } else {
                        return {
                            directive: "continue",
                            events: {
                                type: "text",
                                text: "Ringing Ears didn't get in the way."
                            }
                        }
                    }
                }
            });
            return {
                type: "text",
                text: `${getPossessiveName(target)} ears are now ringing!`
            }
        }
    },
    {
        name: "Submission",
        type: "fear",
        description: "Your opponent decides what move you'll perform.",
        possibleMoves: [{
            name: "Self Punch",
            type: "malice",
            damage: 1,
            process: function(user) {
                user.health -= this.damage;
                return {
                    type: "text",
                    text: "Punching yourself seems unhealthy..."
                }
            }
        },"Nothing"],
        process: function(user,target) {
            let move;
            if(target.state.submissionHandle && !target.isPlayer) {
                move = target.state.submissionHandle();
            } else {
                move = this.possibleMoves[Math.floor(Math.random()*this.possibleMoves.length)];
            }
            if(typeof move === "string") {
                move = Moves[move];
            }
            return [
                {
                    type: "text",
                    text: user.isPlayer ?
                        `${target.name} decided you will use ${move.name}.`:
                        `You decided ${target.name} will use ${move.name}.`
                },
                {
                    type: user.isPlayer ? "player-move" : "opponent-move",
                    move: move
                }
            ]
        }
    },
    {
        name: "Cry",
        description: "Battling brings out the best and worst of all of us.",
        process: user => {
            const wasCrying = user.state.isCrying;
            user.state.isCrying = true;
            return {
                type: "text",
                text: wasCrying ? `${user.name} continue${user.isPlayer?"":"s"} to cry.` : `${user.name} started crying.`
            }
        }
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
