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

        // achtergrond
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(W, H);

        // draak
        this.draak = this.add.image(W - 200, H / 2, 'draak')
            .setScale(Math.min(5, Math.max(2, W / 160)));

        // boss hp (FIX)
        this.bossMaxHp = 5;
        this.bossHp = this.bossMaxHp;

        this.bossHpTekst = this.add.text(W - 200, 50, '', {
            fontSize: '32px'
        }).setOrigin(0.5);

        // speler hp
        this.hpTekst = this.add.text(20, 20, '', {
            fontSize: '32px'
        });

        this.spelActief = true;

        this.updateHp();
        this.updateBossHp();
        this.toonSom();
        this.scale.on('resize', this.handleResize, this);
        this.events.once('shutdown', () => {
            this.scale.off('resize', this.handleResize, this);
        });
    }

    toonSom() {
        if (!this.spelActief) return;

        const som = genereerSom();
        const elementen = [];

        const vraagTekst = this.add.text(
            0,
            0,
            som.vraag,
            {
                fontSize: '48px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 16, y: 10 }
            }
        ).setOrigin(0.5);

        elementen.push(vraagTekst);

        som.antwoorden.forEach((antwoord, index) => {
            const knop = this.add.text(
                0,
                0,
                antwoord,
                {
                    fontSize: '36px',
                    fill: '#ffffff',
                    backgroundColor: '#4CAF50',
                    padding: { x: 14, y: 10 }
                }
            )
            .setOrigin(0.5)
            .setInteractive();

            elementen.push(knop);

            knop.on('pointerdown', () => {
                if (!this.spelActief) return;

                elementen.forEach(el => el.destroy());
                this.activeQuestionElements = null;

                if (antwoord === som.juistAntwoord) {
                    this.bossSchade();
                } else {
                    this.health.schade();
                    this.updateHp();
                    this.toonSom();
                }
            });
        });
        this.activeQuestionElements = elementen;
        this.layoutQuestion(this.scale.width, this.scale.height);
    }

    bossSchade() {
        this.bossHp--;
        this.updateBossHp();

        if (this.bossHp <= 0) {
            this.spelActief = false;

            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                'Je hebt gewonnen!',
                {
                    fontSize: `${Math.min(64, this.scale.width / 8)}px`,
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { x: 20, y: 10 }
                }
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
            this.spelActief = false;

            this.add.text(
                this.scale.width / 2,
                this.scale.height / 2,
                'Game Over!',
                {
                    fontSize: `${Math.min(64, this.scale.width / 8)}px`,
                    fill: '#ff0000',
                    backgroundColor: '#000000',
                    padding: { x: 20, y: 10 }
                }
            ).setOrigin(0.5);
        }
    }

    updateBossHp() {
        let draakjes = '';

        for (let i = 0; i < this.bossMaxHp; i++) {
            draakjes += i < this.bossHp ? '🐉' : '💀';
        }

        this.bossHpTekst.setText(draakjes);
    }

    handleResize(gameSize) {
        const { width, height } = gameSize;
        this.children.list
            .find(child => child.texture?.key === 'background')
            ?.setDisplaySize(width, height);
        this.draak.setPosition(width - Math.min(200, width * 0.3), height / 2)
            .setScale(Math.min(5, Math.max(2, width / 160)));
        this.bossHpTekst.setPosition(width - Math.min(200, width * 0.3), 50);
        this.hpTekst.setPosition(20, 20);
        this.layoutQuestion(width, height);
    }

    layoutQuestion(width, height) {
        if (!this.activeQuestionElements) return;
        this.activeQuestionElements[0]
            .setPosition(width / 2, height * 0.24)
            .setFontSize(Math.min(48, width / 9));
        this.activeQuestionElements.slice(1).forEach((knop, index) => {
            knop
                .setPosition(
                    width * (index % 2 === 0 ? 0.28 : 0.72),
                    height * (index < 2 ? 0.48 : 0.68)
                )
                .setFontSize(Math.min(36, width / 12));
        });
    }
}

export default BossScene;