import OpponentSequencer from "../opponent-sequencer.js";
import Moves from "../moves.js";

function WimpyRedElfShowdown() {
    this.getStartEvents = () => [
        {
            type: "speech",
            text: "Do you really think you can beat an elf in a fight?"
        },{
            type: "speech",
            text: "Your move."
        }
    ];
    this.getPlayerWonEvents = () => [{
        type: "speech",
        text: "I... Never really learned how to fight."
    }];
    this.getPlayerLostEvents = () => {
        if(this.player.state.killedSelf) {
            return [];
        } else {
            return [{
                type: "speech",
                text: "I... I won? I meannn uh, YEAH. TAKE THAT NON-ELF SCUM."
            }]
        }
    };
    this.getStalemateEvents = () => [{
        type: "speech",
        text: "This... didn't go as I expected."
    }];
    this.getDefaultHealth = () => 8;
    const cryMessages = [
        "This fighting thing is a lot harder than I thought it would be!",
        "I want to go home!",
        "I should have never come here, I'm so scared!",
        "*lots of crying*",
        "I don't like you but I don't know how to channel my feelings into that, so I am just going to continue to cry."
    ];
    let cryMessageIndex = 0;
    let moveIndex = 0;
    const movePool = [
        Moves["Wimpy Punch"],
        {
            name: "Cry",
            description: "Battling brings out the best and worst of all of us.",
            process: user => {
                const cryMessage = cryMessages[cryMessageIndex];
                cryMessageIndex = (cryMessageIndex+1) % cryMessages.length;
                const wasCrying = user.state.isCrying;
                user.state.isCrying = true;
                return [{
                    type: "text",
                    text: wasCrying ? `${user.name} continues to cry.` : `${user.name} started crying.`
                },{
                    type: "speech",
                    text: cryMessage
                }]
            }
        }
    ];
    let speechIndex = 0;
    const speeches = [
        "The suffering of elves has gone on long enough!",
        "Battles gives me anxiety!",
        "I really dislike you!",
        "You never even thought about us elves, did you?",
        "Year after year we make your toys and we don't even get so much as a thank you."
    ];
    this.getTurnEvents = () => {
        const move = movePool[moveIndex];
        moveIndex = (moveIndex+1) % movePool.length;
        const speech = speeches[speechIndex];
        speechIndex = (speechIndex+1) % speeches.length;
        return [{
            type: "opponent-move",
            move: move
        },{
            type: "speech",
            text: speech
        }];
    };
    this.load = () => {
        this.self.state.isElf = true;
        this.self.state.liquorHandle = () => [{
            type: "speech",
            text: "Oh. Sorry. I don't drink."
        }]
        this.self.state.submissionHandle = () => {
            return {
                name: "Honorable Suicide",
                description: "It's what the cool kids do.",
                process: user => {
                    user.kill();
                    user.state.killedSelf = true;
                    return [{
                        type: "text",
                        text: `${user.name} commited suicide.`
                    },{
                        type: "speech",
                        text: `Remember kids, suicide is a permanent solution to a temporary problem.`
                    },{
                        type: "speech",
                        text: "You're not alone. Confidential help is available for free."
                    },{
                        type: "speech",
                        text: "For National Suicide Prevention Lifeline, call 1-800-273-8255."
                    }];
                }
            }
        }
    }
}
function WimpyRedElf(battleID) {
    OpponentSequencer.call(this,"wimpy-red-elf",true,null,null,0);
    switch(battleID) {
        case "tumble_showdown":
            WimpyRedElfShowdown.call(this);
            break;
        default:
            throw Error(`'${battleID}' is an invalid battle ID for Wimpy Red Elf`);
    }
}
addOpponent(WimpyRedElf,"wimpy-red-elf");
