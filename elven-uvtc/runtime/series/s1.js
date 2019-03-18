addCardSeries([
    {
        name: "bear necessities",
        type: "attack",
        description: "allows you to attack at the bare minimum: 1 damage",
        energyCost: 0,
        getAttackDamage: (user,target) => 1
    },
    {
        name: "closer look",
        type: "generic",
        description: "get a list of your opponent's current cards",
        energyCost: 3,
        action: (sequencer,user) => {
            if(user.isPlayer) {
                sequencer.renderer.showTextFeed();
                return `\nopponent cards:\n${sequencer.opponentState.hand.map(card=>card.name).join("\n")}`;
            }
        }
    },
    {
        name: "endergonic",
        type: "generic",
        description: "remaining actions for this turn cost 0 energy",
        energyCost: 4,
        action: (sequencer,user) => {
            sequencer.addCondition(user,"free energy");
            return "free energy for the rest of the turn!";
        }
    },
    {
        name: "hibernate",
        type: "generic",
        description: "generate 1 health for 3 turns",
        energyCost: 1,
        action: (sequencer,user) => {
            sequencer.addCondition(user,"hibernating");
        }
    },
    {
        name: "honey pot",
        type: "special",
        description: "allows for double damage with bear necessities",
        energyCost: 2,
        action: function(sequencer,user) {
            sequencer.addCondition(user,"honey pot status");
        },
        replacedAction: function(sequencer,user) {
            sequencer.removeCondition(user,"honey pot status");
        }
    },
    {
        name: "red apple",
        description: "an apple a day keeps the doctor away\n+one health",
        type: "generic",
        energyCost: 2,
        action: function(sequencer,user) {
            sequencer.addHealth(user,1);
            return "+1 health";
        }
    },
    {
        name: "security blanket",
        description: "1 damage is taken off all incoming attacks",
        type: "defense",
        energyCost: 1,
        action: function(sequencer,user) {
            sequencer.addCondition(user,"security blanket status");
        },
        replacedAction: function(sequencer,user) {
            sequencer.removeCondition(user,"security blanket status");
        }
    },
    {
        name: "solar power",
        description: "generates 1 energy at the beginning of every turn",
        type: "special",
        energyCost: 0,
        action: function(sequencer,user) {
            sequencer.addCondition(user,"solar power status");
        },
        replacedAction: function(sequencer,user) {
            sequencer.removeCondition(user,"solar power status");
        }
    },
    {
        name: "green apple",
        description: "green apples are better than red apples\n+2 energy",
        type: "generic",
        energyCost: 0,
        action: (sequencer,user) => {
            user.addEnergy(2);
        }
    },
    {
        name: "golden apple",
        type: "generic",
        description: "worth its weight in gold"
    },
    {
        name: "poison apple",
        type: "generic",
        energyCost: 3,
        description: "inflicts opponent with poison that lasts 2 turns",
        action: (sequencer,user,target) => {
            target.addCondition("poisoned by fruit");
        }
    },
    {
        name: "alchemist",
        type: "generic",
        description: "if you have a golden apple in your hand it turns into +5 health",
    },
    {
        name: "apple pie",
        type: "generic",
        description: "each apple in your hand deals 1 damage"
    }
],[
    {
        name: "hibernating",
        description: "generating 1 health at the beginning of every turn",
        expirationType: "timed",
        timeToLive: 3,
        action: (sequencer,user,data) => {
            sequencer.addHealth(user,1);
            return `${user.name} got +1 health from hibernating`;
        }
    },
    {
        name: "honey pot status",
        hidden: true,
        expirationType: "manual",
        filters: [
            {
                type: "outgoingDamage",
                priority: -100,
                process: (user,target,amount) => {
                    if(user.slots.attack && user.slots.attack.name === "bear necessities") {
                        return amount * 2;
                    }
                    return amount;
                }
            }
        ]
    },
    {
        name: "security blanket status",
        hidden: true,
        expirationType: "manual",
        filters: [
            {
                type: "incomingDamage",
                priority: -100,
                process: (user,target,amount) => amount - 1
            }
        ]
    },
    {
        name: "solar power status",
        hidden: true,
        action: (sequencer,user) => {
            sequencer.addEnergy(user,1);
            return `${user.name} got 1 energy from solar power` 
        }
    },
    {
        name: "free energy",
        expirationType: "endOfTurn",
        description: "energy costs are reduced to 0 until the end of this turn",
        filters: [
            {
                type: "energyCost",
                priority: -200,
                process: () => 0
            }
        ]
    },
    {
        name: "poisoned by fruit",
        expirationType: "timed",
        timeToLive: 2,
        description: "fruit is evil and it will hurt you. 1 damage every turn. ouch!",
        action: (sequencer,inflicted) => {
            inflicted.dropHealth(1);
            if(inflicted.isPlayer) {
                return "you are hurt by fruit poison";
            } else {
                return "opponent is hurt by fruit poison";
            }
        }
    }
],{
    description: "a tumble woods speciality"
});
