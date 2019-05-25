const delay = time => new Promise(resolve => setTimeout(resolve,time));

const scripts = {
    jim_gets_the_hell_out_of_the_way: async function(world,jim) {
        world.lockPlayerMovement();
        await world.showPrompt("what do you want to whisper?",["i love you","please move","uh.. nice panel?"]);
        await delay(800);
        await world.showNamedTextPopupID("jims_intrigue",jim.prefix);
        await world.moveSprite(jim,[{y:2},{x:1}]);
        await delay(300);
        jim.updateDirection("up");
        await delay(700);
        jim.updateDirection("left");
        await delay(800);
        await world.showNamedTextPopupID("jims_journey",jim.prefix);
        world.globalState.jimMoved = true;
        world.unlockPlayerMovement();
        await delay(250);
        jim.updateDirection("up");
        world.globalState.jimsDirection = "up";
    },
    how_to_press_enter: async function(world,jim) {
        world.lockPlayerMovement();
        await delay(200);
        jim.updateDirection("left");
        await delay(400);
        jim.updateDirection("down");
        await delay(400);
        jim.updateDirection("left");
        await delay(400);
        await world.showNamedTextPopupsID([
            "jims_help_1",
            "jims_help_2",
            "jims_help_3",
            "jims_help_4",
            "jims_help_5",
            "jims_help_6",
            "jims_help_7",
            "jims_help_8",
            "jims_help_9",
        ],"B???:B ");
        await world.showNamedTextPopupID("jims_help_10",jim.prefix);
        world.unlockPlayerMovement();
        world.globalState.playedEnterTrigger = true;
        await delay(200);
        jim.updateDirection("down");
    }
};
