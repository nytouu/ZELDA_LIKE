import { CityScene as CityScene } from "./CityScene.js";
import { MenuScene as MenuScene } from "./MenuScene.js";
import { RoomScene as RoomScene } from "./RoomScene.js";
import { PlainNorthScene as PlainNorthScene } from "./PlainNorthScene.js";
import { PlainSouthScene as PlainSouthScene } from "./PlainSouthScene.js";
import { ShopScene as ShopScene } from "./ShopScene.js";

var config =
{
    type: Phaser.AUTO,
	scale: {
        mode: Phaser.Scale.FIT,
        width: 1920,
        height: 1080
    },
    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [ MenuScene, RoomScene, CityScene, PlainNorthScene, PlainSouthScene, ShopScene ],
    pixelArt: true,
    input:
    {
        gamepad: true
    }
};

new Phaser.Game(config);
