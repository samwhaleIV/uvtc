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
    playTones(1,1,1,[150,1,0,200,1,100]);
}
function DoorCloseSound() {
    playTones(1,1,1,[200,1,0,150,1,100]);
}

function TextSound() {
    playTone(587.3295,0.3);
}

function RockMoveStartSound() {
    playTone(45,0.8);
}
function RockMoveEndSound() {
    playTone(90,0.75);
}
function IceSmashSound() {
    playTonesScaled(1,1,1,[
        500,0.4,0,
        450,0.4,100,
        410,0.4,200,
        500,0.4,300,
    ]);
}

export { CloseSound,OpenSound,AlertSound,
    SelectionConfirmSound, SelectionChangeSound,
    TextSound, DoorOpenSound, DoorCloseSound,
    SecretDoorSound, IceSmashSound,
    RockMoveEndSound, RockMoveStartSound
}
