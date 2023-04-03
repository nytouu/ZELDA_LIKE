const SPEED = 80;
const DASH_SPEED = 260;
const DASH_TIME = 200;
const MAP_SIZE_X = 576;
const MAP_SIZE_Y = 416;

export class PlainSouthScene extends Phaser.Scene{

    constructor(){
        super("PlainSouthScene");

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
    }

    init(data)
    {
        this.entrance = data.entrance;
		this.cameras.main.fadeIn(600, 0, 0, 0);
		this.canGoOut = true;
		this.xpos = data.xpos;
		this.hp = data.hp;

		this.spider_once = false;
    }

    preload(){

        this.load.image('background2', 'assets/background2.png');
        this.load.image('player_shadow', 'assets/player_shadow.png');
        this.load.image('plain_south_under', 'assets/plain_south_under.png')
        this.load.image('plain_south_above', 'assets/plain_south_above.png')

		this.load.spritesheet('mini_spider_idle','assets/mini_spider_idle.png',
			{ frameWidth: 18, frameHeight: 18 });
		this.load.spritesheet('mini_spider_run','assets/mini_spider_run.png',
			{ frameWidth: 18, frameHeight: 18 });

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

        this.load.spritesheet('lifebar','assets/lifebar.png',
                    { frameWidth: 64, frameHeight: 16 });
        this.load.tilemapTiledJSON("plain_south_map", "assets/plain_south_map.json");
    }
    create(){
        this.background2 = this.add.image(MAP_SIZE_X / 2, MAP_SIZE_Y / 2, 'background2');

		this.dash_trail = this.physics.add.group({ collideWorldBounds: true });
		this.spiders = this.physics.add.group({ allowGravity: false, collideWorldBounds: true });

        const level_map = this.add.tilemap("plain_south_map");
        const tiles_above = level_map.addTilesetImage(
            "plain_south_above",
            "plain_south_above",
        );
        const tiles_under = level_map.addTilesetImage(
            "plain_south_under",
            "plain_south_under"
        );
        const map_above = level_map.createLayer(
            "above",
            tiles_above
        );
        const map_under = level_map.createLayer(
            "under",
            tiles_under,
        );

		if (this.entrance == "city")
		{
			this.player = this.physics.add.sprite(320, 350, 'player_idle_back');
            this.current_anim = "player_idle_back";
            this.player.direction = "back";
		}
		else if (this.entrance == "plain_north1")
		{
			this.player = this.physics.add.sprite(this.xpos, 56, 'player_idle_front');
            this.current_anim = "player_idle_front";
            this.player.direction = "front";
		}
		else if (this.entrance == "plain_north2")
		{
			this.player = this.physics.add.sprite(this.xpos, 214, 'player_idle_front');
            this.current_anim = "player_idle_front";
            this.player.direction = "front";
		}
		else
		{
			this.player = this.physics.add.sprite(320, 350, 'player_idle_front');
            this.current_anim = "player_idle_front";
            this.player.direction = "front";
		}

        this.shadow = this.physics.add.sprite(120, 340, 'player_shadow');
        this.shadow.setCircle(18).setOffset(-2, -2);

        this.player.setSize(8,14).setOffset(12,16);
        this.player.can_get_hit = true;

        this.player.can_dash = true;
		this.player.can_attack = true;

        this.player.is_dashing = false;
		this.player.is_attacking = false;


        this.layer = this.add.layer();
        this.layer.add([ map_under, this.shadow, this.player, map_above ])

		this.lifebar = this.physics.add.sprite(-10, -10, 'lifebar');
		this.lifebar.body.allowGravity = false;

        map_under.setCollisionByProperty({ isSolid: true });
        map_above.setCollisionByProperty({ isSolid: true });
        // this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, map_above);
        this.physics.add.collider(this.player, map_under);

		this.physics.add.collider(this.spiders, map_under);
		this.physics.add.collider(this.spiders, map_above);

        this.physics.add.collider(this.spiders, this.spiders);

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


        this.cursors = this.input.keyboard.createCursorKeys();

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

		// console.log(this.player.x, this.player.y);

        this.shadow.x = this.player.x;
        this.shadow.y = this.player.y;

        this.background2.x = (((MAP_SIZE_X / 2) * (this.player.x / MAP_SIZE_X)) * 1) + 100 ;
        this.background2.y = (((MAP_SIZE_Y / 2) * (this.player.y / MAP_SIZE_Y)) * 1) + 100 ;

		if (this.player.y <=52)
		{
			if (this.canGoOut == true)
			{
				this.canGoOut = false;
				this.cameras.main.fadeOut(400, 0, 0, 0);
				this.time.delayedCall(500, () => {
					this.scene.start('PlainNorthScene', {entrance: "plain_south1", xpos: this.player.x, hp: this.hp });
				})
			}
		}
		else if (this.player.x >=430 && this.player.y <= 210)
		{
			if (this.canGoOut == true)
			{
				this.canGoOut = false;
				this.cameras.main.fadeOut(400, 0, 0, 0);
				this.time.delayedCall(500, () => {
					this.scene.start('PlainNorthScene', {entrance: "plain_south2", xpos: this.player.x, hp: this.hp});
				})
			}
		}

        if (this.player.can_dash && (this.cursors.space.isDown || this.controller.A))
            this.player_dash(this.dashx, this.dashy);

        if (!this.player.is_dashing && !this.player.is_attacking)
        {
            if (this.player.can_attack && this.click)
            {
                this.click = false;
                this.player_attack(this.player.direction, this.dashx, this.dashy)
            }
        }

		if (this.player.is_dashing)
		{
			const silhouette = this.dash_trail.create(this.player.x, this.player.y, this.current_anim).setPushable(false).setDepth(100).setAlpha(0.8);
			this.tweens.addCounter({
                from: 255,
                to: 0,
                duration: 300,
                onUpdate: function (tween)
                {
                    const valueGB = Math.floor(tween.getValue());
                    const valueR = 200 + Math.floor(Math.floor(tween.getValue())/1.82);
    
                    silhouette.setTintFill(Phaser.Display.Color.GetColor(valueR, valueGB, valueGB));   
                }
            });
		}

		if (this.player.x <= 120 && this.player.y >= 320 && !this.spider_once)
		{
			this.spiders.create(480, 280, 'mini_spider_idle').anims.play('spider_run', true);
			this.spiders.create(110, 70, 'mini_spider_idle').anims.play('spider_run', true);

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
                            spider.hp -= 1;
                            spider.can_get_hit = false;
                            spider.can_move = false;

                            switch (this.player.direction)
                            {
                                case "left":
                                    spider.body.setVelocityX(-100);
                                    spider.body.setVelocityY(0);
                                    break;
                                case "right":
                                    spider.body.setVelocityX(100);
                                    spider.body.setVelocityY(0);
                                    break;
                                case "back":
                                    spider.body.setVelocityX(0);
                                    spider.body.setVelocityY(-100);
                                    break;
                                case "front":
                                    spider.body.setVelocityX(0);
                                    spider.body.setVelocityY(100);
                                    break;
                            }

                            spider.setTintFill(0xff0000);
                            spider.body.setBounce(20, 20);
                            this.time.delayedCall(200, () => {
                                spider.setTint(0xffffff);
                                spider.can_get_hit = true;
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
                                duration: 1500,
                                ease: 'Power2'
                            });
                            this.time.delayedCall(1500, () => {
                                spider.destroy();
                            })
                        }
					}
				}, null, this)
			}, this)

			this.spider_once = true;
			console.log("spawned mob");
		}

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
		}

		this.dash_trail.children.each(function (silhouette) {
			silhouette.alpha -= 0.05;
			if(silhouette.alpha <= 0)
				silhouette.destroy();
		})

        if (!this.player.is_dashing && !this.player.is_attacking)
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


};
