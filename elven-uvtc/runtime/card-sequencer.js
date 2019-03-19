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

const handLimit = 6;
const startHealth = 6;
const startEnergy = 6;
const maxHealth = 100;
const maxEnergy = 100;
const defaultActionCount = 3;

const drawButtonText = "draw";
const drawEnergyButtonText = "draw energy";
const attackButtonText = "attack";
const useButtonText = "use";
const discardButtonText = "discard";
const setSlotText = "set slot";

const defaultCardPageType = cardPageTypes.hand;
const defaultOpponentCardPageType = cardPageTypes.slots;

const filterPrioritySort = function(a,b) {
    return (a.filter.priority || 0) < (b.filter.priority || 0) ? 1 : -1
}
const actionPrioritySort = function(a,b) {
    return (a.condition.actionPriority || 0) < (b.condition.actionPriority || 0) ? 1 : -1
}

//Opponent move table (O.M.T.)
const OMT = {
    drawCard: 0,
    drawEnergy: 1,
    useCard: 2,
    discardCard: 3,
    attack: 4,
    setAttack: 5,
    setDefense: 6,
    setSpecial: 7
}

const zeroClamp = function(value) {
    if(value < 0) {
        return 0;
    }
    return value;
}
const oneClamp = function(value) {
    if(value < 1) {
        return 1;
    }
    return value;
}

const filterTypes = {
    outgoingDamage: {
        clamp:zeroClamp
    },
    incomingDamage: {
        clamp:zeroClamp
    },
    turnCount: {
        clamp:oneClamp
    },
    energyCost: {
        clamp:zeroClamp
    },
    energyDraw: {
        clamp:oneClamp
    }
}

const accumulateFilters = function(type,target,value) {
    const theSuperFilterForFilters = filterTypes[type].clamp;
    target.conditionManifest.filters[type].forEach(filterSet => {
        const filter = filterSet.filter;
        value = filter.process(target,value,filterSet.conditionWrapper.data);
        value = theSuperFilterForFilters(value);
    });
    return value;
}
const accumulateDamageFilters = function(type,user,target,damage) {
    const theSuperFilterForFilters = filterTypes[type].clamp;
    target.conditionManifest.filters[type].forEach(filterSet => {
        const filter = filterSet.filter;
        damage = filter.process(user,target,damage,filterSet.conditionWrapper.data);
        damage = theSuperFilterForFilters(damage);
    });
    return damage;
}

const processDamage = function(user,target) {
    let damage = accumulateDamageFilters("outgoingDamage",
        user,
        target,
        user.slots.attack.getAttackDamage(
            user,
            target
        )
    );

    damage = accumulateDamageFilters("incomingDamage",
        target,
        user,
        damage
    );

    target.dropHealth(damage);

    return damage;
}

function CardSequencer(playerDeck,opponentDeck,opponentSequencer) {

    this.renderer = null;
    this.textFeed = processTextForWrapping("to check the rules hit escape and click 'the rules'\n\n(unless this feature doesn't exist yet)\n\n");

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

        let turnCount;
        if(condition.action && !condition.filters) {
            turnCount = 0;
        } else if(condition.filters && !condition.action) {
            turnCount = 1;
        } else if(condition.filters && condition.action) {
            turnCount = 1;
        } else {
            turnCount = 0;
        }

        const conditionWrapper = {
            ID: ID,
            condition: condition,
            data: data,
            turnCount: turnCount
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
        if(amount < 0) {
            this.dropHealth(target,-amount);
        }
        if(amount) {
            target.health += amount;
            if(target.health > maxHealth) {
                target.health = maxHealth;
            }
            let shouldPlaySound;
            if(target.isPlayer) {
                shouldPlaySound = this.renderer.playerHealthPulse();
                
            } else {
                shouldPlaySound = this.renderer.opponentHealthPulse();
            }
            if(shouldPlaySound) {
                playSound("heal");
            }
        }
    }
    this.dropHealth = function(target,amount) {
        if(amount < 0) {
            this.addHealth(target,-amount);
        }
        if(amount) {
            target.health -= amount;
            if(target.health < 0) {
                target.health = 0;
            }
            let shouldPlaySound;
            if(target.isPlayer) {
                shouldPlaySound = this.renderer.playerHealthPulse();
            } else {
                shouldPlaySound = this.renderer.opponentHealthPulse();
            }
            if(shouldPlaySound) {
                playSound("damage");
            }
        }
    }

    this.addEnergy = function(target,amount,fromClick) {
        if(amount < 0) {
            this.addEnergy(target,-amount);
        }
        if(amount) {
            target.energy += amount;
            if(target.energy > maxEnergy) {
                target.energy = maxEnergy;
            }
            let shouldPlaySound;
            if(target.isPlayer) {
                shouldPlaySound = this.renderer.playerEnergyPulse();
            } else {
                shouldPlaySound = this.renderer.opponentEnergyPulse();
            }
            if(shouldPlaySound || fromClick) {
                playSound("energy");
            }
        }
    }
    this.dropEnergy = function(target,amount) {
        if(amount < 0) {
            this.addEnergy(target,-amount);
        }
        if(amount) {
            target.energy -= amount;
            if(target.energy < 0) {
                target.energy = 0;
            }
            let shouldPlaySound;
            if(target.isPlayer) {
                shouldPlaySound = this.renderer.playerEnergyPulse();
            } else {
                shouldPlaySound = this.renderer.opponentEnergyPulse();
            }
            if(shouldPlaySound) {
                playSound("energy-reverse");
            }
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

        target.conditionManifest.filters = {};
        Object.keys(filterTypes).forEach(filterName => {
            target.conditionManifest.filters[filterName] = [];
        });
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
                    target.conditionManifest.filters[filter.type].push({conditionWrapper:conditionWrapper,filter:filter})
                );
            }

        });

        Object.values(target.conditionManifest.filters).forEach(filterBundle => {
            filterBundle.sort(filterPrioritySort);
        });
        target.conditionManifest.startActionable.sort(actionPrioritySort);
    }

    this.playerState = {
        name: "you",
        isPlayer: true,
        isOpponent: false,
        health: startHealth,
        energy: startEnergy,
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
        name: "opponent",
        isPlayer: false,
        isOpponent: true,
        health: startHealth,
        energy: startEnergy,
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

    this.playerState.sequencer = this;
    this.opponentState.sequencer = this;

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
    this.maxPlayerActions = defaultActionCount;

    this.opponentActionIndex = 0;
    this.maxOpponentActions = 0;

    this.isOpponentTurn = false;


    this.updateActionText = function() {
        let text;
        if(!this.isOpponentTurn) {
            text = `turn ${this.turnNumber} - action ${this.playerActionIndex+1} of ${this.maxPlayerActions}`;
        } else {
            text = `turn ${this.turnNumber} - opponent turn`;
        }
        this.buttonLookup[0].text = text;
    }

    this.updateTurnText = this.updateActionText;

    this.expireTurnBased = function(target) {
        let expiredText = "";
        target.conditionManifest.byExpire.timed.forEach(conditionWrapper => {
            if(++conditionWrapper.turnCount > conditionWrapper.condition.timeToLive) {
                this.removeConditionByWrapper(target,conditionWrapper);
                if(!conditionWrapper.condition.hiddenExpiration) {
                    expiredText += `${target.isPlayer?"your":"opponent's"} '${conditionWrapper.condition.name}' status expired.\n`;
                }
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
        let result = "";
        if(!target.conditionManifest.startActionable.length) {
            return null;
        }
        target.conditionManifest.startActionable.forEach(conditionWrapper => {
            const actionResult = conditionWrapper.condition.action(this,target,conditionWrapper.data);
            if(actionResult) {
                result += `${actionResult}.\n`;
            }
        });
        return result;
    }

    this.setToPlayerTurn = function() {
        this.turnNumber++;
        this.updateTurnText();

        const expirationManifest = this.expireTurnBased(this.playerState);
        this.expireEndTerminating(this.opponentState);

        if(expirationManifest) {
            this.textFeed = [...this.textFeed,...processTextForWrapping(expirationManifest)];
            this.renderer.showTextFeed();
        }

        if(this.fullScreenStatus) {
            this.hideFullScreenStatus(true);
        }
        if(this.fullScreenCard) {
            this.hideFullScreenCard(true);
        }
        this.playerActionIndex = 0;
        this.maxPlayerActions = accumulateFilters("turnCount",
            this.playerState,
            defaultActionCount
        );
        this.isOpponentTurn = false;
        this.renderer.unlockPageCycle();
        this.renderer.unlockViewTab();
        this.renderer.unlockTextFeedToggle();
        this.updateButtonStates(false);
        this.updateActionText();
        this.nextButtonEnabled = false;
        this.nextButtonShown = false;

        this.cardPageType = cardPageTypes.hand;
        this.pageIndex = 0;
        this.viewingSelfCards = true;
        this.updateRendererData();
        this.updateCardPageText();

        const actionResultText = this.runActionableStatuses(this.playerState);
        if(actionResultText) {
            if(this.textFeed.length) {
                this.textFeed = [...this.textFeed,...processTextForWrapping(actionResultText)];
            } else {
                this.textFeed = processTextForWrapping(actionResultText);
            }
            this.renderer.showTextFeed();
        }
    }

    this.skipRemainingActions = function() {
        if(this.isOpponentTurn) {
            if(this.opponentActionIndex + 1 >= this.maxOpponentActions) {
                return;
            }
            this.setToPlayerTurn();
            this.textFeed = [...this.textFeed,...processTextForWrapping("opponent turn ended early.\n\n")];
        } else {
            if(this.playerActionIndex + 1 >= this.maxPlayerActions) {
                return;
            }
            this.setToOpponentTurn();
        }
    }

    this.setToOpponentTurn = function() {

        const expirationManifest =  this.expireTurnBased(this.opponentState);
        this.expireEndTerminating(this.playerState);

        if(this.fullScreenStatus) {
            this.hideFullScreenStatus(true);
        }
        if(this.fullScreenCard) {
            this.hideFullScreenCard(true);
        }
        this.updateButtonStates(true);
        this.renderer.lockPageCycle();
        this.renderer.lockViewTab();
        this.renderer.lockTextFeedToggle();
        this.maxOpponentActions = accumulateFilters("turnCount",
            this.opponentState,
            defaultActionCount
        );
        this.opponentActionIndex = -1;
        this.isOpponentTurn = true;
        this.updateActionText();
        this.nextButtonEnabled = true;
        this.nextButtonShown = true;
        this.textFeed = [...this.textFeed,...processTextForWrapping(`your turn is over.\n${expirationManifest?"\n"+expirationManifest:""}\npress [continue] to advance opponent moves.\n\n`)];
        this.renderer.showTextFeed();
        this.cardPageType = cardPageTypes.slots;
        this.pageIndex = 1;
        this.viewingSelfCards = false;
        this.updateRendererData();
        this.updateCardPageText();
    }

    this.buttonRows = [
        [
            {
                text: "[turn description]",
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
        [
            {
                text: setSlotText,
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
        const energyCost = accumulateFilters("energyCost",
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
        const energyCost = accumulateFilters("energyCost",
            this.opponentState,
            this.opponentState.slots[name].energyCost
        );
        if(energyCost > this.opponentState.energy) {
            return `opponent does not have enough energy to slot '${this.opponentState.slots[name].name}'`;
        }
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
                const energyCost = accumulateFilters("energyCost",this.playerState,usedCard.energyCost);
                this.dropEnergy(this.playerState,energyCost);
                this.playerState.hand.splice(this.fullScreenCardIndex,1);
                actionResultText = `used '${usedCard.name}'`;
                const actionResult = usedCard.action ? usedCard.action(this,this.playerState,this.opponentState) : null;
                if(actionResult) {
                    actionResultText += "\n" + actionResult + "\n\n";
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
            case setSlotText:
                actionResultText = this.updatePlayerSlot(this.fullScreenCard.type);
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
                const energyDrawAmount = accumulateFilters("energyDraw",this.playerState,1);
                this.addEnergy(this.playerState,energyDrawAmount,true);
                actionResultText = `you drew ${energyDrawAmount} energy.`;
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
                }\n\n`
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
        if(this.viewingSelfCards) {
            playSound("click");
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
            if(this.opponentActionIndex === -1) {
                const resultText = this.runActionableStatuses(this.opponentState);
                this.opponentActionIndex = 0;
                if(resultText) {
                    this.textFeed = processTextForWrapping(resultText);
                    return;
                }
            }
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
                        this.textFeed = processTextForWrapping("opponent turn over.\n\n");
                    } else {
                        this.textFeed = [
                            ...processTextForWrapping("opponent turn over.\n\n"),...this.textFeed
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
                case OMT.drawCard:
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
                case OMT.drawEnergy:
                    if(this.opponentState.energy >= maxEnergy) {
                        textResult = "opponent tried to draw energy but they are maxed out";
                    } else {
                        const energyDrawAmount = accumulateFilters("energyDraw",this.opponentState,1);
                        textResult = `opponent drew ${energyDrawAmount} energy`;
                        this.addEnergy(this.opponentState,energyDrawAmount,true);
                    }
                    break;
                case OMT.attack:
                    if(this.opponentState.slots.attack) {
                        const damageDone = processDamage(this.opponentState,this.playerState);
                        textResult = `opponent did ${damageDone} damage`;
                    } else {
                        textResult = "opponent tried to attack but they have no attack card. what an idiot";
                    }
                    break;
                case OMT.useCard:
                    const usedCard = this.opponentState.hand[actionDataResult.cardIndex];
                    if(!usedCard) {
                        textResult = "opponent tried to use a card they don't have";
                        break;
                    }
                    this.nextNextButtonCard = usedCard;
                    const energyCost = accumulateFilters("energyCost",this.opponentState,usedCard.energyCost);
                    if(energyCost > this.opponentState.energy) {
                        textResult = `opponent doesn't have enough energy to use '${usedCard.name}'`;
                        break;
                    }
                    this.dropEnergy(this.opponentState,energyCost);

                    this.opponentState.hand.splice(actionDataResult.cardIndex,1);
                    textResult = `opponent used '${usedCard.name}'`;
                    const actionResult = usedCard.action ? usedCard.action(this,this.opponentState,this.playerState) : null;
                    if(actionResult) {
                        textResult += "\n" + actionResult + "\n\n";
                    }
                    break;
                case OMT.discardCard:
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
                case OMT.setAttack:
                    this.nextNextButtonCard = this.opponentState.hand[actionDataResult.cardIndex];
                    textResult = this.updateOpponentSlot("attack",actionDataResult.cardIndex);
                    break;
                case OMT.setDefense:
                    this.nextNextButtonCard = this.opponentState.hand[actionDataResult.cardIndex];
                    textResult = this.updateOpponentSlot("defense",actionDataResult.cardIndex);
                    break;
                case OMT.setSpecial:
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
                }\n\n`
            );

            this.opponentActionIndex++;

            if(!this.nextNextButtonCard) {
                if(this.opponentActionIndex >= this.maxOpponentActions) {
                    this.textFeed = [...this.textFeed,...processTextForWrapping("opponent turn over.\n\n")];
                    this.setToPlayerTurn();
                }
            } else {
                this.renderer.lockTextFeedToggle();
            }

            this.renderer.showTextFeed();
        }
    }

    this.setButtonStatesLogical = function() {
        this.buttonNameLookup[drawButtonText].enabled = this.playerState.hand.length < handLimit;
        this.buttonNameLookup[attackButtonText].enabled = this.playerState.slots.attack ? true : false;
        this.buttonNameLookup[drawEnergyButtonText].enabled = this.playerState.energy < maxEnergy;

        this.buttonNameLookup[useButtonText].enabled = false;
        this.buttonNameLookup[discardButtonText].enabled = false;

        this.buttonNameLookup[setSlotText].enabled = false;
    }

    this.updateButtonStates = function(disableAll) {
        if(disableAll || this.isOpponentTurn) {
            for(let i = 0;i<this.buttonLookup.length;i++) {
                this.buttonLookup[i].enabled = false
            }
        } else {
            if(this.viewingSelfCards) {
                if(this.fullScreenCard && this.cardPageType === cardPageTypes.hand) {
                    this.buttonNameLookup[setSlotText].enabled = false;

                    this.buttonNameLookup[drawButtonText].enabled = this.playerState.hand.length < handLimit;
                    this.buttonNameLookup[attackButtonText].enabled = this.playerState.slots.attack ? true : false;
                    this.buttonNameLookup[drawEnergyButtonText].enabled = this.playerState.energy < maxEnergy;

                    this.buttonNameLookup[useButtonText].enabled = false;

                    const playerHasEnoughEnergy = this.playerState.energy >= accumulateFilters("energyCost",
                        this.playerState,
                        this.fullScreenCard.energyCost
                    );

                    switch(this.fullScreenCard.type) {
                        case "attack":
                        case "defense":
                        case "special":
                            this.buttonNameLookup[setSlotText].enabled = playerHasEnoughEnergy;
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

    for(let i = 0;i<handLimit;i++) {
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

    this.updateActionText();
    this.updateTurnText();
}
