import { CityScene as CityScene } from "./CityScene.js";

var config =
{
    type: Phaser.AUTO,
    width: 1024, height: 720,
    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [CityScene],
    pixelArt: true,
    input:
    {
        gamepad: true
    }
};

new Phaser.Game(config);
