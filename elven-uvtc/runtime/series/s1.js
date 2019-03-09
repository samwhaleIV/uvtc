addCardSeries([
    {
        name: "bear necessities",
        type: "attack",
        description: "allows you to attack at the bare minimum",
        energyCost: 0
    },
    {
        name: "closer look",
        type: "generic",
        description: "take a peak at your opponent's hand",
        energyCost: 3
    },
    {
        name: "dimensional shift",
        type: "generic",
        description: "can be used to leave or enter the alternate dimension\n(lasts 3 turns)",
        energyCost: 3,
    },
    {
        name: "endergonic",
        type: "generic",
        description: "remaining actions for this turn cost 0 energy",
        energyCost: 4
    },
    {
        name: "hibernate",
        type: "generic",
        description: "generate 1 health for 3 turns\ndisables card use and attacks",
        energyCost: 1
    },
    {
        name: "honey pot",
        type: "special",
        description: "allows for double damage with bear necessities",
        energyCost: 2,
    },
    {
        name: "red apple",
        description: "an apple a day keeps the doctor away\none health gained per apple",
        type: "generic",
        energyCost: 2
    },
    {
        name: "security blanket",
        description: "1 damage is taken off all incoming attacks",
        type: "defense",
        energyCost: 1
    },
    {
        name: "solar power",
        description: "generates 1 energy at the beginning of every turn",
        type: "special",
        energyCost: 0
    }
],[
    {
        name: "hibernating"
    },
    {
        name: "out of phase"
    }
],{//imagePath,statusImagePath,backFacePath
    imagePath: "cards/s1",
    statusImagePath: "cards/s1-status",
    backFacePath: "cards/s1-backface",
    name: "series 1",
    description: "a tumble woods speciality"
});
