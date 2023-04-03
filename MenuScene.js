const BG_SIZE_X = 1280 ;
const BG_SIZE_Y = 720 ;
var mx;
var my;

export class MenuScene extends Phaser.Scene{

    constructor(){
        super("MenuScene");

        this.click = false;
        this.controller = false;
    }

	init(){
		this.cameras.main.fadeIn(400, 0, 0, 0);
	}
    preload(){
        this.load.image('background_menu', 'assets/menu/background.png');

        this.load.image('name', 'assets/menu/name.png');
        this.load.image('text', 'assets/menu/text.png');

        this.load.image('losang', 'assets/menu/losang.png');
		this.load.image('square', 'assets/menu/square.png');
		this.load.image('square2', 'assets/menu/square2.png');
        this.load.image('circle', 'assets/menu/circle.png');

        this.load.image('dark1', 'assets/menu/dark1.png');
        this.load.image('dark2', 'assets/menu/dark2.png');
        this.load.image('dark3', 'assets/menu/dark3.png');
        this.load.image('dark4', 'assets/menu/dark4.png');
    }
    create(){
        this.background_menu = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'background_menu');
        this.name = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'name');
        this.text = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'text');
        this.losang = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'losang');
        this.square = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'square');
        this.square2 = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'square2');
        this.circle = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'circle');

        this.dark1 = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'dark1');
        this.dark2 = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'dark2');
        this.dark3 = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'dark3');
        this.dark4 = this.add.image(BG_SIZE_X / 1.34, BG_SIZE_Y / 1.34, 'dark4');

        const layer = this.add.layer();
        layer.add([ this.background_menu, this.dark4, this.dark3, this.dark2, this.dark1, 
			this.circle, this.square2, this.square, this.losang, this.text, this.name ])

        this.cameras.main.setZoom(1.50);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.gamepad.once('connected', function (pad)
        {
            controller = pad;
        })
        this.input.on('pointerdown', () => this.click = true);
    };
    update(){
        mx = this.input.mousePointer.x;
        my = this.input.mousePointer.y;

        this.background_menu.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 300);
        this.background_menu.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 300);

        this.name.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 100);
        this.name.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 100);

        this.text.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 200);
        this.text.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 200);
 
        this.losang.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 70);
        this.losang.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 70);
 
        this.square.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 60);
        this.square.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 60);
 
        this.square2.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 40);
        this.square2.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 40);
 
        this.circle.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 2) / 20);
        this.circle.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 2) / 20);
 
        this.dark1.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 80);
        this.dark1.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 80);
 
        this.dark2.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 50);
        this.dark2.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 50);
 
        this.dark3.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 30);
        this.dark3.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 30);
 
        this.dark4.x = (BG_SIZE_X / 1.34) + (1 * (mx - BG_SIZE_X / 1.34) / 10);
        this.dark4.y = (BG_SIZE_Y / 1.34) + (1 * (my - BG_SIZE_Y / 1.34) / 10);
 
		if (this.click == true)
		{
			this.cameras.main.fadeOut(900, 0, 0, 0);
			this.time.delayedCall(1000, () => {
				this.scene.start('RoomScene');
			})
		}
        this.click = false;
    }
};
