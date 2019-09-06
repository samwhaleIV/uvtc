import Moves from "./moves.js";
import MovesManager from "../moves-manager.js";

const DEFAULT_HEALTH = 10;
const MAX_DISPLAY_HEALTH = 100;
const NUMBER_TYPE = typeof 0;
const OBJECT_TYPE = typeof {};
const STRING_TYPE = typeof "You Versus Earth - Battle Sequencer";
const FUNCTION_TYPE = typeof (()=>void "OwO");
const ILLEGAL_HEALTH_MODIFIER = "Illegal health modifier value. Value must be a number";
const BAD_START_HEALTH = "Tried to create a battle entity with less than 1 health";
const STATUS_IS_STRING_ERROR = "New status must be a object, not the name";
const NAME_IS_NOT_STRING = "Entity names must be strings";
const FALLBACK_NAME = "Thing";
const RETURN_DIRECTIVE = "return";

const SELECTION_PANEL = [Moves["Logic"],Moves["Malice"],Moves["Fear"]];
const SKIP_MOVE = Moves["Skip"];
const BACK_MOVE = Moves["Back"];
const NOTHING_MOVE = Moves["Nothing"];

const SELECT_A_MOVE_TEXT = "Select a move...";
const WATING_FOR_EXTERNAL_TEXT = "Please wait...";

const BATTLE_ALREADY_STARTED = "Battle was already started!";
const INVALID_STATUS_TYPE = "Status name must be a string!";
const INVALID_PLAYER_ACTION = "Invalid move assumed from player action processing!";
const INVALID_BATTLE_EVENT = "Invalid battle event!";

const MISSING_END_CALLBACK = "Missing sequencer end callback!";
const INVALID_END_CALLBACK = "End callback must be of type 'function'!";

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

const statusPrioritySort = (a,b) => (b.priority||0) - (a.priority||0);

const getStatusName = status => {
    if(typeof status === STRING_TYPE) {
        return status;
    } else if(typeof status === OBJECT_TYPE) {
        const statusName = status.name;
        if(statusName && typeof statusName === STRING_TYPE) {
            return statusName;
        } else {
            throw Error(INVALID_STATUS_TYPE);
        }
    } else {
        throw Error(INVALID_STATUS_TYPE);  
    }
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
    let entityMaxHealth = MAX_DISPLAY_HEALTH;

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

    let lastMove = null;
    Object.defineProperty(entity,"lastMove",{
        get: function() {
            return lastMove;
        },
        set: function(moveName) {
            lastMove = moveName;
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

    sequencer.addPlayerMovesChanged(renderer.updatePlayerMoves);
    renderer.updatePlayerMoves(sequencer.playerMoves);

    renderer.rightHealth = sequencer.player.health;
    renderer.leftHealth =  sequencer.opponent.health;

    renderer.leftHealthNormal =  1;
    renderer.rightHealthNormal = 1;

    renderer.rightStatuses = sequencer.player.statuses;
    renderer.leftStatuses =  sequencer.opponent.statuses;

    renderer.leftName =  sequencer.opponent.name;
    renderer.rightName = sequencer.player.name;

    sequencer.runtimeBinds.getAction = renderer.getAction;

    renderer.foreground = sequencer.opponentSequencer.foreground;
    renderer.style = sequencer.opponentSequencer.style;
    renderer.background = renderer.style.getBackground();

    if(sequencer.opponentSequencer.getSong) {
        renderer.song = sequencer.opponentSequencer.getSong();
    }
    if(sequencer.opponentSequencer.getSongIntro) {
        renderer.songIntro = sequencer.opponentSequencer.getSongIntro();
    }
}

function moveResultPreprocess(result) {
    if(!result) {
        return [];
    } else if(result.length) {
        return result;
    } else {
        return [result];
    }
}

const isBadPlayerAction = playerAction => {
    return isNaN(playerAction) ||  playerAction < 0;
}
async function runBattleEvents(sequencer,events) {
    if(typeof events === OBJECT_TYPE && isNaN(events.length)) {
        events = [events];
    }
    const eventCount = events.length;
    for(let i = 0;i<eventCount;i++) {
        const event = events[i];
        await fireBattleEvent(sequencer,event);
        const playerAction = await sequencer.getAction();
        if(isBadPlayerAction(playerAction)) {
            invalidPlayerAction(playerAction);
        } else if(typeof playerAction !== NUMBER_TYPE) {
            invalidPlayerAction(playerAction);
        }
    }
}

function moveStatusFilter(move,user,target) {

    const outgoingStatusFilters = Object.values(user.statuses).filter(status=>status.outgoingFilter);
    const incomingStatusFilters = Object.values(target.statuses).filter(status=>status.incomingFilter);

    const allStatuses = [...outgoingStatusFilters,...incomingStatusFilters].sort(statusPrioritySort);

    for(let i = 0;i<allStatuses.length;i++) {
        const status = allStatuses[i];
        let result;
        if(status.outgoingFilter) {
            result = status.outgoingFilter(user,target,move);
        } else {
            /*
              Note that 'target' and 'user' is swapped for (self,attacker)     order
                                            instead of     (attacker,defender) order
            */
            result = status.incomingFilter(target,user,move);
        }
        if(result) {
            return {
                events: moveResultPreprocess(result.events),
                directive: result.directive
            }
        }
    }

    return null;
}

async function processMove(move,user,target,sequencer) {
    if(user.isPlayer) {
        sequencer.setMarqueeText(WATING_FOR_EXTERNAL_TEXT);
        sequencer.updatePlayerMoves([SKIP_MOVE]);
    }
    const targetMove = move.process ? move : NOTHING_MOVE;
    user.lastMove = targetMove;
    let resultEvents;

    let shouldRunMove = false;

    if(targetMove !== NOTHING_MOVE) {
        const result = moveStatusFilter(targetMove,user,target);
        if(result.directive === "continue") {
            shouldRunMove = true;
        }
        resultEvents = result.events;
    }

    if(!resultEvents) {
        resultEvents = [];
        shouldRunMove = true;
    }
    if(shouldRunMove) {
        resultEvents.push(...moveResultPreprocess(targetMove.process(
            user,target,sequencer
        )));
    }

    const events = [{
        type: "text",
        text: `${user.name} used ${move.name}.`
    },...resultEvents];
    await runBattleEvents(sequencer,events);
}
async function processPlayerAction(sequencer,action) {
    const move = sequencer.playerMoves[action];
    if(!move) {
        throw Error(INVALID_PLAYER_ACTION);
    }
    switch(move.name) {
        case "Malice":
        case "Fear":
        case "Logic":
            sequencer.updatePlayerMoves(sequencer[`player${move.name}Moves`]);
            return RETURN_DIRECTIVE;
        case "Skip":
            break;
        case "Back":
            sequencer.updatePlayerMoves(SELECTION_PANEL);
            return RETURN_DIRECTIVE;
        default:
            await processMove(
                move,
                sequencer.player,
                sequencer.opponent,
                sequencer
            );
            break;
    }
}
function clearHangingSpeech(sequencer) {
    if(sequencer.hangingSpeech) {
        sequencer.clearFullText();
        sequencer.hangingSpeech = false;
    }
}
async function fireBattleEvent(sequencer,event) {
    if(event && event.type) {
        if(event.type !== "speech") {
            clearHangingSpeech(sequencer);
        }
        switch(event.type) {
            case "player-move":
            case "opponent-move":
                const move = event.move;
                let user, target;
                if(event.type === "player-move") {
                    user = sequencer.player;
                    target = sequencer.opponent;
                } else {
                    user = sequencer.opponent;
                    target = sequencer.player;
                }
                await processMove(move,user,target,sequencer);
                break;
            case "text":
                sequencer.setMarqueeText(event.text);
                break;
            case "speech":
                sequencer.hangingSpeech = true;
                sequencer.showFullText(event.text);
                break;
            case "action":
                event.process(sequencer);
                break;

        }
    } else {
        throw Error(INVALID_BATTLE_EVENT);
    }
}

async function logicalBattleSequencer(sequencer) {
    const opponentSequencer = sequencer.opponentSequencer;
    const opponent = sequencer.opponent;
    const player = sequencer.player;
    opponentSequencer.player = player;
    opponentSequencer.self = opponent;
    if(opponentSequencer.load) {
        opponentSequencer.load();
    }
    let battleAlive = true;
    const endParameters = {};
    await sequencer.getAction();
    sequencer.updatePlayerMoves([SKIP_MOVE]);
    sequencer.setMarqueeText("The battle begins!");
    await sequencer.getAction();
    if(opponentSequencer.getStartEvents) {
        await runBattleEvents(sequencer,opponentSequencer.getStartEvents());
    }
    let lastDirective = null;
    const postLoopProcess = () => {
        if(battleAlive && lastDirective !== RETURN_DIRECTIVE) {
            sequencer.updatePlayerMoves(SELECTION_PANEL);
            sequencer.setMarqueeText(SELECT_A_MOVE_TEXT);
        }
        return battleAlive;
    }
    postLoopProcess();
    do {
        clearHangingSpeech(sequencer);
        const playerAction = await sequencer.getAction();
        if(isBadPlayerAction(playerAction)) {
            invalidPlayerAction(playerAction);
        }
        const directive = await processPlayerAction(sequencer,playerAction);
        lastDirective = directive ? directive : null;
        if(directive === RETURN_DIRECTIVE) {
            continue;
        }
        const playerDead = player.isDead;
        const opponentDead = opponent.isDead;
        if(!playerDead && !opponentDead) {
            const opponentEvents = await opponentSequencer.getTurnEvents();
            await runBattleEvents(sequencer,opponentEvents);
        }
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
    } while(postLoopProcess());
    sequencer.updatePlayerMoves([SKIP_MOVE]);
    const battleOutput = {};
    if(endParameters.playerLost) {
        if(endParameters.stalemate) {
            sequencer.setMarqueeText("Everyone has been defeated!");
        } else {
            sequencer.setMarqueeText("You have been defeated!");
        }
        if(endParameters.stalemate && opponentSequencer.getStalemateEvents) {
            await runBattleEvents(sequencer,opponentSequencer.getStalemateEvents(battleOutput));
        } else if(opponentSequencer.getPlayerLostEvents) {
            await runBattleEvents(sequencer,opponentSequencer.getPlayerLostEvents(battleOutput));
        }
        const playerAction = await sequencer.getAction();
        if(isBadPlayerAction(playerAction)) {
            invalidPlayerAction(playerAction);
        }
        sequencer.loseCallback(battleOutput);
    } else {
        sequencer.setMarqueeText(`${sequencer.opponent.name} has been defeated!`);
        if(opponentSequencer.getPlayerWonEvents) {
            await runBattleEvents(sequencer,opponentSequencer.getPlayerWonEvents(battleOutput));
        }
        clearHangingSpeech(sequencer);
        const playerAction = await sequencer.getAction();
        if(isBadPlayerAction(playerAction)) {
            invalidPlayerAction(playerAction);
        }
        sequencer.winCallback(battleOutput);
    }
}

function getSlotMoves(slotType) {
    const slotMoves = [];
    for(let i = 1;i<4;i++) {
        const move = MovesManager.getSlot(slotType,i);
        if(move.type !== "ui") {
            slotMoves.push(move);
        }
    }
    if(!slotMoves.length) {
        slotMoves.push(NOTHING_MOVE);
    }
    slotMoves.unshift(BACK_MOVE);
    return slotMoves;
}
function missingEndCallback() {
    throw Error(MISSING_END_CALLBACK);
}
function validateCallbackEvent(callback) {
    if(!callback) {
        console.warn(MISSING_END_CALLBACK);
        return missingEndCallback;
    } else if(typeof callback !== FUNCTION_TYPE) {
        console.warn(INVALID_END_CALLBACK);
        return missingEndCallback;
    } else {
        return callback;
    }
}
function BattleSequencer(winCallback,loseCallback,opponentSequencer) {
    this.winCallback = validateCallbackEvent(winCallback);
    this.loseCallback = validateCallbackEvent(loseCallback);

    this.player = getBattleEntity("You",DEFAULT_HEALTH,true);
    this.opponent = getBattleEntity(
        opponentSequencer.getName() || "Opponent",
        opponentSequencer.getDefaultHealth() || DEFAULT_HEALTH,
        false
    );

    this.playerLogicMoves = getSlotMoves("logic");
    this.playerMaliceMoves = getSlotMoves("malice");
    this.playerFearMoves = getSlotMoves("fear");

    this.opponentSequencer = opponentSequencer;
    this.playerMoves = [Moves["Start"]];

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
        return this.runtimeBinds.getAction();
    };

    this.hangingSpeech = false;
    this.runtimeBinds = runtimeBinds;

    this.updatePlayerMoves = newMoves => {
        this.playerMoves = newMoves;
        this.firePlayerMovesChanged(newMoves);
    };

    this.getMove = moveName => {
        return Moves[moveName];
    }

    this.bindToBattleScreen = renderer => {
        bindToBattleScreen(this,renderer);
    }

    let started = false;
    this.startBattle = () => {
        if(started) {
            throw Error(BATTLE_ALREADY_STARTED);
        }
        started = true;
        logicalBattleSequencer(this);
    }
    Object.defineProperty(this,"started",{
        get: function() {
            return started;
        }
    });

    Object.seal(this);
}
export default BattleSequencer;
export {MAX_DISPLAY_HEALTH, DEFAULT_HEALTH };
