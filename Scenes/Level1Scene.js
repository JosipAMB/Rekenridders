class Level1Scene extends Phaser.Scene {


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

        // achtergrond vult heel scherm
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(W, H);

        // speler
        this.player = this.physics.add.sprite(100, H - 150, 'idle');
        this.player.setScale(2);
        this.player.body.setSize(28, 30);    // physics body kleiner maken
        this.player.body.setOffset(28, 30);  // body goed uitlijnen met sprite

        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

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

        this.player.play('idle');

        // platforms groep aanmaken
        this.platforms = this.physics.add.staticGroup();

        // grond onderaan - volle breedte
        this.platforms.create(W / 2, H - 10, null)
            .setDisplaySize(W, 40)
            .setTint(0x8B4513)
            .setVisible(true)
            .refreshBody();

        // platforms
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

        // collider
        this.physics.add.collider(this.player, this.platforms);
    }

    update() {
        const inLucht = !this.player.body.blocked.down;

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
            this.player.setVelocityY(-400);
            this.player.play('jump', true);
        }
    }
}

export default Level1Scene;