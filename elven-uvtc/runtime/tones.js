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

function SecretDoorSound() {
    playTonesScaled(0.5,1,0.8,
        [783.99,1,0,
        698.46,1,100,
        659.26,1,200,
        698.46,1,300,
        830.61,1,400]
    );
}

function DoorOpenSound() {
    playTones(150,1,0,200,1,100);
}
function DoorCloseSound() {
    playTones(200,1,0,150,1,100);
}

const tones = [208,210];
let toneIndex = 0;
const toneDuration = 1 / 3;
function TextSound() {
    playTone(tones[toneIndex],toneDuration);
    toneIndex = (toneIndex+1) % tones.length;
}

export { CloseSound,OpenSound,AlertSound, SelectionConfirmSound, SelectionChangeSound, TextSound, DoorOpenSound, DoorCloseSound, SecretDoorSound }
