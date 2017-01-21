/**
 * Created by austin on 1/20/17.
 */


var game = new Phaser.Game(1200, 800, Phaser.AUTO, '', {preload: preload, create: create, update: update});
var sin;
var player;
var bmd;
var platforms;

function preload() {

    // game.load.image('title', '/public/img/openingScreen.jpg');
    game.stage.backgroundColor = '#4f3178';
    game.load.image('player', '/public/img/circle.png');
    game.load.image('sine', '/public/img/sine.png');

}

function create() {

    // Physics
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 300;

    //Platforms
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Sin Wave creation
    platforms.create(0, 400, 'sine');
    platforms.create(1200 - 5, 400, 'sine');
    platforms.setAll('body.allowGravity', false);
    platforms.setAll('body.immovable', true);
    platforms.setAll('body.velocity.x',-100);


    // Ball
    player = game.add.sprite(200, 0, 'player');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.bounce.y = 0.2;


}

function update() {
    platforms.forEach(wrapPlatform, this);
    game.physics.arcade.collide(player, platforms, null, null, this)

}


//FUNCTIONS
wrapPlatform = function (platform) {
    if (platform.body.velocity.x > 0 && platform.x >= -1200) {
        platform.x = 1200-11;
    }

};