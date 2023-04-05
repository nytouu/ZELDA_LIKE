const SPEED = 80;
const DASH_SPEED = 260;
const DASH_TIME = 200;
const MAP_SIZE_X = 304;
const MAP_SIZE_Y = 176;

export class DungeonEntrance2Scene extends Phaser.Scene{

	constructor(){
		super("DungeonEntrance2Scene");

		this.player;
		this.lifebar;
		this.hp;
		this.dashx;
		this.dashy;
		this.cursors;
		this.game_over = false;
		this.controller = false;
		this.physics;
		this.shadow;
		this.canGoOut = true;
		this.layer;
		this.click = false;
        this.keyX;
        this.has_sword = false;
	}

	init(data)
	{
		this.has_sword = data.sword;
		this.entrance = data.entrance;
		this.cameras.main.fadeIn(600, 0, 0, 0);
		this.canGoOut = true;
		this.hp = data.hp;
	}

	preload(){

		this.load.image('background4', 'assets/background4.png');
		this.load.image('player_shadow', 'assets/player_shadow.png');
		this.load.image('dungeon_entrance2', 'assets/dungeon_entrance2.png')


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

		this.load.spritesheet('player_attack_front', 'assets/player_attack_front.png',
			{frameWidth : 32, frameHeight : 32});
		this.load.spritesheet('player_attack_back', 'assets/player_attack_back.png',
			{frameWidth : 32, frameHeight : 32});
		this.load.spritesheet('player_attack_left', 'assets/player_attack_left.png',
			{frameWidth : 32, frameHeight : 32});
		this.load.spritesheet('player_attack_right', 'assets/player_attack_right.png',
			{frameWidth : 32, frameHeight : 32});

		this.load.spritesheet('fire', 'assets/fire.png',
			{frameWidth : 12, frameHeight : 12});

		this.load.spritesheet('lifebar','assets/lifebar.png',
			{ frameWidth: 64, frameHeight: 16 });
		this.load.tilemapTiledJSON("dungeon_entrance2_map", "assets/dungeon_entrance2.json");
	}
	create(){
		this.background4 = this.add.image(MAP_SIZE_X / 2, MAP_SIZE_Y / 2, 'background4');

		this.dash_trail = this.physics.add.group({ collideWorldBounds: true });

		const level_map = this.add.tilemap("dungeon_entrance2_map");
		const tiles = level_map.addTilesetImage(
			"dungeon_entrance2",
			"dungeon_entrance2",
		);
		const layer_above = level_map.createLayer(
			"above",
			tiles
		);
		const layer_under = level_map.createLayer(
			"under",
			tiles
		);

		if (this.entrance == "dungeon_entrance")
		{
			this.player = this.physics.add.sprite(28, 268, 'player_idle_right');
			this.current_anim = "player_idle_right";
			this.player.direction = "right";
		}
		else if (this.entrance == "dungeon_room")
		{
			this.player = this.physics.add.sprite(106, 142, 'player_idle_front');
			this.current_anim = "player_idle_front";
			this.player.direction = "front";
		}
		else
		{
			this.player = this.physics.add.sprite(72, 200, 'player_idle_front');
			this.current_anim = "player_idle_front";
			this.player.direction = "front";
		}

		this.shadow = this.physics.add.sprite(120, 340, 'player_shadow');
		this.shadow.setCircle(16).setOffset(0, 0);

		this.player.setSize(8,14).setOffset(12,16);
		this.player.can_get_hit = true;

		this.player.can_dash = true;
		this.player.can_attack = true;

		this.player.is_dashing = false;
		this.player.is_attacking = false;

        this.fire1 = this.physics.add.sprite(66, 126, 'fire');
        this.fire2 = this.physics.add.sprite(142, 126, 'fire');

		this.layer = this.add.layer();
		this.layer.add([ layer_under, this.shadow, this.player,
            layer_above, this.fire1, this.fire2 ])

		this.lifebar = this.physics.add.sprite(-10, -10, 'lifebar');
		this.lifebar.body.allowGravity = false;

		layer_under.setCollisionByProperty({ isSolid: true });
		layer_above.setCollisionByProperty({ isSolid: true });
		// this.player.setCollideWorldBounds(true);

		this.physics.add.collider(this.player, layer_above);
		this.physics.add.collider(this.player, layer_under);

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
			key : 'attack_front',
			frames : this.anims.generateFrameNumbers('player_attack_front',
				{start : 0, end : 9}),
			frameRate : 15,
			repeat : 0
		});
		this.anims.create({
			key : 'attack_back',
			frames : this.anims.generateFrameNumbers('player_attack_back',
				{start : 0, end : 9}),
			frameRate : 15,
			repeat : 0
		});
		this.anims.create({
			key : 'attack_left',
			frames : this.anims.generateFrameNumbers('player_attack_left',
				{start : 0, end : 11}),
			frameRate : 18,
			repeat : 0
		});
		this.anims.create({
			key : 'attack_right',
			frames : this.anims.generateFrameNumbers('player_attack_right',
				{start : 0, end : 11}),
			frameRate : 18,
			repeat : 0
		});

		this.anims.create({
			key : 'fire_play',
			frames : this.anims.generateFrameNumbers('fire',
				{start : 0, end : 2}),
			frameRate : 6,
			repeat : -1
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

        this.fire1.anims.play('fire_play', true);
        this.fire2.anims.play('fire_play', true);
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


		this.cursors = this.input.keyboard.createCursorKeys();
        this.keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

		this.input.gamepad.once('connected', function (pad)
			{
				controller = pad;
			})
		this.input.on('pointerdown', () => this.click = true);
	};
	update(){
		this.lifebar.x = this.player.x - 200;
		this.lifebar.y = this.player.y - 120;

		if (this.game_over){return;}

        if (Phaser.Input.Keyboard.JustDown(this.keyX))
            this.click = true;

		this.shadow.x = this.player.x;
		this.shadow.y = this.player.y;

		console.log(this.player.x, this.player.y);

		this.background4.x = (((MAP_SIZE_X / 2) * (this.player.x / MAP_SIZE_X)) * 1) + 100 ;
		this.background4.y = (((MAP_SIZE_Y / 2) * (this.player.y / MAP_SIZE_Y)) * 1) + 100 ;

		if (this.player.x <=22)
			this.switch_scene("DungeonEntranceScene", "dungeon_entrance2");
        else if (this.player.y <=132)
			this.switch_scene("DungeonRoomScene", "dungeon_entrance2");

		if (this.player.can_dash && (this.cursors.space.isDown || this.controller.A))
			this.player_dash(this.dashx, this.dashy);

		if (!this.player.is_dashing && !this.player.is_attacking)
		{
			if (this.player.can_attack && this.click && this.has_sword)
			{
				this.click = false;
				this.player_attack(this.player.direction, this.dashx, this.dashy)
			}
		}

		if (this.player.is_dashing)
			this.draw_dash_trail();
		this.remove_trail();

		if (!this.player.is_dashing && !this.player.is_attacking)
			this.handle_input();
	}

	// Methods
	cd_can_dash(player)
	{
		player.can_dash = true;
	}

	cd_can_attack(player) { player.can_attack = true; }

	cd_dash(player)
	{
		player.is_dashing = false;
		player.setTint(0xffffff);
	}

	cd_attack(player)
	{
		player.is_attacking = false;
	}

	cd_can_get_hit(player)
	{
		player.can_get_hit = true;
		if (!this.game_over)
			player.setTint(0xffffff);
	}

	player_dash(dx, dy)
	{
		if (dx == 0 && dy == 0)
			return
		else
		{
			this.player.is_dashing = true;
			this.player.can_dash = false;

			this.player.setVelocityX(dx * DASH_SPEED);
			this.player.setVelocityY(dy * DASH_SPEED);

			this.player.body.velocity.normalize().scale(DASH_SPEED);

			setTimeout(this.cd_dash, DASH_TIME, this.player);
			setTimeout(this.cd_can_dash, 600, this.player);

			this.player.setTint(0x00ffff);
		}
	}

	player_attack(direction)
	{
		this.player.is_attacking = true;
		this.player.can_attack = false;
		switch (direction)
		{
			case "left":
				this.player.anims.play('attack_left');
				this.player.setVelocityX(-10);
				this.player.setVelocityY(0);
				break;
			case "right":
				this.player.anims.play("attack_right", true);
				this.player.setVelocityX(10);
				this.player.setVelocityY(0);
				break;
			case "back":
				this.player.anims.play("attack_back",true );
				this.player.setVelocityX(0);
				this.player.setVelocityY(-10);
				break;
			case "front":
				this.player.anims.play("attack_front",true);
				this.player.setVelocityX(0);
				this.player.setVelocityY(10);
				break;
		}
		setTimeout(this.cd_attack, 400, this.player);
		setTimeout(this.cd_can_attack, 500, this.player);
	}

	kill_player()
	{
		this.player.anims.play('player_idle_front');
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
			this.hp -= 1;
			if (this.hp <= 0)
				this.kill_player();
			setTimeout(this.cd_can_get_hit, 1000, this.player)
		}

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
	}

	switch_scene(scene, entrance)
	{
		if (this.canGoOut == true)
		{
			this.canGoOut = false;
			this.cameras.main.fadeOut(400, 0, 0, 0);
			this.time.delayedCall(500, () => {
				this.scene.start(scene, {entrance: entrance, xpos: this.player.x, hp: this.hp, sword: this.has_sword });
			})
		}
	}

	draw_dash_trail()
	{
		const silhouette = this.dash_trail.create(this.player.x, this.player.y, this.current_anim).setPushable(false).setDepth(100).setAlpha(0.8);
		this.tweens.addCounter({
			from: 255,
			to: 0,
			duration: 300,
			onUpdate: function (tween)
			{
				const valueGB = Math.floor(tween.getValue());
				const valueR = 255 + Math.floor(Math.floor(tween.getValue())/1.82);

				silhouette.setTintFill(Phaser.Display.Color.GetColor(valueR, valueGB, valueGB));   
			}
		});

	}

	remove_trail()
	{
		this.dash_trail.children.each(function (silhouette) {
			silhouette.alpha -= 0.05;
			if(silhouette.alpha <= 0)
				silhouette.destroy();
		})
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