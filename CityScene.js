const SPEED = 80;
const MAP_SIZE_X = 272;
const MAP_SIZE_Y = 384;

export class CityScene extends Phaser.Scene{

    constructor(){
        super("CityScene");

        this.player;
        this.cursors;
        this.game_over = false;
        this.controller = false;
        this.physics;
        this.shadow;
		this.canGoOut = true;
    }

    init(data)
    {
        this.entrance = data.entrance;
		this.cameras.main.fadeIn(400, 0, 0, 0);
		this.canGoOut = true;
    }

    preload(){

        this.load.image('background', 'assets/background.png');
        this.load.image('player_shadow', 'assets/player_shadow.png');
        this.load.image('city_above', 'assets/city_above_player.png')
        this.load.image('city_under', 'assets/city_under_player.png')
        this.load.spritesheet('player_idle_back','assets/player_idle_back.png',
                    { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_idle_front','assets/player_idle_front.png',
                    { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_idle_right','assets/player_idle_right.png',
                    { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_idle_left','assets/player_idle_left.png',
                    { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_run_back','assets/player_run_back.png',
                    { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_run_front','assets/player_run_front.png',
                    { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_run_right','assets/player_run_right.png',
                    { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_run_left','assets/player_run_left.png',
                    { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('lifebar','assets/lifebar.png',
                    { frameWidth: 144, frameHeight: 32 });
        this.load.tilemapTiledJSON("city_map", "assets/city_map.json");
    }
    create(){
        this.background = this.add.image(MAP_SIZE_X / 2, MAP_SIZE_Y / 2, 'background');

        const level_map = this.add.tilemap("city_map");
        const tiles_under = level_map.addTilesetImage(
            "city_under",
            "city_under"
        );
        const tiles_above = level_map.addTilesetImage(
            "city_above",
            "city_above"
        );
        const city_map_under = level_map.createLayer(
            "under",
            tiles_under
        );
        const city_map_above = level_map.createLayer(
            "above",
            tiles_above
        );

		if (this.entrance == "room")
			this.player = this.physics.add.sprite(180, 320, 'player_idle_left');
		else
			this.player = this.physics.add.sprite(120, 340, 'player_idle_front');
        this.shadow = this.physics.add.sprite(120, 340, 'player_shadow');
        this.player.setSize(8,14).setOffset(12,16);
        this.player.can_get_hit = true;
        this.player.can_dash = true;
        this.player.is_dashing = false;
        this.player.hp = 5;

        const layer = this.add.layer();
        layer.add([ city_map_under, this.shadow, this.player, city_map_above ])

        city_map_above.setCollisionByProperty({ isSolid: true });
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, city_map_above);

        this.cameras.main.startFollow(this.player);
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
        if (this.entrance == "room")
            this.player.direction = "left";
        else
            this.player.direction = "front";

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.gamepad.once('connected', function (pad)
        {
            controller = pad;
        })
    };
    update(){
        this.shadow.x = this.player.x;
        this.shadow.y = this.player.y;

        this.background.x = (((MAP_SIZE_X / 2) * (this.player.x / MAP_SIZE_X)) * 1) + 100 ;
        this.background.y = (((MAP_SIZE_Y / 2) * (this.player.y / MAP_SIZE_Y)) * 1) + 100 ;

        if (this.game_over){return;}

        if (this.cursors.up.isDown && this.cursors.left.isDown
			&& (!this.cursors.down.isDown && !this.cursors.right.isDown)
			|| this.controller.up && this.controller.left)
        {
            this.player.body.setVelocityX(-SPEED);
            this.player.body.setVelocityY(-SPEED);
            this.player.anims.play('run_back', true);
            this.player.direction = "back";
        }
        if (this.cursors.up.isDown && this.cursors.right.isDown
			&& (!this.cursors.down.isDown && !this.cursors.left.isDown)
			|| this.controller.up && this.controller.right)
        {
            this.player.body.setVelocityX(SPEED);
            this.player.body.setVelocityY(-SPEED);
            this.player.anims.play('run_back', true);
            this.player.direction = "back";
        }

		if (this.cursors.down.isDown && this.cursors.left.isDown
			&& (!this.cursors.up.isDown && !this.cursors.right.isDown)
			|| this.controller.down && this.controller.left)
        {
            this.player.body.setVelocityX(-SPEED);
            this.player.body.setVelocityY(SPEED);
            this.player.anims.play('run_front', true);
            this.player.direction = "front";
        }
        if (this.cursors.down.isDown && this.cursors.right.isDown
			&& (!this.cursors.up.isDown && !this.cursors.left.isDown)
			|| this.controller.down && this.controller.right)
        {
            this.player.body.setVelocityX(SPEED);
            this.player.body.setVelocityY(SPEED);
            this.player.anims.play('run_front', true);
            this.player.direction = "front";
        }
		if (this.cursors.left.isDown
			&& (!this.cursors.right.isDown && !this.cursors.down.isDown && !this.cursors.up.isDown)
			|| this.controller.left)
        {
            this.player.body.setVelocityX(-SPEED);
            this.player.body.setVelocityY(0);
            this.player.anims.play('run_left', true);
            this.player.direction = "left";
        }
        if (this.cursors.right.isDown
			&& (!this.cursors.left.isDown && !this.cursors.down.isDown && !this.cursors.up.isDown)
			|| this.controller.right)
        {
            this.player.body.setVelocityX(SPEED);
            this.player.body.setVelocityY(0);
            this.player.anims.play('run_right', true);
            this.player.direction = "right";
        }

		if (this.cursors.up.isDown
			&& (!this.cursors.down.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown)
			|| this.controller.up)
        {
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(-SPEED);
            this.player.anims.play('run_back', true);
            this.player.direction = "back";
        }
        if (this.cursors.down.isDown
			&& (!this.cursors.up.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown)
			|| this.controller.down)
        {
            this.player.body.setVelocityX(0);
            this.player.body.setVelocityY(SPEED);
            this.player.anims.play('run_front', true);
            this.player.direction = "front";
        }
        this.player.body.velocity.normalize().scale(SPEED);

        if (this.cursors.up.isUp && this.cursors.down.isUp && this.cursors.left.isUp && this.cursors.right.isUp)
        {
            this.player.setVelocity(0);
            switch (this.player.direction)
            {
                case "back":
                    this.player.anims.play('idle_back', true);
                    break;
                case "front":
                    this.player.anims.play('idle_front', true);
                    break;
                case "left":
                    this.player.anims.play('idle_left', true);
                    break;
                case "right":
                    this.player.anims.play('idle_right', true);
                    break;
            }
        }

		if (this.player.y >= 320 && this.player.x >= 200)
			if (this.canGoOut == true)
			{
				this.canGoOut = false;
				this.cameras.main.fadeOut(400, 0, 0, 0);
				this.time.delayedCall(500, () => {
					this.scene.start('RoomScene', {entrance: "city"});
				})
			}

        if (this.player.can_dash && (this.cursors.space.isDown || this.controller.A))
            this.player_dash(this.player.direction);
    }

    // Methods
    lock_input()
    {
        input_locked = false;
    }

    cd_can_dash(player)
    {
        player.can_dash = true;
    }

    cd_dash(player)
    {
        player.is_dashing = false;
    }

    cd_can_get_hit(player)
    {
        player.can_get_hit = true;
        if (!game_over)
            player.setTint(0xffffff);
    }

    player_dash(direction)
    {
        if (direction == "left"){}
        this.player.can_dash = false;
        setTimeout(this.cd_dash, 200, this.player);
        setTimeout(this.cd_can_dash, 1000, this.player);

        console.log("dash")
    }

    kill_player()
    {
        this.player.anims.play('turn');
        this.game_over = true;
        this.player.setTint(0xff0000);
        this.physics.pause();
    }

    damage_player()
    {
        if (this.player.can_get_hit)
        {
            this.player.can_get_hit = false;
            this.player.setTint(0xff0000);
            this.player.hp -= 1;
            if (this.player.hp <= 0)
                this.kill_player();
            setTimeout(this.cd_can_get_hit, 1000, this.player)
        }

        switch (this.player.hp)
        {
            case 5:
                this.lifebar.anims.play('life5', true);
                break;
            case 4:
                this.lifebar.anims.play('life4', true);
                break;
            case 3:
                this.lifebar.anims.play('life3', true);
                break;
            case 2:
                this.lifebar.anims.play('life2', true);
                break;
            case 1:
                this.lifebar.anims.play('life1', true);
                break;
            case 0:
                this.lifebar.anims.play('life0', true);
                break;
        }
    }
};
