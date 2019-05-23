const SettingsPaneRenderer = new (function(){

    this.exit = null;

    const hoverTypes = {
        none: Symbol("none")
    }

    let hoverType = hoverTypes.none;
    this.processKey = function(key) {
        switch(key) {
            case "Space":
                break;
        }
    }
    this.processKeyUp = function(key) {
        switch(key) {
        }
    }

    this.processClick = function(x,y) {
        this.processMove(x,y);
        if(hoverType !== hoverTypes.none) {
            showHoverSpecialEffect = true;
        }
    }

    this.processClickEnd = function(x,y) {

        showHoverSpecialEffect = false;
        switch(hoverType) {
            case hoverTypes.none:
            default:
                if(this.exit) {
                    this.exit(x,y);
                    playSound("click"); 
                }
                break;
        }
        this.processMove(x,y);
    }

    this.processMove = function(mouseX,mouseY) {
        hoverType = hoverTypes.none;
    }
    this.render = timestamp => {
        context.fillStyle = "rgba(50,50,50,0.98)";
        context.fillRect(20,20,fullWidth-40,fullHeight-40);
        drawTextWhite("nothing to see here yet. uh. sorry",30,30,3);
        drawTextWhite("(click anywhere to exit)",30,80,3);
    }
})();
