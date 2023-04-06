const SPEED = 80;
const MAP_SIZE_X = 80;
const MAP_SIZE_Y = 64;

export class RoomScene extends Phaser.Scene{

	constructor(){
		super("RoomScene");

		this.hp = 5;
		this.controller = false;
		this.canGoOut = true;
        this.has_sword = false;
        this.door_opened = false;
        this.boss_dead = false;
	}

	init(data)
	{

        this.money = data.money;
        this.has_sword = data.sword;
        this.boss_dead = data.boss_dead;
		this.entrance = data.entrance;
		this.door_opened = data.door;
		if (this.entrance == "city")
		{
			this.hp = data.hp;
			this.cameras.main.fadeIn(600, 0, 0, 0);
		}
		else
		{
			this.cameras.main.fadeIn(1500, 0, 0, 0);
		}
		this.canGoOut = true;
		this.game_over = false;
	}

	preload(){

		this.load.image('background3', 'assets/background3.png');
		this.load.image('player_shadow', 'assets/player_shadow.png');
		this.load.image('room', 'assets/room.png')
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
			{ frameWidth: 64, frameHeight: 16 });
		this.load.tilemapTiledJSON("room_map", "assets/room_map.json");
	}
	create(){
		this.background3 = this.add.image(MAP_SIZE_X / 2, MAP_SIZE_Y / 2, 'background3');

		const level_map = this.add.tilemap("room_map");
		const tiles = level_map.addTilesetImage(
			"room",
			"room"
		);
		const room_layer = level_map.createLayer(
			"tiles",
			tiles
		);

		if (this.entrance == "city")
		{
			this.player = this.physics.add.sprite(22, 48, 'player_idle_right');
			this.player.current_anim = "player_idle_right";
			this.player.direction = "right";
		}
		else
		{
			this.money = 0;
			this.player = this.physics.add.sprite(70, 48, 'player_idle_front');
			this.player.current_anim = "player_idle_front";
			this.player.direction = "front";
		}
		this.shadow = this.physics.add.sprite(64, 42, 'player_shadow');
		this.shadow.setCircle(16).setOffset(0, 0);

		this.player.setSize(8,14).setOffset(12,16);

		const layer = this.add.layer();
		layer.add([ room_layer, this.shadow, this.player ])

		this.lifebar = this.physics.add.sprite(-10, -10, 'lifebar');
		this.lifebar.body.allowGravity = false;
		// this.lifebar.setScrollFactor(0,0);

		room_layer.setCollisionByProperty({ isSolid: true });
		this.player.setCollideWorldBounds(true);

		this.physics.add.collider(this.player, room_layer);

		this.cameras.main.startFollow(this.player);
		this.cameras.main.setZoom(4);

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

		this.anims.create({
			key: 'life5',
			frames: [ { key: 'lifebar', frame: 0 } ],
			frameRate: 1,
			repeat: 0
		});
		this.anims.create({
			key: 'life4',
			frames: [ { key: 'lifebar', frame: 1 } ],
			frameRate: 1,
			repeat: 0
		});
		this.anims.create({
			key: 'life3',
			frames: [ { key: 'lifebar', frame: 2 } ],
			frameRate: 1,
			repeat: 0
		});
		this.anims.create({
			key: 'life2',
			frames: [ { key: 'lifebar', frame: 3 } ],
			frameRate: 1,
			repeat: 0
		});
		this.anims.create({
			key: 'life1',
			frames: [ { key: 'lifebar', frame: 4 } ],
			frameRate: 1,
			repeat: 0
		});
		this.anims.create({
			key: 'life0',
			frames: [ { key: 'lifebar', frame: 5 } ],
			frameRate: 1,
			repeat: 0
		});

		switch (this.hp)
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

		if (this.entrance == "city")
			this.player.direction = "right";
		else
			this.player.direction = "front";

		this.cursors = this.input.keyboard.createCursorKeys();

		this.input.gamepad.once('connected', function (pad)
			{
				controller = pad;
			})
	};
	update(){
		this.lifebar.x = this.player.x - 200;
		this.lifebar.y = this.player.y - 120;

		if (this.game_over){return;}

		console.log(this.money);
		this.shadow.x = this.player.x;
		this.shadow.y = this.player.y;

		this.background3.x = (((MAP_SIZE_X / 2) * (this.player.x / MAP_SIZE_X)) * 0.5) + (MAP_SIZE_X / 2);
		this.background3.y = (((MAP_SIZE_Y / 2) * (this.player.y / MAP_SIZE_Y)) * 0.5) + (MAP_SIZE_Y / 2);

		if (this.player.x < 10)
			this.switch_scene("CityScene", "room");

		this.handle_input();
	}

	// Methods
	cd_can_dash(player)
	{
		player.can_dash = true;
	}

	cd_dash(player)
	{
		player.is_dashing = false;
	}

	player_dash(direction)
	{
		if (direction == "left"){}
		this.player.can_dash = false;
		setTimeout(this.cd_dash, 200, this.player);
		setTimeout(this.cd_can_dash, 1000, this.player);
	}

	switch_scene(scene, entrance)
	{
		if (this.canGoOut == true)
		{
			this.canGoOut = false;
			this.cameras.main.fadeOut(400, 0, 0, 0);
			this.time.delayedCall(500, () => {
				this.scene.start(scene, {entrance: entrance, xpos: this.player.x, hp: this.hp, 
					sword: this.has_sword, boss_dead: this.boss_dead, door: this.door_opened,
                    money: this.money });
			})
		}
	}
	handle_input()
	{
		if (this.cursors.up.isDown && this.cursors.left.isDown &&
			(!this.cursors.down.isDown && !this.cursors.right.isDown) ||
			this.controller.up && this.controller.left)
		{
			this.player.body.setVelocityX(-SPEED);
			this.player.body.setVelocityY(-SPEED);
			this.dashx = -1;
			this.dashy = -1;
			this.player.anims.play('run_back', true);
			this.current_anim = "player_run_back";
			this.player.direction = "back";
		}
		if (this.cursors.up.isDown && this.cursors.right.isDown &&
			(!this.cursors.down.isDown && !this.cursors.left.isDown) ||
			this.controller.up && this.controller.right)
		{
			this.player.body.setVelocityX(SPEED);
			this.player.body.setVelocityY(-SPEED);
			this.dashx = 1;
			this.dashy = -1;
			this.player.anims.play('run_back', true);
			this.current_anim = "player_run_back";
			this.player.direction = "back";
		}

		if (this.cursors.down.isDown && this.cursors.left.isDown &&
			(!this.cursors.up.isDown && !this.cursors.right.isDown) ||
			this.controller.down && this.controller.left)
		{
			this.player.body.setVelocityX(-SPEED);
			this.player.body.setVelocityY(SPEED);
			this.dashx = -1;
			this.dashy = 1;
			this.player.anims.play('run_front', true);
			this.current_anim = "player_run_front";
			this.player.direction = "front";
		}
		if (this.cursors.down.isDown && this.cursors.right.isDown &&
			(!this.cursors.up.isDown && !this.cursors.left.isDown) ||
			this.controller.down && this.controller.right)
		{
			this.player.body.setVelocityX(SPEED);
			this.player.body.setVelocityY(SPEED);
			this.dashx = 1;
			this.dashy = 1;
			this.player.anims.play('run_front', true);
			this.current_anim = "player_run_front";
			this.player.direction = "front";
		}
		if (this.cursors.left.isDown &&
			(!this.cursors.right.isDown && !this.cursors.down.isDown &&
				!this.cursors.up.isDown) ||
			this.controller.left)
		{
			this.player.body.setVelocityX(-SPEED);
			this.player.body.setVelocityY(0);
			this.dashx = -1;
			this.dashy = 0;
			this.player.anims.play('run_left', true);
			this.current_anim = "player_run_left";
			this.player.direction = "left";
		}
		if (this.cursors.right.isDown &&
			(!this.cursors.left.isDown && !this.cursors.down.isDown &&
				!this.cursors.up.isDown) ||
			this.controller.right)
		{
			this.player.body.setVelocityX(SPEED);
			this.player.body.setVelocityY(0);
			this.dashx = 1;
			this.dashy = 0;
			this.player.anims.play('run_right', true);
			this.current_anim = "player_run_right";
			this.player.direction = "right";
		}

		if (this.cursors.up.isDown &&
			(!this.cursors.down.isDown && !this.cursors.left.isDown &&
				!this.cursors.right.isDown) ||
			this.controller.up)
		{
			this.player.body.setVelocityX(0);
			this.player.body.setVelocityY(-SPEED);
			this.dashx = 0;
			this.dashy = -1;
			this.player.anims.play('run_back', true);
			this.current_anim = "player_run_back";
			this.player.direction = "back";
		}
		if (this.cursors.down.isDown &&
			(!this.cursors.up.isDown && !this.cursors.left.isDown &&
				!this.cursors.right.isDown) ||
			this.controller.down)
		{
			this.player.body.setVelocityX(0);
			this.player.body.setVelocityY(SPEED);
			this.dashx = 0;
			this.dashy = 1;
			this.player.anims.play('run_front', true);
			this.current_anim = "player_run_front";
			this.player.direction = "front";
		}
		this.player.body.velocity.normalize().scale(SPEED);

		if (this.cursors.up.isUp && this.cursors.down.isUp && this.cursors.left.isUp && this.cursors.right.isUp && !this.player.is_attacking)
		{
			this.player.setVelocity(0);
			this.dashx = 0;
			this.dashy = 0;
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
	}
};
