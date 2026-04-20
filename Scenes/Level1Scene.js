import { HealthSysteem } from '../Systems/Healthsysteem.js';
import { Chest } from '../Systems/Chest.js';

class Level1Scene extends Phaser.Scene {
    constructor() {
        super('Level1Scene');
    }

    preload() {
        this.load.image('background', 'Assets/Background_2.png');
        this.load.spritesheet('idle', 'Assets/IDLE.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('run', 'Assets/RUN.png', { frameWidth: 96, frameHeight: 84 });
        this.load.spritesheet('jump', 'Assets/JUMP.png', { frameWidth: 96, frameHeight: 84 });
    }

    create() {
        this.spelActief = true;
        this.W = this.scale.width;
        this.H = this.scale.height;
        const W = this.W;
        const H = this.H;

        this.health = new HealthSysteem(this);

        // achtergrond
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(4000, H)
            .setScrollFactor(0.5);

        // hartjes
        this.hpTekst = this.add.text(20, 20, '❤️❤️❤️❤️❤️', { fontSize: '32px' })
            .setScrollFactor(0);

        // platforms
        this.platforms = this.physics.add.staticGroup();

        // grond met gaten
        this.platforms.create(600, H - 10, null).setDisplaySize(1200, 40).refreshBody();
        this.platforms.create(1800, H - 10, null).setDisplaySize(600, 40).refreshBody();
        this.platforms.create(2700, H - 10, null).setDisplaySize(800, 40).refreshBody();
        this.platforms.create(3800, H - 10, null).setDisplaySize(800, 40).refreshBody();

        // zwevende platforms
        this.platforms.create(500, H - 150, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(800, H - 280, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(1050, H - 180, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(1300, H - 320, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(1550, H - 220, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(1750, H - 350, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(2000, H - 200, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(2250, H - 300, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(2500, H - 180, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(2800, H - 280, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(3100, H - 350, null).setDisplaySize(150, 20).refreshBody();
        this.platforms.create(3400, H - 220, null).setDisplaySize(150, 20).refreshBody();

        // speler
        this.player = this.physics.add.sprite(100, H - 150, 'idle');
        this.player.setScale(2);
        this.player.body.setSize(28, 30);
        this.player.body.setOffset(28, 30);
        this.player.play('idle');

        // camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 4000, H);
        this.physics.world.setBounds(0, 0, 4000, H);

        // colliders
        this.physics.add.collider(this.player, this.platforms);

        // kisten
        this.kisten = [
            new Chest(this, 800, H - 330),
            new Chest(this, 1750, H - 400),
            new Chest(this, 2250, H - 350),
            new Chest(this, 3100, H - 400),
        ];
        this.kisten.forEach(kist => {
            this.physics.add.collider(this.player, kist.image);
        });

        // toetsen
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        // animaties
        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 6 }), frameRate: 4, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('run', { start: 0, end: 7 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 4 }), frameRate: 8, repeat: 0 });

        // deur
        this.deur = this.physics.add.staticImage(4000, H - 70, null)
            .setDisplaySize(60, 80)
            .setTint(0xff0000)
            .refreshBody();

        this.physics.add.overlap(this.player, this.deur, () => {
            this.scene.start('BossScene', { hp: this.health.huidigHp });
        });
    }

    update() {
        const inLucht = !this.player.body.blocked.down;
        const H = this.H;

        // dood vallen
        if (this.player.y > H + 100) {
            this.health.schade();
            this.player.setPosition(100, H - 150);
            this.updateHp();
        }

        // kisten checken
        this.kisten.forEach(kist => {
            const bijKist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                kist.image.x, kist.image.y
            ) < 80;

            if (bijKist && Phaser.Input.Keyboard.JustDown(this.keyE)) {
                kist.open(this.health, () => this.updateHp());
            }
        });

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
                'Game Over! 💀',
                { fontSize: '64px', fill: '#ff0000', backgroundColor: '#000000', padding: { x: 20, y: 10 } }
            ).setOrigin(0.5).setScrollFactor(0);
        }
    }
}

export default Level1Scene;