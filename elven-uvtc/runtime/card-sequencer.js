const cardPageTypes = {
    slots: Symbol("slots"),
    hand: Symbol("hand"),
    field: Symbol("field")
};
const getCardPageName = function(cardPageType,isPlayer) {
    switch(cardPageType) {
        default:
            return "unknown page";
        case cardPageTypes.slots:
            return `${isPlayer?"your":"their"} slots`;
        case cardPageTypes.hand:
            return `${isPlayer?"your":"their"} hand`;
        case cardPageTypes.field:
            return "conditions and field";//This is a global page
    }
}
const defaultCardPageType = cardPageTypes.hand;
const defaultOpponentCardPageType = cardPageTypes.slots;
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
                enabled: false,
                image: 4
            },
        ],
        [
            {
                text: "draw energy",
                enabled: true,
                image: 1
            }
        ],
        [
            {
                text: "deck check",
                enabled: true
            }
        ],
        [],
        [
            {
                text: "card actions",
                isNotAButton: true,  
            }
        ],
        [
            {
                text: "use",
                enabled: false
            },
            {
                text: "discard",
                enabled: false
            },
        ],
        [],
        [
            {
                text: "set slot cards",
                isNotAButton: true,
            }
        ],
        [
            {
                text: "attack",
                enabled: false
            }
        ],
        [
            {
                text: "defense",
                enabled: false
            }
        ],
        [
            {
                text: "special",
                enabled: false
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

    this.cardPageRenderData = allCardsList.slice(0,6);//DEBUG

    this.cardPageType = defaultCardPageType;
    this.cardPageText;
    this.cardPageTextScale = 2;
    this.cardPageTextXOffset = 0;
    this.cardPageTextYOffset = 0;

    this.updateCardPageTextOffset = function(text) {
        //This can and probably should be refactored into the renderer but the benefits aren't that great
        this.cardPageText = text;
        const textTestResult = drawTextTest(text,this.cardPageTextScale);
        this.cardPageTextXOffset = -Math.floor(textTestResult.width / 2);
        this.cardPageTextYOffset = -Math.floor(textTestResult.height / 2);
    }

    this.viewingSelfCards = true;

    this.updateCardPageTextOffset(`page 1 of 3 - ${getCardPageName(this.cardPageType,true)}`);


    this.activateNextPage = function() {
        //TODO
    }
    this.activatePreviousPage = function() {
        //TODO
    }

    this.switchedPanes = function() {
        this.viewingSelfCards = !this.viewingSelfCards;
        //TODO
        //Should set to first page on switch because player and oppon. can(? might not do that) have varying numbers of pages
    }

    this.activateActionButton = function(index) {
        //TODO
    }

    this.handCardClicked = function(index) {
        this.showFullScreenCard(this.cardPageRenderData[index],true);
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
