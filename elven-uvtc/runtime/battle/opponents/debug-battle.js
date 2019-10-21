import RotatingBackground from "../../../renderers/components/rotating-background.js";
import { IncomingSnowball } from "../../../renderers/components/battle/snowball.js";

addOpponent("debug-battle",function(applicator) {
    applicator({
        effects: {
            staticBackground: new RotatingBackground("tutorial-place")
        },
        opponentSprite: {
            name: "burr",
            isElf: false,
            customWidth: 16,
            customHeight: 32,
            yOffset: 0.55,
            impactFrame: 0,
            renderScale: 65,
        },
        tileset: "tutorial-place",
        fogColor: "rgba(255,255,255,0)",
        opponentMaxHealth: 1000,
        playerMaxHealth: 1000,
        opponentHeartID: 0,
        endPoints: {
            gameStart: async function() {
                this.unlockMovement();
                while(true) {
                    if(this.getPlayerOpponentDistance().xInRange && !this.weapon.attacking) {
                        let snowball;
                        snowball = new IncomingSnowball(true,()=>{
                            playSound("snowball");
                            this.damagePlayer(1);
                        },()=>{
                            this.foregroundEffects.removeLayer(snowball.renderID);
                        });
                        snowball.renderID = this.foregroundEffects.addLayer(snowball);
                        await this.delay(500);
                    }
                    await this.delay(100);
                }
                await for_the_end_of_the_universe();
            },
            opponentInjured: async function(amount) {
            },
            roundEnd: async function(playerWon,roundNumber) {
            },
            gameOver: async function(playerWon,roundNumber) {
            },
            roundStart: async function(playerWon,roundNumber) {
            }
        }
    });
});
