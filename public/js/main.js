/**
 * Created by austin on 1/20/17.
 */


var game = new Phaser.Game(1200, 800, Phaser.AUTO, '', {preload: preload, create: create});

function preload() {

    game.load.image('title', '/public/img/openingScreen.jpg');

}

function create() {

    var titleScreen = game.add.sprite(game.world.centerX, game.world.centerY, 'title');
    titleScreen.anchor.setTo(0.5, 0.5);

}