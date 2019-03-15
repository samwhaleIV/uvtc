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
    description: "hey wait i've seen these before"
});
