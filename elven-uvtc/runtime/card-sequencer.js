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

const drawButtonText = "draw";
const drawEnergyButtonText = "draw energy";
const attackButtonText = "do attack";
const useButtonText = "use";
const discardButtonText = "discard";
const setAttackText = "attack";
const setDefenseText = "defense";
const setSpecialText = "special";

const defaultCardPageType = cardPageTypes.hand;
const defaultOpponentCardPageType = cardPageTypes.slots;

const defaultActionAmount = 3;

const filterPrioritySort = function(a,b) {
    return (a.filter.priority || 0) < (b.filter.priority || 0) ? 1 : -1
}
const actionPrioritySort = function(a,b) {
    return (a.condition.action.priority || 0) < (b.condition.action.priority || 0) ? 1 : -1
}

const processEnergyAmount = function(target,energyAmount) {
    target.conditionManifest.filters.energy.forEach(filter => {
        energyAmount = filter.process(target,energyAmount);
    });
    return energyAmount;
}
const processActionCount = function(target,actionCount) {
    target.conditionManifest.filters.turnCount.forEach(filter => {
        actionCount = filter.process(target,actionCount);
    });
    return actionCount;
}

const processIncomingDamage = function(user,target,amount) {
    user.conditionManifest.filters.incomingDamage.forEach(filter => {
        amount = filter.process(user,target,amount);
    });
    return amount;
}
const processOutgoingDamage = function(user,target,amount) {
    user.conditionManifest.filters.outgoingDamage.forEach(filter => {
        amount = filter.process(user,target,amount);
    });
    return amount;
}

const processDamage = function(user,target,amount) {
    let damage = processOutgoingDamage(
        user,
        target,
        user.slots.attack.getAttackDamage(
            user,
            target
        )
    );

    damage = processIncomingDamage(
        target,
        user,
        damage
    );

    target.dropHealth(damage);

    return damage;
}

const maxHealth = 100;
const maxEnergy = 100;

function CardSequencer(playerDeck,opponentDeck,opponentSequencer) {

    this.renderer = null;
    this.textFeed = processTextForWrapping("to check to rules hit escape and click 'the rules'\n\n(unless this feature doesn't exist yet)");

    this.turnNumber = 1;

    let lastID = 0;
    this.getConditionID = function() {
        return String(`condition_${lastID++}`);
    }

    this.addCondition = function(target,conditionName,ID,data=null) {
        const condition = statusLookup[conditionName];
        if(!ID) {
            ID = this.getConditionID();
        }
        const conditionWrapper = {
            ID: ID,
            condition: condition,
            conditionData: data,
            startTurn: condition.action ? this.turnNumber + 1 : this.turnNumber
        }
        target.conditionManifest.lookup[ID] = conditionWrapper;
        this.updateConditionManifest(target);
    }
    this.removeCondition = function(target,conditionName) {
        target.conditionManifest.namedLists[conditionName].forEach(conditionWrapper => {
            delete target.conditionManifest.lookup[conditionWrapper.ID];
        });
        this.updateConditionManifest(target);
    }

    this.addHealth = function(target,amount) {
        if(amount) {
            target.health += amount;
            if(target.health > maxHealth) {
                target.health = maxHealth;
            }
            if(target.isPlayer) {
                this.renderer.playerHealthPulse();
                
            } else {
                this.renderer.opponentHealthPulse();
            }
            playSound("heal");
        }
    }
    this.dropHealth = function(target,amount) {
        if(amount) {
            target.health -= amount;
            if(target.health < 0) {
                target.health = 0;
            }
            if(target.isPlayer) {
                this.renderer.playerHealthPulse();
            } else {
                this.renderer.opponentHealthPulse();
            }
            playSound("damage");
        }
    }

    this.addEnergy = function(target,amount) {
        if(amount) {
            target.energy += amount;
            if(target.energy > maxEnergy) {
                target.energy = maxEnergy;
            }
            if(target.isPlayer) {
                this.renderer.playerEnergyPulse();
            } else {
                this.renderer.opponentEnergyPulse();
            }
            playSound("energy");
        }
    }
    this.dropEnergy = function(target,amount) {
        if(amount) {
            target.energy -= amount;
            if(target.energy < 0) {
                target.energy = 0;
            }
            if(target.isPlayer) {
                this.renderer.playerEnergyPulse();
            } else {
                this.renderer.opponentEnergyPulse();
            }
            playSound("energy-reverse");
        }
    }

    this.removeConditionByWrapper = function(target,conditionWrapper) {
        delete target.conditionManifest.lookup[conditionWrapper.ID];
        this.updateConditionManifest(target);
    }

    this.hasCondition = function(target,conditionName) {
        return target.conditionManifest.namedLists[conditionName] ? true : false;
    }
    this.updateConditionManifest = function(target) {

        target.conditions.splice(0);
        target.conditionManifest.list = [];
        target.conditionManifest.namedLists = {};

        target.conditionManifest.startActionable = [];
        target.conditionManifest.byExpire = {
            endOfTurn: [],
            timed: [],
            manual: []
        }
        target.conditionManifest.filters = {
            energy: [],
            turnCount: [],
            outgoingDamage: [],
            incomingDamage: []
        }

        Object.values(target.conditionManifest.lookup).forEach(conditionWrapper => {
            const condition = conditionWrapper.condition;

            if(!condition.hidden) {
                target.conditions.push(condition);
            }

            if(!target.conditionManifest.namedLists[condition.name]) {
                target.conditionManifest.namedLists[condition.name] = [
                    conditionWrapper
                ];
            } else {
                target.conditionManifest.namedLists[condition.name].push(conditionWrapper);
            }

            target.conditionManifest.list.push(conditionWrapper);

            if(condition.expirationType) {
                target.conditionManifest.byExpire[condition.expirationType].push(conditionWrapper);
            }
            if(condition.action) {
                target.conditionManifest.startActionable.push(conditionWrapper);
            }
            if(condition.filters) {
                condition.filters.forEach(filter =>
                    target.conditionManifest.filters[filter.type].push(filter)//{condition:condition,filter:filter}
                );
            }

        });

        target.conditionManifest.filters.energy.sort(filterPrioritySort);
        target.conditionManifest.filters.turnCount.sort(filterPrioritySort);
        target.conditionManifest.startActionable.sort(actionPrioritySort);

    }

    this.playerState = {
        isPlayer: true,
        isOpponent: false,
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
        conditions: [],
        conditionManifest: {lookup: {}},
    };

    this.opponentState = {
        isPlayer: false,
        isOpponent: true,
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
        conditions: [],
        conditionManifest: {lookup:{}}
    };



    this.playerState.hasCondition = conditionName => this.hasCondition(this.playerState,conditionName);
    this.opponentState.hasCondition = conditionName => this.hasCondition(this.opponentState,conditionName);

    this.playerState.addCondition = (conditionName,ID,data) => this.addCondition(this.playerState,conditionName,ID,data);
    this.opponentState.addCondition = (conditionName,ID,data) => this.addCondition(this.opponentState,conditionName,ID,data);

    this.playerState.removeCondition = conditionName => this.removeCondition(this.playerState,conditionName);
    this.opponentState.removeCondition = conditionName => this.removeCondition(this.opponentState,conditionName);


    this.playerState.addEnergy = amount => this.addEnergy(this.playerState,amount);
    this.playerState.dropEnergy = amount => this.dropEnergy(this.playerState,amount);
    this.playerState.addHealth = amount => this.addHealth(this.playerState,amount);
    this.playerState.dropHealth = amount => this.dropHealth(this.playerState,amount);

    this.opponentState.addEnergy = amount => this.addEnergy(this.opponentState,amount);
    this.opponentState.dropEnergy = amount => this.dropEnergy(this.opponentState,amount);
    this.opponentState.addHealth = amount => this.addHealth(this.opponentState,amount);
    this.opponentState.dropHealth = amount => this.dropHealth(this.opponentState,amount);


    this.opponentSequencer = opponentSequencer;

    this.nextButtonShown = false;
    this.nextButtonEnabled = false;

    this.fieldLeftIconText = undefined;
    this.fieldRightIconText = undefined;

    this.playerActionIndex = 0;
    this.maxPlayerActions = 3;

    this.opponentActionIndex = 0;
    this.maxOpponentActions = 0;

    this.isOpponentTurn = false;

    this.updateActionText = function(isPlayerTurn) {
        let text;
        if(!this.isOpponentTurn) {
            text = `action ${this.playerActionIndex+1} of ${this.maxPlayerActions}`;
        } else {
            text = "opponent turn";
        }
        this.buttonLookup[0].text = text;
    }

    this.expireTurnBased = function(target) {
        let expiredText = "";
        target.conditionManifest.byExpire.timed.forEach(conditionWrapper => {
            if(this.turnNumber >= conditionWrapper.startTurn + conditionWrapper.condition.timeToLive) {
                this.removeConditionByWrapper(target,conditionWrapper);
                expiredText += `\n${target.isPlayer?"your":"opponent's"} '${conditionWrapper.condition.name}' status expired.`;
            }
        });
        return expiredText;
    }
    this.expireEndTerminating = function(target) {
        target.conditionManifest.byExpire.endOfTurn.forEach(conditionWrapper => {
            this.removeConditionByWrapper(target,conditionWrapper);
        });
    }

    this.runActionableStatuses = function(target) {
        target.conditionManifest.startActionable.forEach(conditionWrapper => {
            conditionWrapper.condition.action(this,target,conditionWrapper.data);
        });
    }

    this.setToPlayerTurn = function() {
        this.turnNumber++;

        const expirationManifest = this.expireTurnBased(this.playerState);
        this.expireEndTerminating(this.opponentState);

        if(expirationManifest) {
            this.textFeed = [...this.textFeed,"\n",...processTextForWrapping(expirationManifest)];
        }

        if(this.fullScreenStatus) {
            this.hideFullScreenStatus(true);
        }
        if(this.fullScreenCard) {
            this.hideFullScreenCard(true);
        }
        this.playerActionIndex = 0;
        this.maxPlayerActions = processActionCount(
            this.playerState,
            defaultActionAmount
        );
        this.isOpponentTurn = false;
        this.renderer.unlockPageCycle();
        this.renderer.unlockViewTab();
        this.renderer.unlockTextFeedToggle();
        this.updateButtonStates(false);
        this.updateActionText(true);
        this.nextButtonEnabled = false;
        this.nextButtonShown = false;

        this.cardPageType = cardPageTypes.hand;
        this.pageIndex = 0;
        this.viewingSelfCards = true;
        this.updateRendererData();
        this.updateCardPageText();

        this.runActionableStatuses(this.playerState);
        //TODO: append to the current text feed, but do not overwrite ?
    }

    this.setToOpponentTurn = function() {

        const expirationManifest = this.expireTurnBased(this.opponentState);
        this.expireEndTerminating(this.playerState);

        if(this.fullScreenStatus) {
            this.hideFullScreenStatus(true);
        }
        if(this.fullScreenCard) {
            this.hideFullScreenCard(true);
        }

        this.updateActionText(false);
        this.updateButtonStates(true);
        this.renderer.lockPageCycle();
        this.renderer.lockViewTab();
        this.renderer.lockTextFeedToggle();
        this.maxOpponentActions = processActionCount(
            this.opponentState,
            defaultActionAmount
        );
        this.opponentActionIndex = 0;
        this.isOpponentTurn = true;
        this.nextButtonEnabled = true;
        this.nextButtonShown = true;
        this.textFeed = [...this.textFeed,...processTextForWrapping(expirationManifest + "\nplayer turn is over\n\npress [continue] to advance opponent moves")];
        this.renderer.showTextFeed();
        this.cardPageType = cardPageTypes.slots;
        this.pageIndex = 1;
        this.viewingSelfCards = false;
        this.updateRendererData();
        this.updateCardPageText();
        
        this.runActionableStatuses(this.opponentState);
    }

    this.buttonRows = [
        [
            {
                text: "action 1 of 3",
                isNotAButton: true,
            }
        ],
        [
            {
                text: drawButtonText,
                enabled: false,
                image: 4
            },
        ],
        [
            {
                text: drawEnergyButtonText,
                enabled: false
            }
        ],
        [
            {
                text: attackButtonText,
                enabled: false
            }
        ],
        [],
        [
            {
                text: "card actions",
                isNotAButton: true
            }
        ],
        [
            {
                text: useButtonText,
                enabled: false
            },
            {
                text: discardButtonText,
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
                text: setAttackText,
                enabled: false
            }
        ],
        [
            {
                text: setDefenseText,
                enabled: false
            }
        ],
        [
            {
                text: setSpecialText,
                enabled: false
            }
        ]
    ];
    this.buttonLookup = [];
    this.buttonNameLookup = {};
    let buttonRowIndex = 0;
    for(let i = 0;i<this.buttonRows.length;i++) {
        const row = this.buttonRows[i];
        for(let i2 = 0;i2<row.length;i2++) {
            row[i2].index = buttonRowIndex++;
            this.buttonLookup.push(row[i2]);
            this.buttonNameLookup[row[i2].text] = row[i2];
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
        playSound("click");
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
    }
    this.activatePreviousPage = function() {
        playSound("click");
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
    }



    this.switchedPanes = function() {
        playSound("click");
        this.viewingSelfCards = !this.viewingSelfCards;
        this.updateRendererData();
        this.updateCardPageText();
        this.updateButtonStates(false);
    }

    this.updatePlayerSlot = function(name) {
        let actionResultText = "";
        if(this.playerState.slots[name]) {
            if(this.playerState.slots[name].replacedAction) {
                this.playerState.slots[name].replacedAction(this,this.playerState);
            }
            actionResultText = `replaced '${this.playerState.slots[name].name}' with '${this.fullScreenCard.name}'`;
            this.playerState.discardDeck.push(this.playerState.slots[name]);
        } else {
            actionResultText = `set ${name} slot to '${this.fullScreenCard.name}'`;
        }
        this.playerState.slots[name] = this.playerState.hand[this.fullScreenCardIndex];
        if(this.playerState.slots[name].action) {
            this.playerState.slots[name].action(this,this.playerState);
        }
        this.playerState.hand.splice(this.fullScreenCardIndex,1);
        const energyCost = processEnergyAmount(
            this.playerState,
            this.playerState.slots[name].energyCost
        );
        this.dropEnergy(this.playerState,energyCost);
        this.fullScreenCard = null;
        this.renderer.unlockPageCycle();
        this.renderer.unlockViewTab();
        return actionResultText;
    }

    this.updateOpponentSlot = function(name,index) {
        let actionResultText = "";
        if(this.opponentState.slots[name]) {
            if(this.opponentState.slots[name].replacedAction) {
                this.opponentState.slots[name].replacedAction(this,this.opponentState);
            }
            actionResultText = `opponent replaced '${this.opponentState.slots[name].name}' with '${this.opponentState.hand[index].name}'`;
            this.opponentState.discardDeck.push(this.opponentState.slots[name]);
        } else {
            actionResultText = `opponent set ${name} slot to '${this.opponentState.hand[index].name}'`;
        }

        this.opponentState.slots[name] = this.opponentState.hand[index];
        if(this.opponentState.slots[name].action) {
            this.opponentState.slots[name].action(this,this.opponentState);
        }
        this.opponentState.hand.splice(index,1);
        const energyCost = processEnergyAmount(
            this.opponentState,
            this.opponentState.slots[name].energyCost
        );
        this.dropEnergy(this.opponentState,energyCost);
        return actionResultText;     
    }

    this.activateActionButton = function(index) {
        playSound("click");
        let didAction = false;
        let actionResultText = "";
        switch(this.buttonLookup[index].text) {
            case useButtonText:
                const usedCard = this.playerState.hand[this.fullScreenCardIndex];
                const energyCost = processEnergyAmount(this.playerState,usedCard.energyCost);
                this.dropEnergy(this.playerState,energyCost);
                this.playerState.hand.splice(this.fullScreenCardIndex,1);
                actionResultText = `used '${usedCard.name}'`;
                const actionResult = usedCard.action(this,this.playerState,this.opponentState);
                if(actionResult) {
                    actionResultText += "\n" + actionResult;
                    this.renderer.showTextFeed();
                }
                this.fullScreenCard = null;
                this.renderer.unlockPageCycle();
                this.renderer.unlockViewTab();
                didAction = true;
                break;
            case discardButtonText:
                const discardedCard = this.playerState.hand[this.fullScreenCardIndex];
                this.playerState.hand.splice(this.fullScreenCardIndex,1);
                this.playerState.discardDeck.push(discardedCard);
                actionResultText = `discarded '${discardedCard.name}'`;
                this.fullScreenCard = null;
                this.renderer.unlockPageCycle();
                this.renderer.unlockViewTab();
                didAction = true;
                break;
            case setAttackText:
                actionResultText = this.updatePlayerSlot("attack");
                didAction = true;
                break;
            case setDefenseText:
                actionResultText = this.updatePlayerSlot("defense");
                didAction = true;
                break;
            case setSpecialText:
                actionResultText = this.updatePlayerSlot("special");
                didAction = true;
                break;
            case drawButtonText:
                if(this.playerState.usableDeck.length <= 0) {
                    actionResultText = "deck empty. discard pile shuffled.\n";
                    this.playerState.usableDeck = this.playerState.discardDeck;
                    this.playerState.discardDeck = [];
                }
                const index = Math.floor(this.playerState.usableDeck.length*Math.random());
                const newCard = this.playerState.usableDeck[index];
                this.playerState.hand.push(this.playerState.usableDeck[index]);
                this.playerState.usableDeck.splice(index,1);
                actionResultText += `you drew '${newCard.name}' from the deck.`;
                didAction = true;
                break;
            case drawEnergyButtonText:
                this.addEnergy(this.playerState,1);
                this.renderer.playerEnergyPulse();
                playSound("energy");
                actionResultText = "you drew 1 energy.";
                didAction = true;
                break;
            case attackButtonText:
                const damageDone = processDamage(this.playerState,this.opponentState);
                actionResultText = `you did ${damageDone} damage`;
                this.renderer.showTextFeed();
                didAction = true;
                break;
        }
        if(didAction) {
            this.textFeed = processTextForWrapping(
                `action ${
                    this.playerActionIndex+1
                } of ${
                    this.maxPlayerActions
                }\n${
                    actionResultText
                }`
            );
            this.playerActionIndex++;
            if(this.playerActionIndex >= this.maxPlayerActions) {
                this.setToOpponentTurn();
            }
            this.updateActionText();
        }
        this.updateButtonStates(false);
    }

    this.fullScreenCardIndex = -1;

    this.handCardClicked = function(index) {
        if(!this.cardPageRenderData[index]) {
            return;
        }
        playSound("click");
        if(this.viewingSelfCards) {
            this.fullScreenCard = this.cardPageRenderData[index];
            if(this.viewingSelfCards) {
                this.fullScreenCardIndex = index;
                this.renderer.lockPageCycle();
                this.renderer.lockViewTab();
                this.updateButtonStates(false);
                return;
            }
        }
        this.fullScreenCardIndex = -1;
    }

    this.nextNextButtonCard = null;

    this.nextButtonClicked = function() {
        playSound("click");
        if(this.isOpponentTurn) {
            const actionDataResult = opponentSequencer.getActionData(this,this.opponentState);
            if(this.nextNextButtonCard) {
                this.fullScreenCard = this.nextNextButtonCard;
                this.nextNextButtonCard = null;
                this.renderer.hideTextFeed();
                this.renderer.lockFullScreenCardEscape();
                return;
            } else if(this.fullScreenCard) {
                this.fullScreenCard = null;
                if(this.opponentActionIndex >= this.maxOpponentActions) {
                    this.textFeed = [];
                    this.setToPlayerTurn();
                    if(this.textFeed.length < 1) {
                        this.textFeed = processTextForWrapping("opponent turn over");
                    } else {
                        this.textFeed = [
                            ...this.textFeed,...processTextForWrapping("\n\nopponent turn over")
                        ];
                    }
                    this.renderer.showTextFeed();
                    this.renderer.unlockTextFeedToggle();
                    this.renderer.unlockFullScreenCardEscape();
                    return;
                }
            }
            this.nextNextButtonCard = null;
            let textResult = "";
            switch(actionDataResult.type) {
                default:
                    textResult = "opponent did nothing";
                    break;
                case "draw":
                    if(this.opponentState.usableDeck.length <= 0) {
                        textResult = "deck empty. discard pile shuffled.\n";
                        this.opponentState.usableDeck = this.opponentState.discardDeck;
                        this.opponentState.discardDeck = [];
                    }
                    const index = Math.floor(this.opponentState.usableDeck.length*Math.random());
                    const newCard = this.opponentState.usableDeck[index];
                    this.opponentState.hand.push(newCard);
                    this.opponentState.usableDeck.splice(index,1);
                    textResult += `opponent drew a card from the deck.`;
                    break;
                case "drawEnergy":
                    textResult = "opponent drew 1 energy";
                    this.addEnergy(this.opponentState,1);
                    this.renderer.opponentEnergyPulse();
                    playSound("energy");
                    break;
                case "attack":
                    const damageDone = processDamage(this.opponentState,this.playerState);
                    textResult = `opponent did ${damageDone} damage`;
                    break;
                case "use":
                    const usedCard = this.opponentState.hand[actionDataResult.cardIndex];
                    this.nextNextButtonCard = usedCard;
                    const energyCost = processEnergyAmount(this.opponentState,usedCard.energyCost);
                    this.dropEnergy(this.opponentState,energyCost);

                    this.opponentState.hand.splice(actionDataResult.cardIndex,1);
                    textResult = `opponent used '${usedCard.name}'`;
                    const actionResult = usedCard.action(this,this.opponentState,this.playerState);
                    if(actionResult) {
                        textResult += "\n" + actionResult;
                    }
                    break;
                case "discard":
                    if(this.opponentState.hand.length < 1) {
                        textResult = "opponent tried to discard but they have no cards";
                        break;
                    }
                    const discardedCard = this.opponentState.hand[actionDataResult.cardIndex];
                    this.nextNextButtonCard = discardedCard;

                    this.opponentState.hand.splice(actionDataResult.card,1);
                    this.opponentState.discardDeck.push(discardedCard);
                    textResult = `opponent discarded '${discardedCard.name}'`;
                    break;
                case "setAttack":
                    this.nextNextButtonCard = this.opponentState.hand[actionDataResult.cardIndex];
                    textResult = this.updateOpponentSlot("attack",actionDataResult.cardIndex);
                    break;
                case "setDefense":
                    this.nextNextButtonCard = this.opponentState.hand[actionDataResult.cardIndex];
                    textResult = this.updateOpponentSlot("defense",actionDataResult.cardIndex);
                    break;
                case "setSpecial":
                    this.nextNextButtonCard = this.opponentState.hand[actionDataResult.cardIndex];
                    textResult = this.updateOpponentSlot("special",actionDataResult.cardIndex);
                    break;
            }

            this.textFeed = processTextForWrapping(
                `action ${
                    this.opponentActionIndex+1
                } of ${
                    this.maxOpponentActions
                }\n${
                    textResult
                }`
            );

            this.opponentActionIndex++;

            if(!this.nextNextButtonCard) {
                if(this.opponentActionIndex >= this.maxOpponentActions) {
                    this.setToPlayerTurn();
                    this.textFeed = [
                        ...this.textFeed,...processTextForWrapping("\n\nopponent turn over")
                    ];
                }
            } else {
                this.renderer.lockTextFeedToggle();
            }

            this.renderer.showTextFeed();
        }
    }

    this.setButtonStatesLogical = function() {
        this.buttonNameLookup[drawButtonText].enabled = this.playerState.hand.length < 6;
        this.buttonNameLookup[attackButtonText].enabled = this.playerState.slots.attack ? true : false;
        this.buttonNameLookup[drawEnergyButtonText].enabled = this.playerState.energy < 100;

        this.buttonNameLookup[useButtonText].enabled = false;
        this.buttonNameLookup[discardButtonText].enabled = false;

        this.buttonNameLookup[setAttackText].enabled = false;
        this.buttonNameLookup[setDefenseText].enabled = false;
        this.buttonNameLookup[setSpecialText].enabled = false;
    }

    this.updateButtonStates = function(disableAll) {
        if(disableAll || this.isOpponentTurn) {
            for(let i = 0;i<this.buttonLookup.length;i++) {
                this.buttonLookup[i].enabled = false
            }
        } else {
            if(this.viewingSelfCards) {
                if(this.fullScreenCard && this.cardPageType === cardPageTypes.hand) {
                    this.buttonNameLookup[setAttackText].enabled = false;
                    this.buttonNameLookup[setDefenseText].enabled = false;
                    this.buttonNameLookup[setSpecialText].enabled = false;

                    this.buttonNameLookup[drawButtonText].enabled = this.playerState.hand.length < 6;
                    this.buttonNameLookup[attackButtonText].enabled = this.playerState.slots.attack ? true : false;
                    this.buttonNameLookup[drawEnergyButtonText].enabled = this.playerState.energy < 100;

                    this.buttonNameLookup[useButtonText].enabled = false;

                    const playerHasEnoughEnergy = this.playerState.energy >= processEnergyAmount(
                        this.playerState,
                        this.fullScreenCard.energyCost
                    );

                    switch(this.fullScreenCard.type) {
                        case "attack":
                            this.buttonNameLookup[setAttackText].enabled = playerHasEnoughEnergy;
                            break;
                        case "defense":
                            this.buttonNameLookup[setDefenseText].enabled = playerHasEnoughEnergy;
                            break;
                        case "special":
                            this.buttonNameLookup[setSpecialText].enabled = playerHasEnoughEnergy;
                            break;
                        default:
                            this.buttonNameLookup[useButtonText].enabled = playerHasEnoughEnergy;
                            break;
                    }
                    this.buttonNameLookup[discardButtonText].enabled = true;
                } else {
                    this.setButtonStatesLogical();
                }
            } else {
                this.setButtonStatesLogical();
            }
        }
    }

    
    this.hideFullScreenCard = function(internal) {
        if(!internal) {
            playSound("reverse-click");
        }
        this.fullScreenCard = null;
        this.renderer.unlockPageCycle();
        this.renderer.unlockViewTab();
        this.updateButtonStates(false);
    }

    this.slotCardClicked = function(index) {
        if(!this.cardPageRenderData[index]) {
            return;
        }
        playSound("click");
        this.fullScreenCard = this.cardPageRenderData[index];
        this.renderer.lockPageCycle();
        this.renderer.lockViewTab();
        this.updateButtonStates(false);
    }
    
    this.statusClicked = function(index) {
        playSound("click");
        const condition = this.viewingSelfCards ? this.playerState.conditions[index] : this.opponentState.conditions[index];
        if(condition) {
            this.fullScreenStatus = condition;
            this.renderer.lockPageCycle();
            this.renderer.lockViewTab();
            this.updateButtonStates(false);
        }
    }
    this.hideFullScreenStatus = function(internal) {
        if(!internal) {
            playSound("reverse-click");
        }
        this.fullScreenStatus = null;
        this.renderer.unlockViewTab();
        this.renderer.unlockPageCycle();
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
    this.updateConditionManifest(this.playerState);
    this.updateConditionManifest(this.opponentState);

    this.updateCardPageText();
    this.updateRendererData();
    this.updateButtonStates(false);

}
