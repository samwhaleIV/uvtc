addCardSeries([
    {
        name: "nothing",
        description: "absolutely nothing",
        type: "generic",
        energyCost: 0,
        action: () => "nothing happened"
    },
    {
        name: "self destruct",
        description: "proven to be fatal. everyone dies"
    },
    {
        name: "bomb squad",
        type: "special",
        description: "saves you from other people self destructing and timed explosives"
    },
    {
        name: "timed explosive",
        type: "generic",
        description: "arms a bomb that explodes for 50 damage in 2 turns. if the opponent has a bomb squad upon detonation, it is discarded"
    },
    {
        name: "defuse kit",
        type: "generic",
        description: "disarms all timed explosives on the table"
    }
],[

],{
    description: "take nothing seriously"
});
