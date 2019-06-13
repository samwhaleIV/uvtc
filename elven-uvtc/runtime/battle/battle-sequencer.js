const DEFAULT_HEALTH = 20;
const MAX_DISPLAY_HEALTH = 100;
const NUMBER_TYPE = typeof 0;
const OBJECT_TYPE = typeof {};
const STRING_TYPE = typeof "You Versus Earth - Battle Sequencer";
const ILLEGAL_HEALTH_MODIFIER = "Illegal health modifier value. Value must be a number";
const BAD_START_HEALTH = "Tried to create a battle entity with less than 1 health";
const STATUS_IS_STRING_ERROR = "New status must be a object, not the name";
const NAME_IS_NOT_STRING = "Entity names must be strings";
const FALLBACK_NAME = "Thing";

const clearKeys = object => {
    Object.keys(object).forEach(key => {
        delete object[key];
    });
}

const informSubscribers = (subscriptions,...parameters) => {
    Object.values(subscriptions).forEach(subscriber=>subscriber(...parameters));
}

const addEvent = (object,eventName) => {
    const watchers = {};
    object[`add${eventName}`] = subscriber => {
        watchers[subscriber] = subscriber;
    };
    object[`remove${eventName}`] = subscriber => {
        delete watchers[subscriber];
    };
    object[`fire${eventName}`] = (...parameters) => {
        informSubscribers(watchers,...parameters);
    }
}

const getStatusName = status => {
    let statusName = status;
    if(status.name) {
        statusName = status.name;
    }
    if(typeof statusName !== STRING_TYPE) {
        throw "Status name must be a string!";
    }
    return statusName;
}

const getBattleEntity = (name,health,isPlayer) => {
    isPlayer = isPlayer ? true: false;
    if(typeof health !== NUMBER_TYPE) {
        health = 1;
    }
    if(health <= 0) {
        health = 1;
        console.warn(BAD_START_HEALTH);
    } else if(health > MAX_DISPLAY_HEALTH) {
        health = MAX_DISPLAY_HEALTH;
        console.warn(`Tried to create a battle entity with health greater than ${MAX_DISPLAY_HEALTH}`);
    }

    if(typeof name !== STRING_TYPE) {
        name = FALLBACK_NAME;
        console.warn(NAME_IS_NOT_STRING);
    }

    let entityName = name;

    let entityHealth = health;
    let entityMaxHealth = health;

    const battleState = {};
    const entity = {};

    Object.defineProperty(entity,"maxHealth",{
        get: function() {
            return entityMaxHealth;
        }
    });

    Object.defineProperty(entity,"state",{
        get: function() {
            return battleState
        }
    });

    Object.defineProperty(entity,"isAlive",{
        get: function() {
            return entityHealth > 0;
        }
    });
    Object.defineProperty(entity,"isDead",{
        get: function() {
            return entityHealth <= 0;
        }
    });
    Object.defineProperty(entity,"isPlayer",{
        get: function() {
            return isPlayer;
        }
    });

    const watch = {};
    addEvent(watch,"HealthAdded");
    addEvent(watch,"HealthDropped");
    addEvent(watch,"HealthChanged");
    addEvent(watch,"Died");
    addEvent(watch,"StatusesChanged");
    addEvent(watch,"NameChanged");
    Object.freeze(watch);

    const statuses = {};
    Object.defineProperty(entity,"statuses",{
        get: function() {
            return Object.values(statuses);
        }
    });
    entity.clearState = () => {
        clearKeys(battleState);
    };
    const positiveHealthChange = amount => {
        const startHealth = entityHealth;
        const health = startHealth + amount;
        if(health > entityMaxHealth) {
            entityHealth = entityMaxHealth;
        } else {
            entityHealth = health;
        }
        const healthDifference = entityHealth - startHealth;
        watch.fireHealthAdded(healthDifference);
        watch.fireHealthChanged(entityHealth,entityHealth/entityMaxHealth,healthDifference);
    }
    const negativeHealthChange = amount => {
        const startHealth = entityHealth;
        const health = startHealth - amount;
        if(health <= 0) {
            entityHealth = 0;
            watch.fireDied();
        } else {
            entityHealth = health;
        }
        const healthDifference = entityHealth - startHealth;
        watch.fireHealthDropped(-healthDifference);
        watch.fireHealthChanged(entityHealth,entityHealth/entityMaxHealth,healthDifference);
    }
    const changeHealth = (amount,positive) => {
        if(typeof amount !== NUMBER_TYPE) {
            amount = 0;
            console.warn(ILLEGAL_HEALTH_MODIFIER);
        }
        if(amount < 0) {
            if(positive) {
                negativeHealthChange(-amount);
            } else {
                positiveHealthChange(-amount);
            }
            return;
        } else {
            if(amount > 0) {
                if(positive) {
                    positiveHealthChange(amount);
                } else {
                    negativeHealthChange(amount);
                }
            }
        }
    }
    entity.heal = amount => {
        changeHealth(amount,true);
    }
    entity.damage = amount => {
        changeHealth(amount,false);
    };
    entity.kill = () => {
        changeHealth(entityMaxHealth,false);
    };
    entity.setHealth = value => {
        if(value > entityHealth) {
            const gain = value - entityHealth;
            changeHealth(gain,true);
        } else if(value < entityHealth) {
            const loss = entityHealth - value;
            changeHealth(loss,false);
        }
    };

    Object.defineProperty(entity,"health",{
        get: function() {
            return entityHealth;
        },
        set: function(value) {
            entity.setHealth(value);
        }
    });

    entity.hasStatus = status => {
        const statusName = getStatusName(status);
        return statuses[statusName] ? true : false;
    };
    entity.setStatus = status => {
        const statusType = typeof status;
        if(statusType !== OBJECT_TYPE) {
            if(statusType === STRING_TYPE) {
                throw Error(STATUS_IS_STRING_ERROR);
            } else {
                throw Error(`New status must be of type object, not '${statusType}'`);
            }
        }
        const statusName = getStatusName(status);
        statuses[statusName] = status;
        watch.fireStatusesChanged(Object.values(statuses));
    };
    entity.clearStatus = status => {
        const statusName = getStatusName(status);
        delete statuses[statusName];
        watch.fireStatusesChanged(Object.values(statuses));
    };

    Object.defineProperty(entity,"name",{
        get: function() {
            return entityName;
        },
        set: function(newName) {
            if(typeof newName !== STRING_TYPE) {
                console.warn(NAME_IS_NOT_STRING);
                return;
            }
            entityName = newName;
            watch.fireNameChanged(newName);
        }
    });

    entity.watch = watch;
    Object.freeze(entity);
    return entity;
}

function invalidPlayerAction(action) {
    throw Error(`Invalid player action of type '${typeof action}' received from sequencer`);
}

function bindToBattleScreen(sequencer,renderer) {
    const playerWatches = sequencer.player.watch;
    const opponentWatches = sequencer.opponent.watch;

    function bindDouble(type,method) {
        playerWatches[`add${type}`](
            (...parameters)=>method("right",true)(...parameters)
        );
        opponentWatches[`add${type}`](
            (...parameters)=>method("left",false)(...parameters)
        );
    }
    bindDouble("HealthAdded",(_,isPlayer)=>()=>{
        renderer.flashHealthAdded(isPlayer);
    });
    bindDouble("Died",(_,isPlayer)=>()=>{
        renderer.someoneDied(isPlayer);
    });
    bindDouble("HealthDropped",(_,isPlayer)=>()=>{
        renderer.flashHealthDropped(isPlayer);
    });
    bindDouble("HealthChanged",direction=>(health,healthNormal)=> {
            renderer[`${direction}Health`] = health;
            renderer[`${direction}HealthNormal`] = healthNormal;
        }
    );
    bindDouble("StatusesChanged",direction=>statuses=>{
        renderer[`${direction}Statuses`] = statuses;
    });
    bindDouble("NameChanged",direction=>newName=>{
        renderer[`${direction}Name`] = newName;
    });
    sequencer.runtimeBinds.setMarqueeText = text => {
        renderer.marqueeText = text;
    };

    sequencer.runtimeBinds.showFullText = renderer.showFullText;
    sequencer.runtimeBinds.clearFullText = renderer.clearFullText;

    sequencer.addPlayerMovesChanged(newMoves=>{
        renderer.playerMoves = newMoves;
    });

    renderer.playerMoves = sequencer.playerMoves;
    renderer.rightHealth = sequencer.player.health;
    renderer.leftHealth =  sequencer.opponent.health;

    renderer.leftHealthNormal =  1;
    renderer.rightHealthNormal = 1;

    renderer.rightStatuses = sequencer.player.statuses;
    renderer.leftStatuses =  sequencer.opponent.statuses;

    renderer.leftName =  sequencer.opponent.name;
    renderer.rightName = sequencer.player.name;

    sequencer.runtimeBinds.getAction = renderer.getAction;
}

async function runBattleEvents(sequencer,events) {
    const eventCount = events.length;
    for(let i = 0;i<eventCount;i++) {
        const event = events[i];
        await fireBattleEvent(sequencer,event);
        const playerAction = await sequencer.getAction();
        if(!playerAction) {
            invalidPlayerAction(playerAction);
        } else if(typeof playerAction !== OBJECT_TYPE) {
            invalidPlayerAction(playerAction);
        }
    }
}

async function processPlayerAction(sequencer,action) {
    //use sequencer.playerMoves
    //Todo
}
async function fireBattleEvent(sequencer,event) {
    //Todo
}

async function logicalBattleSequencer(sequencer) {
    const opponentSequencer = sequencer.opponentSequencer;
    const opponent = sequencer.opponent;
    const player = sequencer.player;
    let battleAlive = true;
    const endParameters = {};
    if(opponentSequencer.getStartEvents) {
        await runBattleEvents(sequencer,opponentSequencer.getStartEvents());
    }
    do {
        const playerAction = await sequencer.getAction();
        if(!action) {
            invalidPlayerAction(playerAction);
        }

        await processPlayerAction(sequencer,playerAction);

        const opponentEvents = await opponentSequencer.getTurnEvents();
        await runBattleEvents(sequencer,opponentEvents);

        const playerDead = player.isDead;
        const opponentDead = opponent.isDead;
        if(playerDead || opponentDead) {
            if(playerDead && opponentDead) {
                endParameters.stalemate = true;
                endParameters.playerLost = false;
                endParameters.playerWon = false;
            } else if(playerDead) {
                endParameters.playerLost = true;
                endParameters.playerWon = false;
                endParameters.stalemate = false;
            } else {
                endParameters.playerWon = true;
                endParameters.playerLost = false;
                endParameters.stalemate = false;
            }
            battleAlive = false;
        }
    } while(battleAlive);

    if(endParameters.playerLost) {
        if(endParameters.stalemate && opponentSequencer.getStalemateEvents) {
            await runBattleEvents(sequencer,opponentSequencer.getStalemateEvents());
        } else {
            if(opponentSequencer.getPlayerLostEvents) {
                await runBattleEvents(sequencer,opponentSequencer.getPlayerLostEvents());
            }
        }
        sequencer.loseCallback();
    } else {
        if(opponentSequencer.getPlayerWonEvents) {
            await runBattleEvents(sequencer,opponentSequencer.getPlayerWonEvents());
        }
        sequencer.winCallback();
    }

}

function BattleSequencer(winCallback,loseCallback,opponentSequencer) {
    this.player = getBattleEntity("You",DEFAULT_HEALTH,true);
    this.opponent = getBattleEntity("Opponent",DEFAULT_HEALTH,false);

    this.opponentSequencer = opponentSequencer;

    this.winEvents = [];
    this.loseEvents = [];

    this.playerMoves = [];

    addEvent(this,"PlayerMovesChanged");

    const runtimeBinds = {
        showFullText: text => void 0,
        clearFullText: () => void 0,
        setMarqueeText: text => void 0,
        getAction: async () => void 0
    };

    this.showFullText = text => {
        runtimeBinds.showFullText(text);
    };
    this.clearFullText = () => {
        runtimeBinds.clearFullText();
    };
    this.setMarqueeText = text => {
        runtimeBinds.setMarqueeText(text);
    };
    this.getAction = async () => {
        await this.runtimeBinds.getAction();
    };

    this.runtimeBinds = runtimeBinds;

    this.updatePlayerMoves = newMoves => {
        this.playerMoves = newMoves;
        this.firePlayerMovesChanged(newMoves);
    };

    this.winCallback = async () => {
        for(let i = 0;i<this.winEvents.length;i++) {
            await this.winEvents[i]();
        }
        winCallback();
    };
    this.loseCallback = async () => {
        for(let i = 0;i<this.loseEvents.length;i++) {
            await this.loseEvents[i]();
        }
        loseCallback();
    };

    this.bindToBattleScreen = renderer => {
        bindToBattleScreen(this,renderer);
    }

    this.startBattle = () => {
        logicalBattleSequencer(this);
    }

    Object.freeze(this);
}
export default BattleSequencer;
