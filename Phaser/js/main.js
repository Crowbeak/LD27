// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.


/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    Phaser,
            InputHandlers*/

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game_div');
var player, cursors;

var main_state = {
    preload: function () {
        "use strict";
        game.stage.backgroundColor = '#dddddd';
        
        game.load.image('player_working', 'img/player_using_machine.png');
        game.load.image('player_left', 'img/player_left.png');
        game.load.image('player_right', 'img/player_right.png');
    },
    
    create: function () {
        "use strict";
        cursors = game.input.keyboard.createCursorKeys();
        
        player = game.add.sprite(320, game.world.height - 120, 'player_working');
        game.physics.arcade.enable(player);
    },
    
    update: function () {
        "use strict";
        player.body.velocity.x = 0;
        InputHandlers.checkPlayerX();
        InputHandlers.movePlayer();
    }
};

game.state.add('main', main_state);
game.state.start('main');