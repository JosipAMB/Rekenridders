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
        this.platformLayouts = [];

        // grond met gaten
        this.createPlatform(300, 10, 1200, 40);
        this.createPlatform(4000, 10, 800, 40);

        // zwevende platforms
        this.createPlatform(500, 150, 150, 20);
        this.createPlatform(800, 280, 150, 20);
        this.createPlatform(1050, 180, 150, 20);
        this.createPlatform(1300, 320, 150, 20);
        this.createPlatform(1550, 220, 150, 20);
        this.createPlatform(1750, 350, 150, 20);
        this.createPlatform(2000, 200, 150, 20);
        this.createPlatform(2250, 300, 150, 20);
        this.createPlatform(2500, 180, 150, 20);
        this.createPlatform(2800, 280, 150, 20);
        this.createPlatform(3100, 350, 150, 20);
        this.createPlatform(3400, 220, 150, 20);

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
        this.kistLayouts = [
            { x: 800, bottomOffset: 330 },
            { x: 1750, bottomOffset: 400 },
            { x: 2250, bottomOffset: 350 },
            { x: 3100, bottomOffset: 400 }
        ];
        this.kisten = this.kistLayouts.map(layout =>
            new Chest(this, layout.x, H - layout.bottomOffset)
        );
        this.kisten.forEach(kist => {
            this.physics.add.collider(this.player, kist.image);
        });

        // toetsen
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.keyE = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.touchControls = { left: new Set(), right: new Set(), jump: new Set(), interact: new Set() };
        this.createTouchControls();
        this.input.on('pointerup', this.releaseTouchControl, this);
        this.input.on('pointerupoutside', this.releaseTouchControl, this);

        // animaties
        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 6 }), frameRate: 4, repeat: -1 });
        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('run', { start: 0, end: 7 }), frameRate: 5, repeat: -1 });
        this.anims.create({ key: 'jump', frames: this.anims.generateFrameNumbers('jump', { start: 0, end: 4 }), frameRate: 8, repeat: 0 });

        // deur
        this.deur = this.physics.add.staticImage(4000, H - 70, null)
            .setDisplaySize(60, 80)
            .setTint(0xff0000)
            .refreshBody();
        this.deurBottomOffset = 70;

        this.physics.add.overlap(this.player, this.deur, () => {
            this.scene.start('BossScene', { hp: this.health.huidigHp });
        });

        this.scale.on('resize', this.handleResize, this);
        this.events.once('shutdown', () => {
            this.scale.off('resize', this.handleResize, this);
            this.input.off('pointerup', this.releaseTouchControl, this);
            this.input.off('pointerupoutside', this.releaseTouchControl, this);
        });
    }

    update() {
        const inLucht = !this.player.body.blocked.down;
        const H = this.H;
        if (!this.spelActief) return; // zorgt dat spel stopt zodra dood

        // dood vallen
        if (this.player.y > H + 100) {
            this.health.schade();
            this.player.setPosition(100, H - 150);
            this.updateHp();
        }

        // kisten checken
        const interactPressed = (this.keyE && Phaser.Input.Keyboard.JustDown(this.keyE)) ||
            this.touchControls.interact.size > 0;
        this.kisten.forEach(kist => {
            const bijKist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                kist.image.x, kist.image.y
            ) < 80;

            if (bijKist && interactPressed) {
                kist.open(this.health, () => this.updateHp());
            }
        });

        const leftDown = this.cursors?.left.isDown || this.touchControls.left.size > 0;
        const rightDown = this.cursors?.right.isDown || this.touchControls.right.size > 0;
        if (leftDown && !rightDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
            if (!inLucht) this.player.play('run', true);
        } else if (rightDown && !leftDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
            if (!inLucht) this.player.play('run', true);
        } else {
            this.player.setVelocityX(0);
            if (!inLucht) this.player.play('idle', true);
        }

        if ((this.cursors?.up.isDown || this.touchControls.jump.size > 0) && !inLucht) {
            this.player.setVelocityY(-300);
            this.player.play('jump', true);
        }
    }

    createPlatform(x, bottomOffset, width, height) {
        const platform = this.platforms.create(x, this.H - bottomOffset, null)
            .setDisplaySize(width, height)
            .refreshBody();
        this.platformLayouts.push({ platform, bottomOffset });
    }

    createTouchControls() {
        const buttonStyle = {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            padding: { x: 14, y: 10 }
        };
        const definitions = [
            { key: 'left', label: '◀' },
            { key: 'right', label: '▶' },
            { key: 'jump', label: '⬆' },
            { key: 'interact', label: '📦' }
        ];

        this.controlButtons = {};
        definitions.forEach(({ key, label }) => {
            const button = this.add.text(0, 0, label, buttonStyle)
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(10)
                .setInteractive();
            button.on('pointerdown', pointer => {
                this.touchControls[key].add(pointer.id);
            });
            this.controlButtons[key] = button;
        });
        this.layoutTouchControls(this.W, this.H);
    }

    layoutTouchControls(width, height) {
        const buttonSize = Math.max(20, Math.min(42, width * 0.1));
        const positions = {
            left: [buttonSize + 12, height - buttonSize - 18],
            right: [buttonSize * 2 + 36, height - buttonSize - 18],
            jump: [width - buttonSize * 2 - 36, height - buttonSize - 18],
            interact: [width - buttonSize - 12, height - buttonSize - 18]
        };
        Object.entries(positions).forEach(([key, [x, y]]) => {
            const button = this.controlButtons[key];
            button.setPosition(x, y);
            button.setFontSize(buttonSize * 0.75);
            button.setPadding(
                buttonSize * 0.35,
                buttonSize * 0.25,
                buttonSize * 0.35,
                buttonSize * 0.25
            );
        });
    }

    releaseTouchControl(pointer) {
        Object.values(this.touchControls).forEach(pointerIds => pointerIds.delete(pointer.id));
    }

    handleResize(gameSize) {
        const oldHeight = this.H;
        this.W = gameSize.width;
        this.H = gameSize.height;
        this.platformLayouts.forEach(({ platform, bottomOffset }) => {
            platform.setY(this.H - bottomOffset).refreshBody();
        });
        this.kistLayouts.forEach((layout, index) => {
            this.kisten[index].image.setY(this.H - layout.bottomOffset).refreshBody();
        });
        this.player.y += this.H - oldHeight;
        this.deur.setY(this.H - this.deurBottomOffset).refreshBody();
        this.cameras.main.setBounds(0, 0, 4000, this.H);
        this.physics.world.setBounds(0, 0, 4000, this.H);
        this.children.list
            .find(child => child.texture?.key === 'background')
            ?.setDisplaySize(4000, this.H);
        this.layoutTouchControls(this.W, this.H);
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
                {
                    fontSize: `${Math.min(64, this.scale.width / 8)}px`,
                    fill: '#ff0000',
                    backgroundColor: '#000000',
                    padding: { x: 20, y: 10 }
                }
            ).setOrigin(0.5).setScrollFactor(0);
        }
    }
}

export default Level1Scene;