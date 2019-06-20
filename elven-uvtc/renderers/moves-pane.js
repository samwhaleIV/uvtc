import RotatingBackground from "./components/rotating-background.js";

function MovesPaneRenderer(callback) {

    const exit = () => {
        if(callback) {
            callback();
        }
    }

    let exitButton = getPlaceholderLocation();

    const hoverTypes = {
        none: 0,
        exitButton: 1
    };
    let hoverType = hoverTypes.none;
    this.processClick = (x,y) => {
        this.processMove(x,y);
    }
    this.processClickEnd = () => {
        switch(hoverType) {
            case hoverTypes.exitButton:
                exit();
                break;
        }
    }
    this.processMove = (x,y) => {
        if(contains(x,y,exitButton)) {
            hoverType = hoverTypes.exitButton;
        } else {
            hoverType = hoverTypes.none;
        }
    }
    let cancelDown = false;
    this.processKey = key => {
        if(key === kc.cancel) {
            cancelDown = true;
        }
    }
    this.processKeyUp = key => {
        if(key === kc.cancel) {
            cancelDown = false;
            exit();
        }
    }

    const background = new RotatingBackground("spiral-move-select");
    background.rotationTime = 2 * 60 * 1000;
    background.clockwise = true;
    this.render = timestamp => {
        background.render(timestamp);
        exitButton = renderExitButton(0,0,hoverType===hoverTypes.exitButton,false,cancelDown);
    }
}
export default MovesPaneRenderer;
