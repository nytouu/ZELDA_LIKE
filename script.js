import { CityScene as CityScene } from "./assets/scripts/CityScene.js";
import { MenuScene as MenuScene } from "./assets/scripts/MenuScene.js";
import { RoomScene as RoomScene } from "./assets/scripts/RoomScene.js";
import { PlainNorthScene as PlainNorthScene } from "./assets/scripts/PlainNorthScene.js";
import { PlainSouthScene as PlainSouthScene } from "./assets/scripts/PlainSouthScene.js";
import { ShopScene as ShopScene } from "./assets/scripts/ShopScene.js";
import { DungeonEntranceScene as DungeonEntranceScene } from "./assets/scripts/DungeonEntranceScene.js";
import { DungeonEntrance2Scene as DungeonEntrance2Scene } from "./assets/scripts/DungeonEntrance2Scene.js";
import { DungeonRoomScene as DungeonRoomScene } from "./assets/scripts/DungeonRoomScene.js";

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
    scene: [ MenuScene, RoomScene, CityScene, PlainNorthScene, PlainSouthScene,
		ShopScene, DungeonEntranceScene, DungeonEntrance2Scene, DungeonRoomScene ],
    pixelArt: true,
    input:
    {
        gamepad: true
    },
	fps: {
		target: 60,
		forceSetTimeOut: true
	},
};

new Phaser.Game(config);
