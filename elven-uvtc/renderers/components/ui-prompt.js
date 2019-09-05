const acceptButton = getPlaceholderLocation();
const cancelButton = getPlaceholderLocation();

function UIPrompt(message,accept,cancel) {
    message = message.split("\n");
    const hoverTypes = {
        none: 0,
        accept: 1,
        cancel: 2
    }
    let hoverType = 0;
    this.shown = false;
    this.processKeyUp = key => {
        if(cancel && key === kc.cancel) {
            cancel.callback();
        }
    }
    this.processKey = key => {
    }
    this.processMove = (x,y) => {
        if(contains(x,y,acceptButton)) {
            hoverType = hoverTypes.accept;
        } else if(cancel && contains(x,y,cancelButton)) {
            hoverType = hoverTypes.cancel;
        } else {
            hoverType = hoverTypes.none;
        }
    }
    this.processClick = (x,y) => {
        this.processMove(x,y);
    }
    this.processClickEnd = (x,y) => {
        switch(hoverType) {
            case hoverTypes.accept:
                playSound("click");
                accept.callback();
                break;
            case hoverTypes.cancel:
                playSound("click");
                cancel.callback();
                break;
        }
    }
    this.show = () => {
        playSound("energy");
        this.processMove(lastRelativeX,lastRelativeY);
        this.shown = true;
    }
    const buttonMargin = 6;
    const halfButtonMargin = buttonMargin / 2;
    this.render = () => {
        if(!this.shown) {
            return;
        }
        context.fillStyle = "rgba(0,0,0,0.75)";
        context.fillRect(0,0,fullWidth,fullHeight);

        let width = 800;
        if(width > fullWidth - 200) {
            width = fullWidth - 200;
        }
        let height = 400;
        if(height > fullHeight - 300) {
            height = fullHeight - 300;
        }
        const x = Math.floor(halfWidth-width/2);
        const y = Math.floor(halfHeight-height/2);

        context.fillStyle = "white";
        context.fillRect(x,y,width,height);

        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = UI_ALERT_FONT;
        const buttonHeight = 60;

        let i = 0;
        const messageOffset = (message.length % 2 === 0 ? message.length : message.length-1) * 28 / 2;
        while(i<message.length) {
            context.fillText(message[i],halfWidth,halfHeight - messageOffset + 28 * i);
            i++;
        }


        const buttonY = y + height - buttonHeight - buttonMargin;
        context.font = MENU_BUTTON_FONT;

        const buttonWidth = width - buttonMargin - buttonMargin;

        if(cancel) {
            //render both buttons

            acceptButton.width = width / 2 - buttonMargin;
            cancelButton.width = acceptButton.width + buttonMargin - halfButtonMargin;
            acceptButton.width -= buttonMargin + halfButtonMargin;

            acceptButton.x = x + buttonMargin;
            cancelButton.x = x + width - cancelButton.width - buttonMargin;

            acceptButton.y = buttonY;
            cancelButton.y = buttonY;
            acceptButton.height = buttonHeight;
            cancelButton.height = buttonHeight;

            if(hoverType === hoverTypes.accept) {
                renderButtonHover(acceptButton.x,acceptButton.y,acceptButton.width,acceptButton.height);
            }
            if(hoverType === hoverTypes.cancel) {
                renderButtonHover(cancelButton.x,cancelButton.y,cancelButton.width,cancelButton.height);
            }

            context.fillStyle = "black";
            context.beginPath();
            context.rect(acceptButton.x,acceptButton.y,acceptButton.width,acceptButton.height);
            context.rect(cancelButton.x,cancelButton.y,cancelButton.width,cancelButton.height);
            context.fill();

            context.fillStyle = "white";
            context.textAlign = "start";
            context.fillText(accept.text,acceptButton.x+20,acceptButton.y+acceptButton.height/2+2);
            context.fillText(cancel.text,cancelButton.x+20,cancelButton.y+cancelButton.height/2+2);
        } else {
            const buttonX = x + buttonMargin;
            if(hoverType === hoverTypes.accept) {
                renderButtonHover(buttonX,buttonY,buttonWidth,buttonHeight);
            }
            context.fillStyle = "black";
            context.fillRect(buttonX,buttonY,buttonWidth,buttonHeight);

            context.fillStyle = "white";
            context.fillText(accept.text,buttonX+buttonWidth/2,buttonY+buttonHeight/2+2);

            acceptButton.x = buttonX;
            acceptButton.y = buttonY;
            acceptButton.width = buttonWidth;
            acceptButton.height = buttonHeight;
        }

    }
}
export default UIPrompt;
