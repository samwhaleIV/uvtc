function Fade(duration,start,end,polarity) {
    let fadeStart = start ? start : null;
    let finished = false;
    this.render = timestamp => {
        if(!fadeStart) {
            fadeStart = timestamp;
        }
        let progress = (timestamp - fadeStart) / duration;
        if(progress > 1) {
            progress = 1;
            if(!finished) {
                finished = true;
                if(end) {
                    end();
                }
            }
        }
        const gradientValue = polarity ? progress : 1 - progress;
        context.fillStyle = `rgba(0,0,0,${gradientValue})`;
        context.fillRect(0,0,fullWidth,fullHeight);
    }
}

function FadeOut(duration,start,end) {
    Fade.call(this,duration,start,end,true);
}
function FadeIn(duration,start,end) {
    Fade.call(this,duration,start,end,false);
}
export {FadeIn,FadeOut}
