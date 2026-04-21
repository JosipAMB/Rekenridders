import { genereerSom } from '../Systems/Mathgenerator.js';

export class Chest {
    constructor(scene, x, y) {
        this.scene = scene;
        this.isOpen = false;

        this.image = scene.physics.add.staticImage(x, y, null)
            .setDisplaySize(50, 50)
            .setTint(0xFFD700)
            .refreshBody();
    }

    open(health, updateHp) {
        if (this.isOpen) return; 
        if (!this.scene.spelActief) return;

        this.isOpen = true;

        const som = genereerSom();
        const elementen = [];

        const vraagTekst = this.scene.add.text(
            this.scene.scale.width / 2,
            this.scene.scale.height / 4,
            som.vraag,
            { fontSize: '48px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 20, y: 10 } }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);

        elementen.push(vraagTekst);

        const startX = this.scene.scale.width / 2 - ((som.antwoorden.length - 1) * 220) / 2;

        som.antwoorden.forEach((antwoord, index) => {
            const knop = this.scene.add.text(
                startX + (index * 220),
                this.scene.scale.height / 2,
                antwoord,
                { fontSize: '36px', fill: '#ffffff', backgroundColor: '#4CAF50', padding: { x: 20, y: 10 } }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setInteractive();

            elementen.push(knop);

            knop.on('pointerdown', () => {
                if (antwoord === som.juistAntwoord) {
                    health.genees();
                } else {
                    health.schade();
                }

                updateHp();
                elementen.forEach(el => el.destroy());
            });
        });
    }
}