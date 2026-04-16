import { HealthSysteem } from '../Systems/Healthsysteem.js';
import { genereerSom } from '../Systems/Mathgenerator.js';

class BossScene extends Phaser.Scene {
    constructor() {
        super('BossScene');
    }

    preload() {
        this.load.image('draak', 'Assets/draak.png');
        this.load.image('background', 'Assets/Background_2.png');
    }

    create(data) {
        const W = this.scale.width;   
        const H = this.scale.height;  
        // hp overnemen van Level1
        const beginHp = data.hp || 5;
        this.health = new HealthSysteem(this, 5, beginHp);
        console.log('HP overgenomen:', this.health.huidigHp); //  check wat er binnenkomt

        // achtergrond
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(W, H);

        // draak
        this.draak = this.add.image(W - 200, H / 2, 'draak')
            .setScale(5);

        // boss hp
        this.bossHp = 5;
        this.bossHpTekst = this.add.text(W - 200, 50, '🐉🐉🐉🐉🐉', {
            fontSize: '32px'
        }).setOrigin(0.5);

        // speler hp
        this.hpTekst = this.add.text(20, 20, '❤️❤️❤️❤️❤️', {
            fontSize: '32px'
        });

        this.spelActief = true;
        this.updateHp(); // ← hartjes meteen updaten bij start
        this.toonSom();
    }

    toonSom() {
        if (!this.spelActief) return;  //  stop als spel voorbij is
        const som = genereerSom();
        const elementen = [];

        const vraagTekst = this.add.text(
            this.scale.width / 2,
            this.scale.height / 4,
            som.vraag,
            { fontSize: '48px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 20, y: 10 } }
        )
        .setOrigin(0.5);

        elementen.push(vraagTekst);

        som.antwoorden.forEach((antwoord, index) => {
            const knop = this.add.text(
                150 + (index * 220),
                this.scale.height / 2,
                antwoord,
                { fontSize: '36px', fill: '#ffffff', backgroundColor: '#4CAF50', padding: { x: 20, y: 10 } }
            )
            .setOrigin(0.5)
            .setInteractive();

            elementen.push(knop);

           knop.on('pointerdown', () => {
                elementen.forEach(el => el.destroy());

                if (antwoord === som.juistAntwoord) {
                    this.bossSchade();
                } else {
                    this.health.schade();
                    this.updateHp();
                    this.toonSom();
                }
            });
        });
    }

    bossSchade() {
        this.bossHp--;
        this.updateBossHp();

        if (this.bossHp <= 0) {
            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                'Je hebt gewonnen! ',
                { fontSize: '64px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 20, y: 10 } }
            ).setOrigin(0.5);
        } else {
            this.toonSom();
        }
    }

    updateHp() {
        let hartjes = '';
        for (let i = 0; i < this.health.maxHp; i++) {
            hartjes += i < this.health.huidigHp ? '❤️' : '🖤';
        }
        this.hpTekst.setText(hartjes);

        if (this.health.huidigHp <= 0) {
            this.spelActief = false;  //  spel stoppen

            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                'Game Over! ',
                { fontSize: '64px', fill: '#ff0000', backgroundColor: '#000000', padding: { x: 20, y: 10 } }
            ).setOrigin(0.5);
        }
    }

    updateBossHp() {
        let draakjes = '';
        for (let i = 0; i < 5; i++) {
            draakjes += i < this.bossHp ? '🐉' : '💀';
        }
        this.bossHpTekst.setText(draakjes);
    }
}

export default BossScene;