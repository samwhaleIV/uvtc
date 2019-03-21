addCardSeries([
    {
        name: "dimensional shift",
        type: "generic",
        description: "can be used to leave or enter the alternate dimension\n(lasts 3 turns)",
        energyCost: 3,
        action: (sequencer,user) => {
            if(sequencer.hasCondition(user,"alternate dimension")) {
                sequencer.removeCondition(user,"alternate dimension");
                if(user.isPlayer) {
                    return "you have left the alternate dimension";
                } else {
                    return "opponent has left the alternate dimension";
                }
            } else {
                sequencer.addCondition(user,"alternate dimension");
                if(user.isPlayer) {
                    return "you have entered the alternate dimension";
                } else {
                    return "opponent has entered the alternate dimension";
                }
            }
        }
    },
    {
        name: "violent spell",
        type: "generic",
        description: "does 2 damage ignoring defense slot and conditions but hurts you too"
    },
    {
        name: "n.s.t.a.m.",
        type: "special",
        description: "prevents violent spells being cast against you, fruit poison, and magic eight ball use."
    },
    {
        name: "elfmart bandage",
        type: "generic",
        description: "elfmart makes the best bandages\n+2 health"
    },
    {
        name: "nuclear reactor",
        type: "special",
        description: "+10 energy per turn. requires use of coolant every turn after use or it goes critical and you die"
    },
    {
        name: "coolant",
        type: "generic",
        description: "coolant",
        energyCost: 1
    }
],[
    {
        name: "alternate dimension",
        description: "can only attack and defend against those in the same dimension",
        expirationType: "timed",
        timeToLive: 3,
        filters: [
            {
                type: "outgoingDamage",
                priority: -10000,
                process: (user,target,amount) => {
                    if(!target.hasCondition("alternate dimension")) {
                        return 0;
                    }
                    return amount;
                }
            },
            {
                type: "incomingDamage",
                priority: -10000,
                process: (user,target,amount) => {
                    if(!target.hasCondition("alternate dimension")) {
                        return 0
                    }
                    return amount;
                }
            }
        ]
    }
],{
    description: "hey wait i've seen these before",
    brightBadge: true
});
