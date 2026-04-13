export class HealthSysteem {
    constructor(scene, maxHp = 5) {
        this.scene = scene;
        this.maxHp = maxHp;
        this.huidigHp = maxHp;
    }

    schade() {
        if (this.huidigHp > 0) {
            this.huidigHp--;
        }
        if (this.huidigHp <= 0) {
            this.gameOver();
        }
    }

    genees() {
        if (this.huidigHp < this.maxHp) {
            this.huidigHp++;
        }
    }

    gameOver() {
        console.log('Game Over!');
    }
}