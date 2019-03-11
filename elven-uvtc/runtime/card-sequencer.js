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
            return `${isPlayer?"your":"their"} conditions`;
    }
}
const getPageTypeFromIndex = function(index) {
    switch(index) {
        default:
            console.error("Invalid index for card page types!");
            return cardPageTypes.hand;
        case 0:
            return cardPageTypes.hand;
        case 1:
            return cardPageTypes.slots;
        case 2:
            return cardPageTypes.field;
    }
}

const defaultCardPageType = cardPageTypes.hand;
const defaultOpponentCardPageType = cardPageTypes.slots;
function CardSequencer(playerDeck,opponentDeck,opponentSequencer) {

    this.renderer = null;
    this.textFeed = processTextForWrapping( "this is a test yeeeeeeeeeeeeeeeeeet here's some new lines... fuck my ass.\n\nif the word is too long for one line we have no way of breaking it into it's own lines. woops" );

    this.playerState = {
        health: 6,
        energy: 6,
        fullDeck: playerDeck,
        discardDeck: [],
        usableDeck: [...playerDeck],
        hand: [],
        slots: {
            defense: null,
            attack: null,
            special: null
        },
        conditions: []
    };

    this.opponentState = {
        health: 6,
        energy: 6,
        fullDeck: opponentDeck,
        discardDeck: [],
        usableDeck: [...opponentDeck],
        hand: [],
        slots: {
            defense: null,
            attack: null,
            special: null
        },
        conditions: []
    };
    this.opponentSequencer = opponentSequencer;

    this.nextButtonShown = false;
    this.nextButtonEnabled = false;

    this.fieldLeftIconText = undefined;
    this.fieldRightIconText = undefined;

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
                text: "shuffle ",
                enabled: true,
                //image: 6
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

    this.fullScreenStatus = null;
    this.fullScreenCard = null;

    this.cardPageType = defaultCardPageType;
    this.cardPageText;
    this.cardPageTextScale = 2;
    this.cardPageTextXOffset = 0;
    this.cardPageTextYOffset = 0;

    this.pageIndex = 0;

    this.updateCardPageText = function(customText=null) {
        const text = customText !== null ? customText : `page ${this.pageIndex+1} of 3 - ${
            getCardPageName(this.cardPageType,this.viewingSelfCards)
        }`;
        this.cardPageText = text;
        const textTestResult = drawTextTest(text,this.cardPageTextScale);
        this.cardPageTextXOffset = -Math.floor(textTestResult.width / 2);
        this.cardPageTextYOffset = -Math.floor(textTestResult.height / 2);
    }

    this.opponentCardsVisible = false;
    this.viewingSelfCards = true;


    //this.renderer.showTextFeed();
    //this.renderer.hideTextFeed();

    this.lockInterface = function() {
        this.renderer.lockViewTab();
        this.renderer.lockTextFeedToggle();
        this.renderer.lockPageCycle();
        this.renderer.lockFullScreenCardEscape();
    }

    this.unlockInterface = function() {
        this.renderer.unlockViewTab();
        this.renderer.unlockTextFeedToggle();
        this.renderer.unlockPageCycle();
        this.renderer.unlockFullScreenCardEscape();
    }


    this.updateRendererData = function() {
        const state = this.viewingSelfCards ? this.playerState : this.opponentState;
        switch(this.cardPageType) {
            case cardPageTypes.hand:
                this.cardPageRenderData = state.hand;
                break;
            case cardPageTypes.slots:
                this.cardPageRenderData = [
                    state.slots.defense,
                    state.slots.attack,
                    state.slots.special
                ];
                break;
            case cardPageTypes.field:
                this.fieldLeftIconText = `deck - ${state.usableDeck.length}`;
                this.fieldRightIconText = `discarded - ${state.discardDeck.length}`;
                this.cardPageRenderData = state.conditions;
                break;
        }
    }

    this.activateNextPage = function() {
        switch(this.pageIndex) {
            case 0:
                this.pageIndex = 1;
                break;
            case 1:
                this.pageIndex = 2;
                break;
            case 2:
                this.pageIndex = 0;
                break;
        }
        this.cardPageType = getPageTypeFromIndex(this.pageIndex);
        this.updateRendererData();
        this.updateCardPageText();
        //TODO
    }
    this.activatePreviousPage = function() {
        switch(this.pageIndex) {
            case 0:
                this.pageIndex = 2;
                break;
            case 1:
                this.pageIndex = 0;
                break;
            case 2:
                this.pageIndex = 1;
                break;
        }
        this.cardPageType = getPageTypeFromIndex(this.pageIndex);
        this.updateRendererData();
        this.updateCardPageText();
        //TODO
    }



    this.switchedPanes = function() {
        this.viewingSelfCards = !this.viewingSelfCards;
        this.updateRendererData();
        this.updateCardPageText();
        //TODO
        //Should set to first page on switch because player and oppon. can(? might not do that) have varying numbers of pages
    }

    this.activateActionButton = function(index) {
        //TODO
    }

    this.handCardClicked = function(index) {
        if(this.viewingSelfCards) {
            this.fullScreenCard = this.cardPageRenderData[index];
            this.renderer.lockPageCycle();
            this.renderer.lockViewTab();
            this.updateButtonStates(true);
        }
    }

    this.nextButtonClicked = function() {
        //TODO
    }

    this.updateButtonStates = function(disableAll) {
        if(disableAll) {
            for(let i = 0;i<this.buttonLookup.length;i++) {
                this.buttonLookup[i].enabled = false;
            }
        } else {
            //TODO
        }
    }

    
    this.hideFullScreenCard = function() {
        //Only called through the renderer
        this.fullScreenCard = null;
        this.renderer.unlockPageCycle();
        this.renderer.unlockViewTab();
        this.updateButtonStates(false);
    }

    this.hideFullScreenStatus = function() {
        //Only called through the renderer
        this.fullScreenStatus = null;
    }
    
    this.statusClicked = function(index) {

    }

    this.slotCardClicked = function(index) {

    }

    for(let i = 0;i<6;i++) {
        if(this.playerState.usableDeck.length>0) {
            const cardIndex = Math.floor(this.playerState.usableDeck.length*Math.random());
            this.playerState.hand.push(this.playerState.usableDeck[cardIndex]);
            this.playerState.usableDeck.splice(cardIndex,1);
        }
        if(this.opponentState.usableDeck.length>0) {
            const cardIndex = Math.floor(this.opponentState.usableDeck.length*Math.random());
            this.opponentState.hand.push(this.opponentState.usableDeck[cardIndex]);
            this.opponentState.usableDeck.splice(cardIndex,1);
        }
    }


    this.updateCardPageText();
    this.updateRendererData();

}
