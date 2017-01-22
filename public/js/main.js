/**
 * Created by austin on 1/20/17.
 */


var game = new Phaser.Game(1200, 800, Phaser.AUTO, '', {preload: preload, create: create, update: update});

// Constant
const PI = Math.PI;
const ROTATION_FACTOR = 0.015625;
const TIME_ELAPSABLE = 50;

// Variables
var player;
var weapon;
var cursors;
var fireButton;
var leftRotate = 0;
var rightRotate = 0;
var target;
var wave;
var platforms;
var fireTimer = 0;
var oldBullet;
var bound_top;
var bound_bottom;
var bound_left;
var bound_right;
var bounceCount = 0;
var bounceTime = 0;
var rotated = false;

function preload() {
    game.stage.backgroundColor = '#4f3178';
    game.load.image('player', '/public/img/circle.png');
    game.load.image('bullet', '/public/img/bullet.png');
    game.load.image('target', '/public/img/square.png');
    game.load.image('border-tb', '/public/img/bound-top-bottom.png');
    game.load.image('border-lr', '/public/img/bound-left-right.png');
    game.load.image('bound', '/public/img/bound.png');
    game.load.audio('wave', '/public/audio/wave.mp3');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.gravity = 100;
    text = game.add.text(10, 10, "Bounces till rest: 50", {
        font: "25px Arial",
        fill: "#42aaf4",
        align: "center"
    });

    // Audio
    wave = game.add.audio('wave');

    // Sprite
    player = game.add.sprite(game.width / 2, 800 - 5, 'player');
    target = game.add.sprite(game.width / 2, 55, 'target');
    weapon = game.add.weapon(100, 'bullet');
    bound_top = game.add.sprite(0, 0, 'border-tb');
    bound_bottom = game.add.sprite(0, 800 - 5, 'border-tb');
    bound_left = game.add.sprite(0, 0, 'border-lr');
    bound_right = game.add.sprite(1200 - 5, 0, 'border-lr');

    // Physics
    game.physics.arcade.enable([weapon, target, bound_top, bound_bottom, bound_left, bound_right]);

    // Player
    player.anchor.set(0.5);
    player.angle = 270;

    // Target
    target.anchor.set(0.5);
    target.body.immovable = true;

    // Weapon
    weapon.bulletSpeed = 800;
    weapon.fireAngle = 30;
    weapon.trackSprite(player, 0, 0, true);
    weapon.rotation = 3 * PI / 2;
    weapon.bullets.forEach(function (b) {
        game.physics.arcade.enable(b)
        b.enableBody = true;
        b.body.bounce.set(1);
    });

    // Platforms
    bound_top.body.immovable = true;
    bound_bottom.body.immovable = true;
    bound_left.body.immovable = true;
    bound_right.body.immovable = true;
    platforms = game.add.group();
    platforms.enableBody = true;
    platforms.physicsBodyType = Phaser.Physics.ARCADE;


    for (var j = 0; j < 10; j++) {
        var x = getRandomArbitrary(5 + 100, 1101 - 5), y = getRandomArbitrary(5 + 100, 701 - 5);
        var platform = platforms.create(x, y, 'bound');
        platform.body.immovable = true;
        platform.body.allowGravity = false;
        platform.anchor.set(0.5)
    }
    // Input
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
}

function update() {

    updateRotation();

    weapon.bullets.forEach(function (b) {
        game.physics.arcade.collide(b, target, success);
        game.physics.arcade.collide(b, bound_top, bounceSound);
        game.physics.arcade.collide(b, bound_bottom, bounceSound);
        game.physics.arcade.collide(b, bound_left, bounceSound);
        game.physics.arcade.collide(b, bound_right, bounceSound);
        platforms.forEach(function (p) {
            game.physics.arcade.collide(b, p, bounceSound);
        })
    })
    rotateOnKey();
    fireOnSpace();

    if (game.time.time - bounceTime > 2000) {
        bounceCount = 0;
    }
}


//FUNCTIONS

var rotateOnKey = function () {
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
    } else if (cursors.up.isDown) {
        player.rotation = 3 * PI / 2;
        player.angle = 270;
    }
};


var fireOnSpace = function () {
    if (fireButton.isDown) {
        if (game.time.time > fireTimer && bounceCount == 0) {
            weapon.fire();
            wave.play();
            fireTimer = game.time.time + TIME_ELAPSABLE * 20
            bounceTime = game.time.time;
        }
    }
};

var success = function (bullet) {
    wave.stop();
    bullet.kill();
    bounceCount = 0;
};


var bounceSound = function (bullet) {
    wave.play();
    if (bounceCount < 50) {
        bounceCount++;
    } else {
        bounceCount = 0
        bullet.kill()
    }

    bounceTime = game.time.time;

    text.setText("Bounces till reset: " + (50 - bounceCount));

}

var getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
}


var updateRotation = function () {
    if (!rotated){
        platforms.forEach(function (p) {
            if (Math.floor(Math.random() * 10) % 2) {
                p.body.angle = 90;
            }
        })
    }else{
        rotated = !rotated;
    }

}