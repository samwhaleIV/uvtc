addMap({
    WorldState: function(world,data) {
        let mascara;
        let shiver;
        let burr;
        this.load = world => {
            world.addPlayer(10,3,"down");
            mascara = world.getStaticCharacter("mascara");
            shiver = world.getStaticCharacter("shiver");
            burr = world.getStaticCharacter("burr");
        }
        this.doorClicked = () => {
            const newMapData = {
                fromDoorWay: true,
            };
            world.updateMap("tumble_woods",newMapData);
        }
        this.otherClicked = async type => {
            switch(type) {
                case 16:
                    //shiver interacted
                    const moveUnlockSegment = async () => {
                        world.globalState.shiverGaveGift = true;
                        world.globalState.shiverWantsToGiveAGift = false;
                        world.movesManager.unlockMove("Iced Whiskey");
                        await shiver.sayID("AUTO_65");
                        await world.showInstantTextPopupSound("You received the move ȴIced Whiskey!ȴ");
                    }

                    if(world.globalState.burrGotBeer && world.globalState.shiverGotBeer) {
                        if(world.globalState.shiverWantsToGiveAGift) {
                            moveUnlockSegment();
                            return;
                        } else {
                            shiver.sayID("AUTO_66");
                            return;
                        }
                    } else if(world.globalState.gotBeer) {
                        if(world.globalState.shiverGotBeer) {
                            shiver.sayID("AUTO_67");
                            return;
                        }
                        world.globalState.shiverGotBeer = true;
                        world.globalState.gotBeer = false;
                        await world.showInstantTextPopupSound("You gave your beer to Shiver.");
                        await shiver.sayID("AUTO_125");
                        if(world.globalState.burrGotBeer && world.globalState.shiverGotBeer) {
                            moveUnlockSegment();
                        }
                    } else {
                        if(world.globalState.burrGotBeer) {
                            shiver.sayID("AUTO_68");
                        } else {
                            shiver.sayID("AUTO_69");
                        }
                    }
                    break;
                case 17:
                    //burr interacted
                    if(world.globalState.burrGotBeer && world.globalState.shiverGotBeer) {
                        burr.sayID("AUTO_70");
                        return;
                    }
                    if(world.globalState.gotBeer) {
                        if(world.globalState.burrGotBeer) {
                            burr.sayID("AUTO_71");
                            return;
                        }
                        world.globalState.burrGotBeer = true;
                        world.globalState.gotBeer = false;
                        await world.showInstantTextPopupSound("You gave your beer to Burr.");
                        await burr.sayID("AUTO_126");
                        if(world.globalState.burrGotBeer && world.globalState.shiverGotBeer) {
                            world.globalState.shiverWantsToGiveAGift = true;
                            shiver.sayID("AUTO_127");
                        }
                    } else {
                        if(world.globalState.shiverGotBeer) {
                            burr.sayID("AUTO_72");
                        } else {
                            burr.sayID("AUTO_73");
                        }
                    }
                    break;
                case 8:
                    //mascara interacted
                    await mascara.sayID("AUTO_74");
                    const reason = await world.showPrompt("what are you here for?","beer","friendship","my wife left me","all of the above");
                    world.lockPlayerMovement();
                    await delay(1000);
                    world.unlockPlayerMovement();
                    switch(reason) {
                        case 0:
                            await mascara.sayID("AUTO_75");
                            const manner = await world.showPrompt("pick your poison","cold beer","shaken not stirred","anthrax");
                            world.lockPlayerMovement();
                            await delay(1000);
                            world.unlockPlayerMovement();
                            switch(manner) {
                                case 0:
                                    if(world.globalState.gotBeer) {
                                        await mascara.sayID("AUTO_76");
                                        break;
                                    } else if(world.globalState.chairDrankBeer) {
                                        if(world.globalState.chairDrankBeerKnown) {
                                            await mascara.speechID([
                                                "AUTO_77"
                                            ]);
                                            await world.showInstantTextPopupSound("You received a beer!");
                                            world.globalState.gotBeer = true;
                                        } else {
                                            world.globalState.chairDrankBeerKnown = true;
                                            await mascara.speechID([
                                                "AUTO_78",
                                                "AUTO_79",
                                                "AUTO_80",
                                                "AUTO_81",
                                                "AUTO_82",
                                                "AUTO_83"
                                            ]);
                                            await world.showInstantTextPopupSound("You received a beer!");
                                            world.globalState.gotBeer = true;
                                        }

                                    } else if(world.globalState.chairAskedForABeer) {
                                        await mascara.sayID("AUTO_84");
                                        const forAChair = await world.showPrompt("is this beer for a chair","no","yes","none of your business");
                                        world.lockPlayerMovement();
                                        await delay(1000);
                                        world.unlockPlayerMovement();
                                        switch(forAChair) {
                                            case 0:
                                                await mascara.sayID("AUTO_85");
                                                await world.showInstantTextPopupSound("You received a beer!");
                                                world.globalState.gotBeer = true;
                                                break;
                                            case 1:
                                                await mascara.speechID([
                                                    "AUTO_86",
                                                    "AUTO_87",
                                                    "AUTO_88"
                                                ]);
                                                break;
                                            case 2:
                                                await mascara.speechID([
                                                    "AUTO_89",
                                                    "AUTO_90"
                                                ]);
                                                await world.showInstantTextPopupSound("You received a beer!");
                                                world.globalState.gotBeer = true;
                                                break;
                                        }
                                    } else {
                                        if(world.globalState.friendsWithMascara) {
                                            await mascara.sayID("AUTO_91")
                                        } else {
                                            await mascara.sayID("AUTO_92");
                                        }
                                        await world.showInstantTextPopupSound("You received a beer!");
                                        world.globalState.gotBeer = true;
                                    }
                                    break;
                                case 1:
                                    await mascara.sayID("AUTO_93");
                                    break;
                                case 2:
                                    await mascara.sayID("AUTO_94");
                                    break;
                            }
                            break;
                        case 1:
                            if(world.globalState.friendsWithMascara) {
                                await mascara.sayID("AUTO_95");
                                await world.showInstantTextPopupSound("Congratulations! Mascara is still your friend!");
                            } else {
                                world.globalState.friendsWithMascara = true;
                                await mascara.sayID("AUTO_96");
                                await world.showInstantTextPopupSound("Congratulations! Mascara is now your friend!");
                                await mascara.sayID("AUTO_97");
                            }
                            break;
                        case 2:
                            await mascara.sayID("AUTO_98");
                            break;
                        case 3:
                            await mascara.speechID([
                                "AUTO_99",
                                "AUTO_100"
                            ]);
                            break;
                    }
                    break;
                case 10:
                    if(world.globalState.chairDrankBeer && world.globalState.gotBeer) {
                        world.globalState.gotBeer = false;
                        await world.showTextPopupID("AUTO_101");
                        await world.showInstantTextPopup("You really should not give this chair beer.");
                        await world.showTextPopupID("AUTO_102");
                        await world.showInstantTextPopup("The chair stole the beer from you and drank it all in one sip.");
                        await world.showTextPopupID("AUTO_103");
                    } else if(world.globalState.gotBeer) {
                        world.globalState.chairDrankBeer = true;
                        world.globalState.gotBeer = false;
                        await world.showTextPopupID("AUTO_104");
                        await world.showInstantTextPopup("The chair stole the beer from you and drank it all in one sip.");
                        await world.showTextPopupsID([
                            "AUTO_105",
                            "AUTO_106"
                        ]);
                        await world.showInstantTextPopup("... Clearly you've made a terrible mistake.");
                    } else {
                        world.globalState.chairAskedForABeer = true;
                        world.globalState.gotBeer = false;
                        await world.showTextPopupID("AUTO_107");
                    }
                    break;
                case 11:
                    world.showTextPopupsID([
                        "AUTO_108",
                        "AUTO_109"
                    ]);
                    break;
                case 14:
                    world.showTextPopupsID([
                        "AUTO_110",
                        "AUTO_111",
                        "AUTO_112",
                        "AUTO_113"
                    ]);
                    break;
                case 12:
                    world.showTextPopupsID([
                        "AUTO_114",
                        "AUTO_115",
                        "AUTO_116",
                        "AUTO_128"
                    ]);
                    break;
                case 13:
                    world.showTextPopupID("AUTO_117");
                    break;
                case 15:
                    world.showTextPopupID("AUTO_118");
                    break;
                case 18:
                    world.showTextPopupID("AUTO_119")
                    break;
                case 9:
                    world.showTextPopupID("AUTO_120");
                    break;
            }
        }
        let activeTrigger = null;
        this.triggerActivated = async triggerID => {
            if(activeTrigger) {
                return;
            }
            activeTrigger = triggerID;
            switch(triggerID) {
                case 1:
                    if(world.globalState.tavernEnterTrigger) {
                        return;
                    }
                    await shiver.sayID(
                        "AUTO_121"
                    );
                    await burr.sayID(
                        "AUTO_122"
                    );
                    await shiver.sayID(
                        "AUTO_123"
                    );
                    world.globalState.tavernEnterTrigger = true;
                    break;
            }
        }
        this.triggerDeactivated = () => {
            activeTrigger = null;
        }
    },
    name: "tavern",
    doors: [
        "to_tumble_woods"
    ]
});
