const SettingsPaneRenderer = new (function(){

    let lastPos = {
        x: -1,
        y: -1
    };
    let showHoverSpecialEffect = false;

    const getFriendlyKeyName = keyCode => {
        let friendlyName = keyCode.toLowerCase();
        if(friendlyName.startsWith("key")) {
            friendlyName = friendlyName.substring(3);
        }
        return friendlyName;
    }

    let wrappedKeyBindText;
    const reloadKeyBindDescription = () => {
        const x = (y,z) => {
            return {
                index: y,
                name: z
            }
        }
        let i = 0;
        const keyBindSchema = {};
        keyBindSchema[kc.accept] = x(i++,"accept");
        keyBindSchema[kc.cancel] = x(i++,"cancel");
        keyBindSchema[kc.up] = x(i++,"move up");
        keyBindSchema[kc.down] = x(i++,"move down");
        keyBindSchema[kc.left] = x(i++,"move left");
        keyBindSchema[kc.right] = x(i++,"move right");
        keyBindSchema[kc.picture_mode] = x(i++,"picture mode");
        keyBindSchema[kc.fullscreen] = x(i++,"fullscreen");
        const finalData = [];
        Object.entries(keyBindings).forEach(entry => {
            const the_key_of_the_keyboard = entry[0];
            const internal_kc_value = entry[1];
            const schema = keyBindSchema[internal_kc_value];
            if(!schema) {
                return;
            }
            let friendlyName = getFriendlyKeyName(the_key_of_the_keyboard);
            friendlyName = `R${friendlyName}R`;
            finalData[schema.index] = `${friendlyName} - ${schema.name}`;
        });
        wrappedKeyBindText = processTextForWrapping(finalData.join("\n"));
    }
    reloadKeyBindDescription();

    this.exit = null;
    const exit = (x,y) => {
        if(this.exit) {
            this.exit(x,y);
            playSound("reverse-click");
        }
        showHoverSpecialEffect = false;
    }
    let keyBindInputIndex = 0;
    const bindOrder = [
        {
            name: "accept",
            key: kc.accept
        },
        {
            name: "cancel",
            key: kc.cancel
        },
        {
            name: "up",
            key: kc.up
        },
        {
            name: "down",
            key: kc.down
        },
        {
            name: "left",
            key: kc.left
        },
        {
            name: "right",
            key: kc.right
        },
        {
            name: "picture mode",
            key: kc.picture_mode
        },
    ];

    const hoverTypes = {
        none: Symbol("none"),
        change_binds: Symbol("change_binds")
    };
    const CHANGE_CONTROLS = "change controls (click me)";
    const CANCEL_BINDING =  "cancel";
    let hoverType = hoverTypes.none;
    let keyBindBuffer = null;
    let keyErrorTimeout = null;
    this.processKey = function(key) {
        if(listeningToKeyEvents) {
            return;
        }
        switch(key) {
            case kc.cancel:
                exit(lastPos.x,lastPos.y);
                break;
        }
    }
    this.processKeyUp = function(key) {
    }
    const trueKeyDown = key => {
    };
    const trueKeyUp = key => {
        const keyCode = key.code;
        clearTimeout(keyErrorTimeout);
        let hasModifier = key.altKey || key.ctrlKey || key.shiftKey;
        if(keyBindBuffer[keyCode] || hasModifier) {
            playSound("damage");
            wrappedKeyBindText = processTextForWrapping(
                hasModifier ? "illegal key modifier!" : `R${getFriendlyKeyName(keyCode)}R is already used!`
            );
            keyErrorTimeout = setTimeout(updateKeyBindRequest,600);
            return;
        }
        keyBindBuffer[keyCode] = bindOrder[keyBindInputIndex].key;
        keyBindInputIndex++;
        updateKeyBindRequest();
    };
    const updateKeyBindRequest = () => {
        if(keyBindInputIndex >= bindOrder.length) {
            setKeyBinds(keyBindBuffer);
            reloadKeyBindDescription();
            unsubscribeTrueKeyEvents();
            changeBindsText = CHANGE_CONTROLS;
            playSound("energy-reverse");
            return;
        }
        playSound("energy");
        wrappedKeyBindText = processTextForWrapping(
            `press key for R${bindOrder[keyBindInputIndex].name}R`
        );
    }

    let listeningToKeyEvents = false;
    const subscribeToTrueKeyEvents = () => {
        listeningToKeyEvents = true;
        window.addEventListener("keyup",trueKeyUp);
    }
    const unsubscribeTrueKeyEvents = () => {
        window.removeEventListener("keyup",trueKeyUp);
        listeningToKeyEvents = false;
    }

    this.processClick = function(x,y) {
        this.processMove(x,y);
        showHoverSpecialEffect = true;
    }

    let changeBindsText = CHANGE_CONTROLS;
    let tmpKeyBindings = null;

    const getNewKeybinds = () => {
        subscribeToTrueKeyEvents();
        keyBindInputIndex = 0;
        tmpKeyBindings = keyBindings;
        keyBindings = {};
        keyBindBuffer = {};
        updateKeyBindRequest();
        changeBindsText = CANCEL_BINDING;
    }

    this.processClickEnd = function(x,y) {
        showHoverSpecialEffect = false;
        switch(hoverType) {
            case hoverTypes.change_binds:
                if(listeningToKeyEvents) {
                    keyBindings = tmpKeyBindings;
                    reloadKeyBindDescription();
                    unsubscribeTrueKeyEvents();
                    clearTimeout(keyErrorTimeout);
                    changeBindsText = CHANGE_CONTROLS;
                    playSound("click");
                } else {
                    getNewKeybinds();
                    playSound("click");
                }
                
                break;
            case hoverTypes.none:
            default:
                if(listeningToKeyEvents) {
                    return;
                }
                exit(x,y);
                break;
        }
        this.processMove(x,y);
    }

    let changeBindsButton = {
        x: -1,
        y: -1,
        width: 0,
        height: 0
    }

    let changeBindsTextTest = drawTextTest(changeBindsText,3);
    changeBindsTextTest.width /= 2;
    changeBindsTextTest.height /= 2;

    let cancelTextTest = drawTextTest(CANCEL_BINDING,3);
    cancelTextTest.width /= 2;
    cancelTextTest.height /= 2;

    this.processMove = function(mouseX,mouseY) {
        lastPos.x = mouseX;
        lastPos.y = mouseY;
        if(areaContains(
            mouseX,
            mouseY,
            changeBindsButton.x,
            changeBindsButton.y,
            changeBindsButton.width,
            changeBindsButton.height
        )) {
            hoverType = hoverTypes.change_binds;
            return;
        }
        hoverType = hoverTypes.none;
    }
    this.render = timestamp => {
        context.fillStyle = "rgba(50,50,50,0.98)";
        context.fillRect(20,20,fullWidth-40,fullHeight-40);

        changeBindsButton.x = 25;
        changeBindsButton.y = 25;

        changeBindsButton.width = fullWidth - 50;
        changeBindsButton.height = 50;
        const buttonHover = hoverType===hoverTypes.change_binds;
        if(changeBindsText === CANCEL_BINDING) {
            renderButton(
                changeBindsButton,
                buttonHover,
                CANCEL_BINDING,
                cancelTextTest.width,
                cancelTextTest.height,
                showHoverSpecialEffect
            );
        } else {
            renderButton(
                changeBindsButton,
                buttonHover,
                changeBindsText,
                changeBindsTextTest.width,
                changeBindsTextTest.height,
                showHoverSpecialEffect
            );
        }
        drawTextWrappingWhite(wrappedKeyBindText,halfWidth-85,100,halfWidth,2,20,3);
    }
})();
export default SettingsPaneRenderer;
