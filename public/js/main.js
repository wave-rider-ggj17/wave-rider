/**
 * Created by austin on 1/20/17.
 */


var game = new Phaser.Game(1200, 800, Phaser.AUTO, '', {preload: preload, create: create, update: update});
var sin;
var p;
var bmd;


function preload() {

    // game.load.image('title', '/public/img/openingScreen.jpg');
    game.stage.backgroundColor = '#4f3178';
    game.load.image('player', '/public/img/circle.png');
}

function create() {

    // var titleScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'title');
    // titleScreen.anchor.setTo(0.5, 0.5);

    //  The frequency (4) = the number of waves
    // http://phaser.io/docs/2.4.2/Phaser.Math.html#sinCosGenerator
    var data = game.math.sinCosGenerator(1200, 100, null, 4);

    sin = data.sin;

    //  Just so we can see the data
    bmd = game.add.bitmapData(1200, 800);
    bmd.addToWorld();
    p = game.add.sprite(0, 400, 'player');

}

function update() {
    bmd.clear();

    for (var i = 0; i < 1200; i++) {
        bmd.circle(i, 400 + sin[i], 2, 2, '#000000');
        if (i == 0){
            p.y = sin[i]+300;
            p.x = i+100;
        }
    }

    Phaser.ArrayUtils.rotate(sin);

}
