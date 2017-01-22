/**
 * Created by austin on 1/20/17.
 */


var game = new Phaser.Game(1200, 800, Phaser.AUTO, '', {preload: preload, create: create, update: update});

// Constant
const PI = Math.PI;
const ROTATION_FACTOR = 0.0625;
const TIME_ELAPSABLE = 75;

// Variables
var player;
var weapon;
var cursors;
var fireButton;
var leftRotate = 0;
var rightRotate = 0;
var target;

function preload() {
    game.stage.backgroundColor = '#4f3178';
    game.load.image('player', '/public/img/circle.png');
    game.load.image('bullet', '/public/img/bullet.png');
    game.load.image('target', '/public/img/square.png');
}

function create() {
    // Sprite
    player = game.add.sprite(game.width / 2, 800, 'player');
    player.anchor.set(0.5);

    target = game.add.sprite(game.width / 2, 50, 'target');
    target.anchor.set(0.5);

    // Weapon
    weapon = game.add.weapon(100, 'bullet');
    weapon.bulletSpeed = 400;
    weapon.fireAngle = 30;
    weapon.trackSprite(player, 0, 0, true);

    // Input
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
}

function update() {

    // Left Rotation
    if (cursors.left.isDown && game.time.time > leftRotate) {
        if ((Math.abs(player.rotation) + ROTATION_FACTOR) < PI) { // limit movement to 180
            player.rotation -= ROTATION_FACTOR;
            player.angle -= ROTATION_FACTOR;
        } else {
            player.rotation = PI;
            player.angle = 180;
        }
        leftRotate = game.time.time + TIME_ELAPSABLE;

    // Right Rotation
    } else if (cursors.right.isDown && game.time.time > rightRotate) {
        if ((Math.abs(player.rotation) - ROTATION_FACTOR) > 0) { // limit movement to 180
            player.rotation += ROTATION_FACTOR;
            player.angle += ROTATION_FACTOR;
        } else {
            player.rotation = 0;
            player.angle = 0;
        }
        rightRotate = game.time.time + TIME_ELAPSABLE;
    }else if (cursors.up.isDown){
        player.rotation = 3*PI/2;
        player.angle = 270;
    }


    if (fireButton.isDown) {
        weapon.fire();
    }
}


//FUNCTIONS