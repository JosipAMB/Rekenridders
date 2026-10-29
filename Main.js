import Level1Scene from './Scenes/Level1Scene.js';
import BossScene from './Scenes/BossScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: [Level1Scene, BossScene]
};

document.getElementById('playBtn').addEventListener('click', () => {
    document.querySelector('header').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';

    const game = new Phaser.Game(config);
});