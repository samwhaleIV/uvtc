const delay = time => new Promise(resolve => setTimeout(resolve,time));

const scripts = {
    jim_gets_the_hell_out_of_the_way: async (world,jim) => {
        world.lockPlayerMovement();
        await world.showPrompt("what do you want to whisper?","i love you","please move","uh.. nice panel?");
        await delay(800);
        await jim.sayID("jims_intrigue");
        await jim.move({y:2},{x:1});
        await delay(300);
        jim.updateDirection("up");
        await delay(700);
        jim.updateDirection("left");
        await delay(800);
        await jim.sayID("jims_journey");
        world.globalState.jimMoved = true;
        world.unlockPlayerMovement();
        await delay(250);
        jim.updateDirection("up");
        world.globalState.jimsDirection = "up";
    },
    how_to_press_enter: async (world,jim) => {
        world.lockPlayerMovement();
        await delay(400);
        jim.updateDirection("left");
        await delay(200);
        await jim.alert();
        await delay(200);
        jim.updateDirection("down");
        await delay(400);
        jim.updateDirection("left");
        await delay(400);
        await jim.speechID([
            "jims_help_1",
            "jims_help_2",
            "jims_help_3",
            "jims_help_4",
            "jims_help_5",
            "jims_help_6",
            "jims_help_7",
            "jims_help_8",
            "jims_help_9",
        ],"???");
        await jim.sayID("jims_help_10");
        world.unlockPlayerMovement();
        world.globalState.playedEnterTrigger = true;
        await delay(200);
        jim.updateDirection("down");
    },
    meeting_frogert: async (world,frogert) => {
        world.lockPlayerMovement();
        await delay(200);
        world.autoCameraOff();
        await world.moveCamera(...frogert.location,700);
        frogert.updateDirection("left");
        await delay(200);
        world.playerObject.updateDirection("right");
        await frogert.alert();
        world.popupProgressEnabled = false;
        frogert.sayID("stranger_danger");
        frogert.speed *= 1.25;
        world.followObject = frogert;
        world.autoCameraOn();
        frogert.move({x:4});
        await delay(1500);
        frogert.updateDirection("up");
        await delay(400);
        frogert.hidden = true;
        await delay(1000);
        await world.moveCamera(...world.playerObject.location,700);
        world.followObject = null;
        world.removeObject(frogert.ID);
        await delay(300);
        world.unlockPlayerMovement();
        world.clearTextPopup();
        world.popupProgressEnabled = true;
        world.globalState.metFrogert = true;
    },
    frogert_doorway: async (world,frogert) => {
        await frogert.sayID('who is it?');
        let whoItIs = await world.showPrompt("who are you?","mom","your neighbor","not really sure","knock knock");
        await frogert.sayID([
            'mom..?\nyou sound different.\ndid you start drinking again?',
            'ohhh, jim? long time no see.\ncome on in!',
            'sorry \'not really sure\', but i can\'t let strangers in.',
            'uhh, who\'s there?'
        ][whoItIs]);
        if(whoItIs === 1) {
            world.globalState.frogertDoorSequenceComplete = true;
        } else if(whoItIs === 3) {
            whoItIs = await world.showPrompt("who are you?","mom","your neighbor","frogert");
            await frogert.sayID([
                'mom..?\nmom who?',
                'my neighbor who?',
                'frogert. huh. are you my clone?\nfrogert who?'
            ][whoItIs]);
            whoItIs = await world.showPrompt("punchline","let me in","i'm coming in",[
                "your mom!",
                "your neighbor that wants in",
                "frogert the frog"
            ][whoItIs]);
            switch(whoItIs) {
                case 0:
                    await frogert.sayID('only if you ask nicely');
                    let askingNicely = await world.showPrompt("do you want to ask nicely?","no","yes","bye");
                    switch(askingNicely) {
                        case 0:
                            await frogert.sayID('please leave now. i don\'t have time for your rudeness.');
                            break;
                        case 1:
                            await frogert.sayID('see, that\'s better. you may come in, now.');
                            world.globalState.frogertDoorSequenceComplete = true;
                            break;
                        case 2:
                            await frogert.sayID('oh. okay. bye then.');
                            break;
                    }
                    break;
                case 1:
                    await frogert.sayID('what makes you think you can just barge on in here?');
                    let reason = world.showPrompt('what do you want to say?',"my boldness","time constraints","i have a key to the city");
                    switch(reason) {
                        case 0:
                            frogert.speechID([
                                'yeah, right. \'boldness\'',
                                'you know who else is bold? crazy people.',
                                'try again next time.\ni\'ve got enough of my own crazy in here.'
                            ]);
                            break;
                        case 1:
                            frogert.speechID([
                                'alright. that\'s fair.',
                                'you\'ve got places to be, i get it.',
                                'really, i do.',
                                'you can come in, now.',
                            ]);
                            world.globalState.frogertDoorSequenceComplete = true;
                            break;
                        case 2:
                            await frogert.speechID([
                                'really? a key to the city?',
                                'what\'s the mayors name, then?'
                            ]);
                            let mayorName = world.showPrompt("what is the mayor's name?","john smith","me","frogert","boney elf");
                            const notTheMayor = 'you\'re not the mayor...';
                            switch(mayorName) {
                                case 0:
                                    await frogert.speechID([
                                        notTheMayor,
                                        'john smith? john smith at yahoo.com?',
                                        'well you must have important things to do, john smith.',
                                        'i\'ll let you be on your way, now.',
                                        'i only let trusted people in my home.'
                                    ]);
                                    break;
                                case 1:
                                    await frogert.speechID([
                                        'hmm. you don\'t sound like the mayor.',
                                        'in fact, we don\'t even have a mayor. we just have town meetings.',
                                        'anyhow, i don\'t let liars into my home.'
                                    ]);
                                    break;
                                case 2:
                                    await frogert.speechID([
                                        'alright, look wise guy. i know you\'re not frogert.',
                                        'and i know you think you\'re sooooooo funny, but i\'m not going to let you in my home just because you can make a decent joke.'
                                    ])
                                    break;
                                case 3:
                                    await frogert.speechID([
                                        notTheMayor,
                                        'oh. you\'re that creep that lives next door.',
                                        'i would prefer you not coming in, it took me a week to get the stench of your booze out of here last time.',
                                        'come back when you\'ve laid off the booze.'
                                    ]);
                                    break;
                            }
                            break;
                    }
                    break;
                case 2:
                    await frogert.speechID([
                        'wow. that\'s a reallllly good joke...\n*cough*',
                        'if you want in my house you\'re gonna have to do better than that'
                    ]);
                    break;
            }
        } else if(whoItIs === 0) {
            await frogert.sayID('well, now is not a good time, mom.\ni\'m hiding from that stranger outside, you should lookout.');
        }
    }
};
