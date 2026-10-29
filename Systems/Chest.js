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
            this.scene.scale.height * 0.24,
            som.vraag,
            {
                fontSize: `${Math.min(48, this.scene.scale.width / 9)}px`,
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 16, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);

        elementen.push(vraagTekst);

        som.antwoorden.forEach((antwoord, index) => {
            const knop = this.scene.add.text(
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
            .setScrollFactor(0)
            .setInteractive();

            elementen.push(knop);

            knop.on('pointerdown', () => {
                this.scene.scale.off('resize', layoutQuestion);
                this.scene.events.off('shutdown', removeResizeListener);
                if (antwoord === som.juistAntwoord) {
                    health.genees();
                } else {
                    health.schade();
                }

                updateHp();
                elementen.forEach(el => el.destroy());
            });
        });

        const layoutQuestion = gameSize => {
            const width = gameSize.width;
            const height = gameSize.height;
            vraagTekst
                .setPosition(width / 2, height * 0.24)
                .setFontSize(Math.min(48, width / 9));
            elementen.slice(1).forEach((knop, index) => {
                knop
                    .setPosition(
                        width * (index % 2 === 0 ? 0.28 : 0.72),
                        height * (index < 2 ? 0.48 : 0.68)
                    )
                    .setFontSize(Math.min(36, width / 12));
            });
        };
        const removeResizeListener = () => this.scene.scale.off('resize', layoutQuestion);
        this.scene.scale.on('resize', layoutQuestion);
        this.scene.events.once('shutdown', removeResizeListener);
        layoutQuestion({ width: this.scene.scale.width, height: this.scene.scale.height });
    }
}