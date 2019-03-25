function WorldPrompt(text,selections,callback) {

    for(let i = 0;i<selections.length;i++) {
        const selection = selections[i];
        selections[i] = `>${selection}`;
    }

    this.selectionIndex = null;
    let terminated = false;

    this.confirmSelection = function() {
        if(this.selectionIndex !== null) {
            playSound("click");
            callback(this.selectionIndex);
            terminated = true;
            return true;
        }
        return false;
    }
    this.moveSelection = function(direction) {
        switch(direction) {
            case "down":
            case "right":
                if(this.selectionIndex === null) {
                    this.selectionIndex = 0;
                } else {
                    if(++this.selectionIndex >= selections.length) {
                        this.selectionIndex = 0;
                    }
                }
                playSound("click");
                break;
            case "up":
            case "left":
                if(this.selectionIndex === null) {
                    this.selectionIndex = 0;
                } else {
                    if(--this.selectionIndex < 0) {
                        this.selectionIndex = selections.length-1;
                    }
                }
                playSound("click");
                break;
        }
    }

    const textRenderTest = drawTextTest(text,4);
    const textXOffset = textRenderTest.width / 2;

    this.render = function() {
        if(terminated) {
            return;
        }
        const popupWidth = halfWidth > 700 ? halfWidth : fullWidth < 700 ? fullWidth - 20 : 700 - 20;
        const popupHeight = fullHeight < 290 ? fullHeight - 20 : 270;
        const popupY = fullHeight - 10 - popupHeight;
        const popupX = Math.round(halfWidth - popupWidth / 2);
        let textX = Math.floor(halfWidth - textXOffset);
        context.fillStyle = "black";
        context.fillRect(
            popupX-3,
            popupY-3,
            popupWidth+6,
            popupHeight+6
        );
        context.fillStyle = "white";
        context.fillRect(
            popupX,
            popupY,
            popupWidth,popupHeight
        );
        let textY = popupY + 20;
        drawTextBlack(text,
            textX,
            textY,
            4
        );
        textX -= 16;
        textY += 50;
        let i = 0;
        while(i < selections.length) {
            if(this.selectionIndex === i) {
                drawTextStencil("black",selections[i],textX,textY,4,10);

            } else {
                drawTextBlack(selections[i],textX,textY,4);
            }
            textY += 40;
            i++;
        }
    }
}
