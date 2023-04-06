const SPEED = 80;
const DASH_SPEED = 260;
const DASH_TIME = 200;
const MAP_SIZE_X = 464;
const MAP_SIZE_Y = 800;

export class DungeonRoomScene extends Phaser.Scene{

	constructor(){
		super("DungeonRoomScene");

		this.game_over = false;
		this.controller = false;
		this.canGoOut = true;
		this.click = false;
		this.dashed = false;
        this.has_sword = false;
	}

	init(data)
	{
        this.has_key = data.key;
        this.money = data.money;
        this.has_sword = data.sword;
        this.boss_dead = data.boss_dead;
		this.entrance = data.entrance;
		this.cameras.main.fadeIn(600, 0, 0, 0);
		this.canGoOut = true;
		this.hp = data.hp;
        this.boss = false;
		this.door_opened = data.door;

        this.spider_once = false;
		this.game_over = false;
	}

	preload(){

		this.load.image('background4', 'assets/background4.png');
		this.load.image('player_shadow', 'assets/player_shadow.png');
		this.load.image('dungeon_room', 'assets/dungeon_room.png')

		this.load.spritesheet('mini_spider_idle','assets/mini_spider_idle.png',
			{ frameWidth: 18, frameHeight: 18 });
		this.load.spritesheet('mini_spider_run','assets/mini_spider_run.png',
			{ frameWidth: 18, frameHeight: 18 });

		this.load.spritesheet('spider_boss','assets/big_spidy.png',
			{ frameWidth: 64, frameHeight: 80 });

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
		this.load.tilemapTiledJSON("dungeon_room_map", "assets/dungeon_room.json");
	}
	create(){
		this.background4 = this.add.image(MAP_SIZE_X / 2, MAP_SIZE_Y / 2, 'background4');

		this.dash_trail = this.physics.add.group({ collideWorldBounds: true });
		this.spiders = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });

        this.fire = this.physics.add.sprite(232, 168, 'fire');

		const level_map = this.add.tilemap("dungeon_room_map");
		const tiles = level_map.addTilesetImage(
			"dungeon_room",
			"dungeon_room",
		);
		this.layer_above = level_map.createLayer(
			"above",
			tiles
		);
		this.layer_under = level_map.createLayer(
			"under",
			tiles
		);

		if (this.entrance == "dungeon_entrance2")
		{
			this.player = this.physics.add.sprite(232, 742, 'player_idle_back');
			this.current_anim = "player_idle_back";
			this.player.direction = "back";
		}
		else
		{
			this.player = this.physics.add.sprite(72, 64, 'player_idle_front');
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


		this.layer = this.add.layer();
		this.layer.add([ this.layer_under, this.shadow, this.player, this.layer_above, this.fire ])

		this.lifebar = this.physics.add.sprite(760, 420, 'lifebar');
		this.lifebar.setScrollFactor(0);

		this.key = this.physics.add.sprite(736, 440, 'key');
		this.key.setScrollFactor(0);

		if (!this.has_key)
			this.key.setVisible(false);

		this.layer_under.setCollisionByProperty({ isSolid: true });
		this.layer_above.setCollisionByProperty({ isSolid: true });
		// this.player.setCollideWorldBounds(true);

		this.physics.add.collider(this.player, this.layer_above);
		this.physics.add.collider(this.player, this.layer_under);

		this.physics.add.collider(this.spiders, this.layer_above);
		this.physics.add.collider(this.spiders, this.layer_under);

		this.physics.add.overlap(this.player, this.spiders, this.damage_player, null, this);

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
			key: 'spider_idle',
			frames: this.anims.generateFrameNumbers('mini_spider_idle', {start:0,end:3}),
			frameRate: 4,
			repeat: -1
		});
		this.anims.create({
			key: 'spider_run',
			frames: this.anims.generateFrameNumbers('mini_spider_run', {start:0,end:3}),
			frameRate: 4,
			repeat: -1
		});
		this.anims.create({
			key: 'spider_boss_run',
			frames: this.anims.generateFrameNumbers('spider_boss', {start:0,end:7}),
			frameRate: 8,
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

        this.fire.anims.play('fire_play', true);
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
        this.key_dash = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.key_attack = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

		this.input.gamepad.once('connected', function (pad)
			{
				controller = pad;
			})
		this.input.on('pointerdown', () => this.click = true);
	};
	update(){
		if (this.game_over)
		{
			this.cameras.main.fadeOut(700, 0, 0, 0);
			this.time.delayedCall(800, () => {
				return this.scene.start("DungeonRoomScene"
					, {entrance: this.entrance, hp: 5, sword: this.has_sword, boss_dead: this.boss_dead,
						door: this.door_opened, money: this.money - 2, key: this.has_key});
			})
		}

        if (Phaser.Input.Keyboard.JustDown(this.key_attack))
            this.click = true;
        if (Phaser.Input.Keyboard.JustDown(this.key_dash))
            this.dashed = true;

		this.shadow.x = this.player.x;
		this.shadow.y = this.player.y;

		console.log(this.player.x, this.player.y);

		this.background4.x = (((MAP_SIZE_X / 2) * (this.player.x / MAP_SIZE_X)) * 1) + 100 ;
		this.background4.y = (((MAP_SIZE_Y / 2) * (this.player.y / MAP_SIZE_Y)) * 1) + 100 ;

		if (this.player.y >= 746)
			this.switch_scene("DungeonEntrance2Scene", "dungeon_room");

		if (this.player.can_dash && this.dashed)
        {
            this.player_dash(this.dashx, this.dashy);
            this.dashed = false;
        }

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

		if (this.player.y <= 140 && !this.spider_once && this.has_sword && !this.boss_dead)
			this.spawn_spiders()

		if (this.spider_once)
		{
			this.spiders.children.each(function (spider) {
				if (spider.can_move)
				{
					this.physics.moveToObject(spider, this.player, 50);
				}
				if (spider.x < this.player.x)
					spider.setFlipX(true);
				else
					spider.setFlipX(false);
			}, this)

            if (this.boss)
            {
                if (this.boss.can_move)
                {
                    this.physics.moveToObject(this.boss, this.player, 20);
                }
                if (this.boss.x < this.player.x)
                    this.boss.setFlipX(false);
                else
                    this.boss.setFlipX(true);
            }
		}

		if (!this.player.is_dashing && !this.player.is_attacking)
			this.handle_input();

		this.dashed = false;
		this.click = false;
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
			setTimeout(this.cd_can_dash, 800, this.player);

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
			this.cameras.main.shake(200, 0.0001);
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
				this.scene.start(scene, {entrance: entrance, xpos: this.player.x, hp: this.hp, 
					sword: this.has_sword, boss_dead: this.boss_dead, door: this.door_opened,
                    money: this.money, key: this.has_key });
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

	spawn_spiders()
	{
        if (!this.boss)
        {
            this.boss = this.physics.add.sprite(232, 354, 'spider_boss_run');
            this.boss.anims.play('spider_boss_run', true);
            this.boss.setCircle(24).setOffset(8,10);

            this.physics.add.overlap(this.player, this.boss, this.damage_player, null, this);
            this.physics.add.collider(this.boss, this.layer_above);
            this.physics.add.collider(this.boss, this.layer_under);

            this.layer.add(this.boss);
            this.boss.is_alive = true;
            this.boss.hp = 6;
            this.boss.can_get_hit = true;
            this.boss.can_move = true;

            this.layer.moveDown(this.boss);
            this.layer.moveDown(this.boss);

            this.physics.add.overlap(this.boss, this.shadow, function(boss){
                if (this.player.is_attacking && boss.is_alive)
                {
                    if (boss.can_get_hit)
                    {
						this.cameras.main.shake(200, 0.0001);
                        boss.hp -= 1;
                        boss.can_get_hit = false;
                        boss.can_move = false;

                        switch (this.player.direction)
                        {
                            case "left":
                                boss.body.setVelocityX(-180);
                                boss.body.setVelocityY(0);
                                break;
                            case "right":
                                boss.body.setVelocityX(180);
                                boss.body.setVelocityY(0);
                                break;
                            case "back":
                                boss.body.setVelocityX(0);
                                boss.body.setVelocityY(-180);
                                break;
                            case "front":
                                boss.body.setVelocityX(0);
                                boss.body.setVelocityY(180);
                                break;
                        }

                        boss.setTintFill(0xff0000);
                        this.time.delayedCall(400, () => {
                            boss.can_get_hit = true;
                        })
                        this.time.delayedCall(200, () => {
                            boss.setTint(0xffffff);
                            if (boss.is_alive)
                            {
                                boss.can_move = true;
                            }
                        })

                        if (boss.hp == 3)
                        {
                            this.spider_once = false;
                            this.spawn_spiders();
                        }
                        if (boss.hp <= 0)
                        {
                            boss.is_alive = false;
                            boss.can_move = false;

							this.boss_dead = true;

                            boss.body.setVelocityX(0);
                            boss.body.setVelocityY(0);

                            boss.setTintFill(0xff0000);
                            this.tweens.add({
                                targets: boss,
                                alpha: 0,
                                duration: 500,
                                ease: 'Power2'
                            });
                            this.time.delayedCall(400, () => {
                                boss.destroy();
                            })
                        }
                    }
                }
            }, null, this)
        }
		this.spiders.create(340, 96, 'mini_spider_idle').anims.play('spider_run', true);
		this.spiders.create(340, 310, 'mini_spider_idle').anims.play('spider_run', true);
		this.spiders.create(124, 310, 'mini_spider_idle').anims.play('spider_run', true);
		this.spiders.create(124, 96, 'mini_spider_idle').anims.play('spider_run', true);

		this.spiders.children.each(function (spider) {
			this.layer.add(spider);
			spider.is_alive = true;
			spider.hp = 2;
			spider.can_get_hit = true;
			spider.can_move = true;

			this.layer.moveDown(spider);
			this.layer.moveDown(spider);

			this.physics.add.overlap(spider, this.shadow, function(spider){
				if (this.player.is_attacking && spider.is_alive)
				{
					if (spider.can_get_hit)
					{
						this.cameras.main.shake(200, 0.0001);
						spider.hp -= 1;
						spider.can_get_hit = false;
						spider.can_move = false;

						switch (this.player.direction)
						{
							case "left":
								spider.body.setVelocityX(-180);
								spider.body.setVelocityY(0);
								break;
							case "right":
								spider.body.setVelocityX(180);
								spider.body.setVelocityY(0);
								break;
							case "back":
								spider.body.setVelocityX(0);
								spider.body.setVelocityY(-180);
								break;
							case "front":
								spider.body.setVelocityX(0);
								spider.body.setVelocityY(180);
								break;
						}

						spider.setTintFill(0xff0000);
						this.time.delayedCall(400, () => {
                            spider.can_get_hit = true;
                        })
						this.time.delayedCall(200, () => {
							spider.setTint(0xffffff);
							if (spider.is_alive)
							{
								spider.can_move = true;
							}
						})
					}

					if (spider.hp <= 0)
					{
						spider.is_alive = false;
						spider.can_move = false;

						spider.body.setVelocityX(0);
						spider.body.setVelocityY(0);

						spider.setTintFill(0xff0000);
						this.tweens.add({
							targets: spider,
							alpha: 0,
							duration: 500,
							ease: 'Power2'
						});
						this.time.delayedCall(400, () => {
							spider.destroy();
						})
					}
				}
			}, null, this)
		}, this)

		this.spider_once = true;
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
