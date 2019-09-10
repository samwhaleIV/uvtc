const OSCILLATOR_VOLUME = 0.2;

let lastTone = null;
function playTone(frequency,duration) {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "square";
    const oscillatorGain = audioContext.createGain();

    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(soundOutputNode);

    const startTime = audioContext.currentTime;
    const endTime = startTime + duration;

    oscillatorGain.gain.setValueAtTime(OSCILLATOR_VOLUME,startTime);
    oscillatorGain.gain.exponentialRampToValueAtTime(0.00000001,endTime);
    oscillator.frequency.setValueAtTime(frequency,startTime);
    oscillator.start(startTime);
    oscillator.stop(endTime);
    if(lastTone) {
        lastTone.stop(audioContext.currentTime);
    }
    lastTone = oscillator;
}

function CloseSound() {
    playTone(100,1);
    setTimeout(playTone,80,80,1);
}
function OpenSound() {
    playTone(80,1);
    setTimeout(playTone,80,100,1);
}
function AlertSound() {
    playTone(799,1);
    setTimeout(playTone,80,800,1);
}
function SelectionChangeSound() {
    playTone(150,0.3);
}
function SelectionConfirmSound() {
    playTone(200,0.3);
}

const tones = [208,210];
let toneIndex = 0;
const toneDuration = 1 / 3;
function TextSound() {
    playTone(tones[toneIndex],toneDuration);
    toneIndex = (toneIndex+1) % tones.length;
}

export { CloseSound,OpenSound,AlertSound, SelectionConfirmSound, SelectionChangeSound, TextSound }
