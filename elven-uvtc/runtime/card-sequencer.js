const cardPageTypes = {
    field: Symbol("field"),
    active: Symbol("active"),
    hand: Symbol("hand"),
    status: Symbol("status")
};
const defaultCardPageType = cardPageTypes.active;
function CardSequencer(renderer) {

    this.renderer = renderer;

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
                isNotAButton: true,
            }
        ],
        [
            {
                text: "draw",
                enabled: true,
                image: 4
            },
        ],
        [
            {
                text: "energy",
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
    this.buttonLookup = [];
    let buttonRowIndex = 0
    for(let i = 0;i<this.buttonRows.length;i++) {
        const row = this.buttonRows[i];
        for(let i2 = 0;i2<row.length;i2++) {
            row[i2].index = buttonRowIndex++;
            this.buttonLookup.push(row[i2]);
        }
    }

    this.fullScreenCard = null;
    this.playerTable = {
    };
    this.opponentTable = {
    };

    this.cardPageRenderData = [];
    this.cardPageType = defaultCardPageType;
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
    this.updateCardPageTextOffset("1234567890");


    this.activateNextPage = function() {
        //TODO
    }
    this.activatePreviousPage = function() {
        //TODO
    }

    this.switchedPains = function() {
        //TODO
        //Should set to first page on switch because player and oppon. can have varying numbers of pages
    }

    this.activateActionButton = function(index) {
        //TODO
    }

    this.cardClicked = function(index) {
        //TODO
    }

    const setButtonStates = enabled => {
        for(let i = 0;i<this.buttonLookup.length;i++) {
            this.buttonLookup[i].enabled = enabled;
        }
    }

    this.disableButtons = function() {
        setButtonStates(false);
    }
    this.enableButtons = function() {
        //TODO: This method must make sure to allow the correct buttons only
        setButtonStates(true);
    }

    this.lockInterface = function() {
        this.renderer.lockViewTab();
        this.renderer.lockTextFeedToggle();
        this.renderer.lockPageCycle();
        this.renderer.lockFullScreenCardEscape();
        this.disableButtons();
        //this.renderer.showTextFeed();
    }

    this.unlockInterface = function() {
        this.renderer.unlockViewTab();
        this.renderer.unlockTextFeedToggle();
        this.renderer.unlockPageCycle();
        this.renderer.unlockFullScreenCardEscape();
        this.enableButtons();
        //this.renderer.hideTextFeed();
    }

    this.showFullScreenCard = function(card,withUIAdjustments) {
        if(withUIAdjustments) {
            this.renderer.lockViewTab();
            this.renderer.lockPageCycle();
            this.disableButtons();
        }
        this.fullScreenCard = card;
    }
    this.hideFullScreenCard = function(withUIAdjustments) {
        //TODO: If this is from a [draw action] or something, advance the event stack if there is one
        if(withUIAdjustments) {
            this.renderer.unlockViewTab();
            this.renderer.unlockPageCycle();
            this.enableButtons();
        }
        this.fullScreenCard = null;
    }

    this.getButtonNavigationIndex = function(currentIndex) {
        //TODO: Implement this can call this when are are ready for keyboard support.
        //return null if we go to the right, return the same if no movement.
        return currentIndex;
    }


}
