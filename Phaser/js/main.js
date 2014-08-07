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
            Constants,
            InputHandlers,
            ControlPanels*/

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game_div');
var player, cursors, floor, controlPanelGroup;

var main_state = {
    preload: function () {
        "use strict";
        game.stage.backgroundColor = '#dddddd';
        
        game.load.image('floor', 'img/floor.png');
        game.load.image('control_panel', 'img/panel.png');
        
        game.load.image('player_working', 'img/player_using_machine.png');
        game.load.image('player_left', 'img/player_left.png');
        game.load.image('player_right', 'img/player_right.png');
    },
    
    create: function () {
        "use strict";
        cursors = game.input.keyboard.createCursorKeys();
        
        floor = game.add.sprite(0, 0, 'floor');
        game.physics.arcade.enable(floor);
        floor.y = game.world.height - Constants.floorHeight;
        floor.body.immovable = true;
        
        controlPanelGroup = game.add.group();
        controlPanelGroup.enableBody = true;
        ControlPanels.createPanels(1, controlPanelGroup);
        
        player = game.add.sprite(0, 0, 'player_working');
        game.physics.arcade.enable(player);
        player.x = Constants.playerStartX;
        player.y = game.world.height - Constants.floorHeight - player.body.height;
        player.body.collideWorldBounds = true;
    },
    
    update: function () {
        "use strict";
        player.body.velocity.x = 0;
        InputHandlers.movePlayer();
    }
};

game.state.add('main', main_state);
game.state.start('main');