const stringLookup = {
    bookcase_1: "There's a lot of books on this shelf.",
    bed_1: "A sleeping bag on a hardwood floor, a fine luxury.",
    bookcase_2: "Lots of books here... A lot of them seem to mention some kind of card game?",
    bookcase_3: "This bookcase demonstrates that it's okay to be small.\nWay to go bookcase!",
    table_1: "These plastic, foldable tables have seen a lot of life.\nAre they for parties?",
    table_2: "These tables are pretty much everywhere.",
    counter_1: "This must be a kitchen... Seems to be missing a few things, though.",
    counter_2: "This is the cleanest kitchen you've seen in your entire life.",
    sink_1: "It's important to wash your hands!",
    toilet_1: "It's important to use toilets!",
    bathtub_1: "It's important to wash... yourself.",
    bookcase_4: "This bookcase doesn't have very many books on it.",
    bookcase_5_1: "This bookcase has a few intersting books on it.",
    bookcase_5_2: "One book is called \"the cat lady manifesto\"",
    bookcase_5_3: "ȸIf I loved my children as much as I love my cats, I'd have children.ȸ",
    bookcase_6_1: "This bookcase is trying to be an edgy reflection of society.",
    bookcase_6_2: "Is it working?",
    bookcase_7_1: "This bookcase seems to be more inappropriate than the other bookcases.",
    bookcase_7_2: "Hey... What're you wearing?",
    couch_1: "This couch looks too clean to sit on.\nWho gets a white couch anyways?",
    jims_journey: "That was quite the journey...\nYou may use the door, now.",
    jims_kink: "If you whisper something in my right ear I'll get out of your way.",
    jims_intrigue: "Oh. My. I'll be getting out of your way, now.",
    jims_postop: "Let's stay in touch. Hehe.",
    sleepingbag_1: "Hmm... Sleeping bags seem to be in style in this town.",
    bookcase_8_1: "There's not many books on this shelf, but there are a few interesting ones.",
    bookcase_8_2: "ȸOwning Two Pieces of Furniture for Dummiesȸ",
    bookcase_8_3: "It seems to be a book about minimalism.",
    sleepingbag_2: "Whoever lives here also has a sleeping bag. Do they only come in one color?",
    rudetable: "Someone didn't bring the chair back to the table. How rude!",
    dryer_1: "What kind of a heathen has their dryer on the left?",
    washer_1: "The washer being on the right is making you very uncomfortable.",
    sb_1: "A lot of people must sleep here.",
    sb_2: "This sleeping bag doesn't want to be bothered.",
    sb_3: "This sleeping bag is upset with the other sleeping bags.",
    sb_4: "Who would want to sleep this close to other people?",
    emptyshelf: "The books appear to have slipped into another dimension.",
    bookcase_9_1: "There's a notecard taped to this shelf.",
    bookcase_9_2: "'Adults only'",
    bookcase_9_3: "Hmm... this might be interesting.",
    bookcase_9_4_1: "Ew. There's more important things you should be doing than reading someone else's smut.",
    bookcase_9_4_2: "Ah, I see. Saving yourself for marriage.",
    longtable: "This table is long, yet, you can't help but feel disappointed by it.",
    indoor_tree: "An indoor tree? Finally, something unique in one of these houses.",
    nice_envo: "There's a nice atmosphere to do things at this table.",
    bright_idea: "What a bright idea putting a lamp next to two windows.",
    couch_2: "The couch has some light stains on it.",
    couch_3: "The couch is so bright it's hard to look at.",
    likes_books_1: "Wow. this person sure likes books.",
    likes_books_2: "You can't grab any books or else the whole house might fall apart.",
    bathtub_getaway: "This is clearly a room of luxury.",
    french_rev_1: "There's a book sticking out from under the pillow.",
    french_rev_2: "It says something about the French revolution.",
    sat_lt_1: "This lighting is satisfying.",
    sat_lt_1: "Perfectly symmetrical, as all things should be.",
    jims_help_1: "Oh. Hi there.",
    jims_help_2: "If you want to talk with me, come over to me and use your mouth.",
    jims_help_3: "...",
    jims_help_4: "Oh. You don't know how to use your mouth?",
    jims_help_5: "...",
    jims_help_6: "Well, this is awkward.",
    jims_help_7: "Give me a second.",
    jims_help_8: "...",
    jims_help_9: "What? You already figured it out?",
    jims_help_10: "Well, it's nice to meet you. My name is Jim.",
    you_can_never_leave: "You can't leave tumble woods yet! You have important things to do!",
    stranger_danger: "Ahh! Stranger danger! Get away from me!",
    AUTO_1: "You should probably go check if that frog you scared is okay first.",
    AUTO_2: "Who is it?",
    AUTO_3: "Mom..? You sound different. Did you start drinking again?",
    AUTO_4: "Ohhh, Jim? long time no see. Come on in!",
    AUTO_5: "Sorry 'not really sure', but I can't just let strangers in without a warrant.",
    AUTO_6: "Uhh, who's there?",
    AUTO_7: "Mom..? Mom who?",
    AUTO_8: "My neighbor who?",
    AUTO_9: "Frogert. Huh. Are you my clone?\nFrogert who?",
    AUTO_10: "Only if you ask nicely.",
    AUTO_11: "Please leave now. I don't have time for your rudeness.",
    AUTO_12: "See, that's better. You may come in, now.",
    AUTO_13: "Oh. Okay. Bye then.",
    AUTO_14: "What makes you think you can just barge on in here?",
    AUTO_15: "What do you want to say?",
    AUTO_16: "Yeah, right. 'Boldness'",
    AUTO_17: "You know who else is bold? Crazy people.",
    AUTO_18: "Try again next time. I've got enough of my own crazy in here.",
    AUTO_19: "Alright. That's fair.",
    AUTO_20: "You've got places to be, I get it.",
    AUTO_21: "Really, I do.",
    AUTO_22: "You can come in, now.",
    AUTO_23: "Really? A key to the city?",
    AUTO_24: "What's the mayors name, then?",
    AUTO_25: "You're not the mayor...",
    AUTO_26: "John Smith? John Smith at yahoo.com?",
    AUTO_27: "Well you must have important things to do, John Smith.",
    AUTO_28: "I'll let you be on your way, now.",
    AUTO_29: "I only let trusted people in my home.",
    AUTO_30: "Hmm. You don't sound like the mayor.",
    AUTO_31: "In fact, we don't even have a mayor. We just have town meetings.",
    AUTO_32: "Anyhow, I don't let liars into my home.",
    AUTO_33: "Alright, look wise guy. I know you're not Frogert.",
    AUTO_34: "And I know you think you're sooooooo funny, but I'm not going to let you in my home just because you can make a decent joke.",
    AUTO_35: "Oh. You're that creep that lives next door.",
    AUTO_36: "I would prefer you not coming in, it took me a week to get the stench of your booze out of here last time.",
    AUTO_37: "Come back when you've laid off the booze.",
    AUTO_38: "Wow. That's a reallllly good joke... *cough*",
    AUTO_39: "If you want in my house you're gonna have to do better than that.",
    AUTO_40: "Well, now is not a good time, mom. I'm hiding from that stranger outside. You should look out.",
    AUTO_41: "Oh! Before you go, could you go and meet your neighbor? He doesn't have a lot of friends. Thanks.",
    AUTO_42: "Go get me some beer, dude. ah, I mean, uh, 'friend'.",
    AUTO_43: "f- friend? After everything we've been through together? What are you, crazy!",
    AUTO_44: "What? It's only been about a minute?",
    AUTO_45: "...",
    AUTO_46: "Well, at any rate, I suppose. maybe... just maybe, we could be friends.",
    AUTO_47: "... just don't touch me, please.",
    AUTO_48: "Okay. Now that we're 'friends', why don't you be a pal and get me a beer from the ȴtavern?ȴ",
    AUTO_49: "Follow the path and keep north, it's right at the base of ȴgreat lake tumble.ȴ",
    AUTO_50: "And don't take too long, I want it to be cold when you bring it back.",
    AUTO_51: "Hey! You're the same stranger from outside!",
    AUTO_52: "You tricked me!",
    AUTO_53: "Uh. Hi. I'm still not okay with you coming in here on false pretenses.",
    AUTO_54: "Explain yourself.",
    AUTO_55: "...",
    AUTO_56: "Well. I can't argue with that logic.",
    AUTO_57: "Honestly? That is sooo relatable.",
    AUTO_58: "I feel like I understand everything we've been through together so much better now.",
    AUTO_59: "I think we will be the best of pals",
    AUTO_60: "Great pals.",
    AUTO_61: "Pals forever.",
    AUTO_62: "Pals who definitely won't betray each other.",
    AUTO_63: "Ever.",
    AUTO_64: "You should be a good friend and get a beer from the ȴtavernȴ for Frogert. You can go here later."
}
const strings = stringLookup;
const getString = function(ID) {
    return stringLookup[ID];
}
const getSyllableMap = function(word) {
    word = word.toLowerCase();
    return wordSyllableMaps[word];
}
