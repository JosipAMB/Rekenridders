import { genereerSom } from '../Systems/Mathgenerator.js';

    class Level1Scene extends Phaser.Scene {
    constructor() {
        super('Level1Scene');
    }

    preload() {
        this.load.image('background', 'Assets/Background_2.png');

        this.load.spritesheet('idle', 'Assets/IDLE.png', {
            frameWidth: 96,
            frameHeight: 84
        });
        this.load.spritesheet('run', 'Assets/RUN.png', {
            frameWidth: 96,
            frameHeight: 84
        });
        this.load.spritesheet('jump', 'Assets/JUMP.png', {
            frameWidth: 96,
            frameHeight: 84
        });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // achtergrond eerst
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(W, H);

        // platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(W / 2, H - 10, null)
            .setDisplaySize(W, 40)
            .setTint(0x8B4513)
            .refreshBody();
        this.platforms.create(300, H - 150, null)
            .setDisplaySize(200, 20)
            .setTint(0x8B4513)
            .refreshBody();
        this.platforms.create(600, H - 250, null)
            .setDisplaySize(200, 20)
            .setTint(0x8B4513)
            .refreshBody();
        this.platforms.create(200, H - 350, null)
            .setDisplaySize(200, 20)
            .setTint(0x8B4513)
            .refreshBody();

        // speler NA platforms
        this.player = this.physics.add.sprite(100, H - 150, 'idle');
        this.player.setScale(2);
        this.player.body.setSize(28, 30);
        this.player.body.setOffset(28, 30);
        this.player.play('idle');

        // camera NA speler
        this.cameras.main.startFollow(this.player);

        // colliders
        this.physics.add.collider(this.player, this.platforms);

        // kist
        this.chest = this.physics.add.staticImage(400, H - 70, null)
            .setDisplaySize(50, 50)
            .setTint(0xFFD700)
            .refreshBody();
        this.physics.add.collider(this.player, this.chest);

        // toetsen
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // animaties
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 6 }),
            frameRate: 4,
            repeat: -1
        });
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('run', { start: 0, end: 7 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 4 }),
            frameRate: 8,
            repeat: 0
        });
    }

    update() {
        const inLucht = !this.player.body.blocked.down;

        const bijKist = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.chest.x, this.chest.y
        ) < 80;

        if (bijKist && Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.openKist();
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
            if (!inLucht) this.player.play('run', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
            if (!inLucht) this.player.play('run', true);
        } else {
            this.player.setVelocityX(0);
            if (!inLucht) this.player.play('idle', true);
        }

        if (this.cursors.up.isDown && !inLucht) {
            this.player.setVelocityY(-300);
            this.player.play('jump', true);
        }
    }

    openKist() {
        const som = genereerSom();

        // zet tekst vast aan camera zodat het altijd zichtbaar is
        const vraagTekst = this.add.text(
            this.scale.width / 2,
            this.scale.height / 4,
            som.vraag,
            { fontSize: '48px', fill: '#ffffff', backgroundColor: '#000000', padding: { x: 20, y: 10 } }
        )
        .setOrigin(0.5)
        .setScrollFactor(0);  // ← dit zorgt dat tekst vast blijft aan scherm

        som.antwoorden.forEach((antwoord, index) => {
            const knop = this.add.text(
                150 + (index * 220),
                this.scale.height / 2,
                antwoord,
                { fontSize: '36px', fill: '#ffffff', backgroundColor: '#4CAF50', padding: { x: 20, y: 10 } }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)  // ← ook vast aan scherm
            .setInteractive();

            knop.on('pointerdown', () => {
                if (antwoord === som.juistAntwoord) {
                    console.log('Goed!');
                } else {
                    console.log('Fout!');
                }
            });
        });
    }
}

export default Level1Scene;