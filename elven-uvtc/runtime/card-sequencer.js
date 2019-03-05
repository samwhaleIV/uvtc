function CardSequencer() {

    this.playerState = {
        health: 6,
        energy: 0
    };

    this.opponentState = {
        health: 6,
        energy: 0
    };


    this.buttonRows = [
        [
            {
                text: "action 1 of 3",
                isNotAButton: true
            }
        ],
        [
            {
                text: "draw",
                enabled: true
            },
        ],
        [
            {
                text: "draw energy",
                enabled: true
            },
            {
                text: "discard",
                enabled: true
            },
        ],
        [],
        [
            {
                text: "set attack",
                enabled: false,
            },
            {
                text: "set defense",
                enabled: false,
            },
        ],
        [
            {
                text: "set special",
                enabled: false,
            },
        ],
        [
            {
                text: "attack",
                enabled: false
            }
        ]
    ];
    let buttonRowIndex = 0
    for(let i = 0;i<this.buttonRows.length;i++) {
        const row = this.buttonRows[i];
        for(let i2 = 0;i2<row.length;i2++) {
            row[i2].index = buttonRowIndex++;
        }
    }

}
