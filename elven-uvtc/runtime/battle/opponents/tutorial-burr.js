import OpponentSequencer from "../opponent-sequencer.js";
function BurrTheBrute() {
    OpponentSequencer.call(this,"burr",false,"auto","auto",0.5);
    this.getStartEvents = () => [
        {
            type: "speech",
            text: "Uhh, go easy on me, I'm a little bit drunk."
        }
    ];
    this.getPlayerWonEvents = battleOutput => [{
        type: "speech",
        text: "Well, you've got a long road ahead of you, kid."
    },{
        type: "speech",
        text: "But I know that with the newly found confidence of being able to punch a drunk ice cream cone man, you'll make it far."
    }];
    this.getPlayerLostEvents = battleOutput => [{
        type: "speech",
        text: "Uhhhh you lost? Seriously? No... Seriously? Maybe you're not cut out for this battling thing... Yikes."
    }];
    this.getStalemateEvents = battleOutput => [{
        type: "speech",
        text: "Congratulations, you managed to tie at the easiest battle in the game!"
    }];
    this.getDefaultHealth = () => 3;

    let noticedYouUsedNone = false;
    let noneIndex = 0;

    const youKeepUsingNone = [
        "Uh, you used 'None' again. That's not a real move! Please stop doing this!",
        "Just punch me already!",
        "WHY ARE YOU DEFYING ME!",
        "I didn't ask to be here!",
        "I'm just supposed to help you learn but it SEEMS YOU THINK YOU HAVE IT ALL FIGURED OUT.",
        "I just want to go back to the tavern and drink, I don't have time for this.",
        "Please. Finish. This. Pleaseeeeeeee.",
        "I'm starting not to like you very much!"
    ].map(speechEventMap);

    const gotWimped = [
        "Yeah, that's it. Wimpy punch. Kinda wimpy... but it gets the job done.",
        "You're really getting the hang of it, dude!",
        "Aghhhhh, you did it. *sniffs*\nI'm so proud of you.",
        "Only I, Burr, know the true power of Wimpy Punch.",
        "You dare heal me just so that you continue using Wimpy Punch?",
        "What are you, a sadist?"
    ].map(speechEventMap);
    let wimpedIndex = 0;

    this.getTurnEvents = () => {
        const lastMove = this.player.lastMove.name;
        if(lastMove === "None") {
            if(noticedYouUsedNone) {
                const event = youKeepUsingNone[noneIndex];
                noneIndex = (noneIndex + 1) % youKeepUsingNone.length;
                return event;
            } else {
                noticedYouUsedNone = true;
                return [
                    {
                        type: "speech",
                        text: "Uh, maybe try using your Wimpy Punch? It's a malice move."
                    }
                ];
            }
        } else if(lastMove === "Iced Whiskey") {
            return [
                {
                    type: "text",
                    text: "Burr looks like they appreciated that"
                },
                {
                    type: "speech",
                    text: "Hey! You remembered the Iced Whiskey we gave you earlier!"
                },
                {
                    type: "speech",
                    text: "You're still the true MVP, nameless hero."
                }
            ]
        } else if(lastMove === "Wimpy Punch") {
            const event = gotWimped[wimpedIndex];
            wimpedIndex = (wimpedIndex + 1) % gotWimped.length;
            return event;
        } else {
            return [{
                type: "speech",
                text: "That's not what I expected you to use, but whatever works for you I guess."
            },{
                type: "speech",
                text: "I just want to go home..."
            }];
        }
    };
}
addOpponent(BurrTheBrute,"tutorial-burr");
