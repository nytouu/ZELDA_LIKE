var config =
{
    type: Phaser.AUTO,
    width: 1280, height: 720,
    physics:
    {
        default: 'arcade',
        arcade:
        {
            debug: true
        }
    },
    scene:
    {
        preload: preload,
        create: create,
        update: update
    },
    pixelArt: true,
    input:
    {
        gamepad: true
    }
};
new Phaser.Game(config);

function preload()
{
    this.load.image('background', 'assets/background.png');
    this.load.image('city_tiles', 'assets/city.png')
    this.load.spritesheet('player_idle_back','assets/player_idle_back.png',
                { frameWidth: 16, frameHeight: 28 });
    this.load.spritesheet('player_idle_front','assets/player_idle_front.png',
                { frameWidth: 16, frameHeight: 28 });
    this.load.spritesheet('player_idle_right','assets/player_idle_right.png',
                { frameWidth: 16, frameHeight: 28 });
    this.load.spritesheet('player_idle_left','assets/player_idle_left.png',
                { frameWidth: 16, frameHeight: 28 });
    this.load.spritesheet('player_run_back','assets/player_run_back.png',
                { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player_run_front','assets/player_run_front.png',
                { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player_run_right','assets/player_run_right.png',
                { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player_run_left','assets/player_run_left.png',
                { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bat','assets/bat.png',
                { frameWidth: 28, frameHeight: 28 });
    this.load.spritesheet('lifebar','assets/lifebar.png',
                { frameWidth: 144, frameHeight: 32 });
    this.load.tilemapTiledJSON("map", "assets/city_map.json");
}


var platforms;
var player;
var cursors;
var game_over = false;
var controller = false;
var physics;

const SPEED = 100;
const TILE_SIZE = 16;
const MAP_SIZE_X = 272;
const MAP_SIZE_Y = 384;

function create()
{
    physics = this.physics;

    this.add.image(MAP_SIZE_X / 2, MAP_SIZE_Y / 2, 'background');

    const level_map = this.add.tilemap("map");
    const tileset = level_map.addTilesetImage(
        "city_map",
        "city_tiles"
    );
    const city_map = level_map.createLayer(
        "objects",
        tileset
    );

    player = physics.add.sprite(120, 340, 'player_idle_front');
    player.can_get_hit = true;
	player.can_dash = true;
    player.hp = 5;

    city_map.setCollisionByProperty({ isSolid: true });
    player.setCollideWorldBounds(true);

    physics.add.collider(player, city_map);

    physics.world.setBounds(0, 0, MAP_SIZE_X, MAP_SIZE_Y);
    this.cameras.main.setBounds(0, 0, MAP_SIZE_X, MAP_SIZE_Y);

    this.cameras.main.startFollow(player);
    this.cameras.main.setZoom(3);

    this.anims.create({
        key: 'idle_back',
        frames: this.anims.generateFrameNumbers('player_idle_back', {start:0,end:5}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'idle_front',
        frames: this.anims.generateFrameNumbers('player_idle_front', {start:0,end:5}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'idle_left',
        frames: this.anims.generateFrameNumbers('player_idle_left', {start:0,end:5}),
        frameRate: 6,
        repeat: -1
    });

    this.anims.create({
        key: 'idle_right',
        frames: this.anims.generateFrameNumbers('player_idle_right', {start:0,end:5}),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'run_back',
        frames: this.anims.generateFrameNumbers('player_run_back', {start:0,end:11}),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'run_front',
        frames: this.anims.generateFrameNumbers('player_run_front', {start:0,end:11}),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'run_right',
        frames: this.anims.generateFrameNumbers('player_run_right', {start:0,end:11}),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'run_left',
        frames: this.anims.generateFrameNumbers('player_run_left', {start:0,end:11}),
        frameRate: 12,
        repeat: -1
    });
    player.direction = "front";

    cursors = this.input.keyboard.createCursorKeys();

    this.input.gamepad.once('connected', function (pad)
    {
        controller = pad;
    })
}

function update()
{
    if (game_over){return;}

    if (cursors.left.isDown || controller.left)
    {
        player.setVelocityX(-SPEED);
        player.anims.play('run_left', true);
        player.direction = "left"
    }
    else if (cursors.right.isDown || controller.right)
    {
        player.setVelocityX(SPEED);
        player.anims.play('run_right', true);
        player.direction = "right"
    }
    if (cursors.up.isDown || controller.up)
    {
        player.setVelocityY(-SPEED);
        player.anims.play('run_back', true);
        player.direction = "back"
    }
    else if (cursors.down.isDown || controller.down)
    {
        player.setVelocityY(SPEED);
        player.anims.play('run_front', true);
        player.direction = "front"
    }
    if (cursors.up.isUp && cursors.down.isUp && cursors.left.isUp && cursors.right.isUp)
    {
        player.setVelocity(0);
        switch (player.direction)
        {
            case "back":
                player.anims.play('idle_back');
                break;
            case "front":
                player.anims.play('idle_front');
                break;
            case "left":
                player.anims.play('idle_left');
                break;
            case "right":
                player.anims.play('idle_right');
                break;
        }
    }

    if (player.can_dash && (cursors.space.isDown || controller.A))
        player_dash();
}


function lock_input()
{
    input_locked = false;
}

function cd_dash()
{
    player.can_dash = true;
}

function cd_can_get_hit()
{
    player.can_get_hit = true;
    bat1.can_get_hit = true;
    bat2.can_get_hit = true;
    if (!game_over)
        player.setTint(0xffffff);
}

function player_dash()
{
    player.can_dash = false;
    setTimeout(cd_dash, 1000);

	console.log("dash")
}

function kill_player()
{
    player.anims.play('turn');
    game_over = true;
    player.setTint(0xff0000);
    physics.pause();
}

function hit_bat1()
{
    if (player.x < bat1.x && bat1.alive && bat1.can_get_hit)
    {
        bat1.alive = false;

        bat1.setTint(0xff0000);
        this.tweens.add({
            targets: bat1,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
        }, this);
    }
    else if (bat1.alive)
    {
        damage_player();
    }
}

function hit_bat2()
{
    if (player.x < bat2.x && bat2.alive && bat2.can_get_hit)
    {
        bat2.alive = false;

        bat2.setTint(0xff0000);
        this.tweens.add({
            targets: bat2,
            alpha: 0,
            duration: 2000,
            ease: 'Power2'
        }, this);
    }
    else if (bat2.alive)
    {
        damage_player();
    }
}

function damage_player()
{
    if (player.can_get_hit)
    {
        player.can_get_hit = false;
        bat1.can_get_hit = false;
        player.setTint(0xff0000);
        player.hp -= 1;
        if (player.hp <= 0)
            kill_player();
        setTimeout(cd_can_get_hit, 1000)
    }

    switch (player.hp)
    {
        case 5:
            lifebar.anims.play('life5', true);
            break;
        case 4:
            lifebar.anims.play('life4', true);
            break;
        case 3:
            lifebar.anims.play('life3', true);
            break;
        case 2:
            lifebar.anims.play('life2', true);
            break;
        case 1:
            lifebar.anims.play('life1', true);
            break;
        case 0:
            lifebar.anims.play('life0', true);
            break;
    }
}
