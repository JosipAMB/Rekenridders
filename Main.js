import Level1Scene from './Scenes/Level1Scene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    },
    scene: [Level1Scene]
};

document.getElementById('playBtn').addEventListener('click', () => {
    document.querySelector('header').style.display = 'none';
    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';

    const game = new Phaser.Game(config);
});