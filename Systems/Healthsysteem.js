export class HealthSysteem {
    constructor(scene, maxHp = 5, beginHp = null) {
    this.scene = scene;
    this.maxHp = maxHp;
    this.huidigHp = beginHp !== null ? beginHp : maxHp;
    }

    schade() {
        if (this.huidigHp > 0) {
            this.huidigHp--;
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