import OpponentSequencer from "../opponent-sequencer.js";
import Moves from "../moves.js";

function WimpyGreenElfShowdown() {
    const PUNCH_PROTECTION_STATUS = {
        name: "Punch Protection",
        priority: 200,
        imageID: 3,
        outgoingFilter: (self,target,move) => {
            if(move.name === "Cry") {
                return {
                    directive: "continue",
                    events: [{
                        type: "text",
                        text: "The crying is causing the Punch Protection Amulet to fail!"
                    }]
                }
            }
        },
        incomingFilter: (self,_,move) => {
            if(self.lastMove.name === "Cry") {
                return {
                    directive: "continue",
                    events: [{
                        type: "text",
                        text: "The Punch Protection Amulet failed because of the recent crying."
                    }]
                }
            }
            if(move.isPunch) {
                return {
                    directive: "block",
                    events: [{
                        type: "text",
                        text: "But it failed!"
                    },{
                        type: "text",
                        text: `${self.name} is proteced by the Punch Protection Amulet!`
                    }]
                }
            }
        }
    }
    this.getStartEvents = () => [
        {
            type: "text",
            text: "Heads up, statuses can change the way moves work during battles!"
        },{
            type: "speech",
            text: "Do you really think you stand a chance here?"
        },{
            type: "action",
            process: () => {
                this.self.setStatus(PUNCH_PROTECTION_STATUS);
            }
        },{
            type: "text",
            text: "Wimpy Green Elf used a Punch Protection Amulet."
        },{
            type: "text",
            text: "Wimpy Green Elf is immune to punches while the amulet is active!"
        }
    ];
    this.getPlayerWonEvents = () => [{
        type: "speech",
        text: "It seems I've let elfkind down.. I just get so emotional when I fight."
    }];
    this.getPlayerLostEvents = () => [{
        type: "speech",
        text: "Don't take it personally. I don't just hate you, I hate all those who oppress elves."
    }];
    this.getStalemateEvents = () => [{
        type: "speech",
        text: "It would seem we have reached an impasse."
    }];
    this.getDefaultHealth = () => 6;
    this.getPlayerHealth = () => 6;
    let lastHealth = 6;
    let attackSpeechIndex = 0;
    const hintCryIndex = 3;
    const attackSpeeches = [
        "Looks like I have the upper hand.",
        "I love this amulet. I got it from Elfmart. Elfmart? You've ever been? Come visit some time.",
        "I hope I'm not hurting you.. Wait. Just kidding.",
        "Now this is actually getting kind of sad...",
        "It's a good thing you don't have Return To Sender or any Iced Whiskey. Ha ha."
    ];
    let lostHealthMessageIndex;
    const lostHealthMessages = [
        "You.. You tried to hurt me?",
        "That wasn't very nice.",
        "This is unfair.. and sad.",
        "Alright that's enough crying for now!"
    ];
    const thatsEnoughCryingIndex = lostHealthMessages.length-1;
    this.getTurnEvents = () => {
        const lostHealth = this.self.health !== lastHealth;
        lastHealth = this.self.health;
        if(this.self.state.goingToCry) {
            this.self.state.goingToCry = false;
            return {
                type: "opponent-move",
                move: Moves["Cry"]
            }
        } else if(lostHealth) {
            if(lostHealthMessageIndex === thatsEnoughCryingIndex) {
                lostHealthMessageIndex = 0;
                return [{
                    type: "speech",
                    text: lostHealthMessages[thatsEnoughCryingIndex]
                },{
                    type: "opponent-move",
                    move: Moves["Wimpy Punch"]
                }];
            }
            const message = lostHealthMessages[lostHealthMessageIndex];
            lostHealthMessageIndex++;
            return [{
                type: "speech",
                text: message
            },{
                type: "opponent-move",
                move: Moves["Cry"]
            }]
        } else {
            const speech = attackSpeeches[attackSpeechIndex];
            const shouldHintCry = attackSpeechIndex === hintCryIndex;
            attackSpeechIndex = (attackSpeechIndex+1) % attackSpeeches.length;
            if(shouldHintCry) {
                return [{
                    type: "speech",
                    text: speech
                },{
                    type: "speech",
                    text: ".. here comes the tears :("
                },{
                    type: "opponent-move",
                    move: Moves["Cry"]
                },{
                    type: "speech",
                    text: "Why did they elves have to send me here! I wasn't ready for this!"
                },{
                    type: "speech",
                    text: "I might act tough but it's all an act! I mean, uh, yOuR'e GoInG dOwN."
                }];
            } else {
                return [{
                    type: "speech",
                    text: speech
                },{
                    type: "opponent-move",
                    move: Moves["Wimpy Punch"]
                }];
            }

        }
    };
    this.load = () => {
        this.self.state.liquorHandle = () => {
            this.self.state.goingToCry = true;
            return [{
                type: "speech",
                text: "I don't know if I should drink this.. It might make me emotional."
            }];
        }
        this.self.state.isElf = true;
    }
}
function WimpyGreenElf(battleID) {
    OpponentSequencer.call(this,"wimpy-green-elf",true,null,null,0);
    switch(battleID) {
        case "tumble_showdown":
            WimpyGreenElfShowdown.call(this);
            break;
        default:
            throw Error(`'${battleID}' is an invalid battle ID for Wimpy Green Elf`);
    }
}
addOpponent(WimpyGreenElf,"wimpy-green-elf");
