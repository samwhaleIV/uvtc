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
        ],
        [],
        [
            {
                text: "view my deck",
                enabled: true
            },
            {
                text: "forfeit",
                enabled: true
            }
        ]
    ];
    const buttonLookup = [];
    let buttonRowIndex = 0
    for(let i = 0;i<this.buttonRows.length;i++) {
        const row = this.buttonRows[i];
        for(let i2 = 0;i2<row.length;i2++) {
            row[i2].index = buttonRowIndex++;
            buttonLookup.push(row);
        }
    }

    this.fullScreenCard = null;
    this.playerTable = {
        
    };
    this.opponentTable = {

    };

    this.cardPageText;
    this.cardPageTextScale = 2;
    this.cardPageTextXOffset = 0;
    this.cardPageTextYOffset = 0;

    this.updateCardPageTextOffset = function(text) {
        this.cardPageText = text;
        const textTestResult = drawTextTest(text,this.cardPageTextScale);
        this.cardPageTextXOffset = -Math.floor(textTestResult.width / 2);
        this.cardPageTextYOffset = -Math.floor(textTestResult.height / 2);
    }
    this.updateCardPageTextOffset("page (1 of 3) - active cards");


    this.activateNextPage = function() {
        //Todo
    }
    this.activatePreviousPage = function() {
        //Todo
    }

    this.leftCycleEnabled = true;
    this.rightCycleEnabled = true;

    this.getButtonNavigationIndex = function(currentIndex) {
        //return null if we go to the right, return the same if no movement.
        return currentIndex;
    }

}
