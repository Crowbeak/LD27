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
            GlobalConstants,
            InputHandlers,
            ControlPanel*/


var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game_div');
var player, cursors, floor, controlPanelGroup;

var mainState = {
    preload: function () {
        "use strict";
        game.stage.backgroundColor = '#dddddd';
        
        game.load.image('floor', 'img/floor.png');
        
        game.load.image('control_panel', 'img/panel.png');
        game.load.image('switch_on', 'img/switch_on.png');
        game.load.image('switch_off', 'img/switch_off.png');
        
        game.load.image('player_working', 'img/player_using_machine.png');
        game.load.image('player_left', 'img/player_left.png');
        game.load.image('player_right', 'img/player_right.png');
    },
    
    create: function () {
        "use strict";
        this.initializeCursors();
        this.initializeFloor();
        this.initializeControlPanelGroup();
        this.createPanels(1, controlPanelGroup);
        this.initializePlayer();
    },
    
    update: function () {
        "use strict";
        player.body.velocity.x = 0;
        InputHandlers.movePlayer();
    },
    
    createPanels: function (number, spriteGroup) {
        "use strict";
        var i, panel, panelX;
        var panelY = game.world.height - GlobalConstants.floorHeight - ControlPanel.height;
        for (i = 0; i < number; i++) {
            panelX = ControlPanel.startX + (i * (ControlPanel.width + ControlPanel.spacingY));
            panel = ControlPanel.createPanel(panelX, panelY, spriteGroup);
        }
    },
    
    initializeControlPanelGroup: function () {
        controlPanelGroup = game.add.group();
        controlPanelGroup.enableBody = true;
    },
    
    initializeCursors: function () {
        cursors = game.input.keyboard.createCursorKeys();
    },
    
    initializeFloor: function () {
        floor = game.add.sprite(0, 0, 'floor');
        game.physics.arcade.enable(floor);
        floor.y = game.world.height - GlobalConstants.floorHeight;
        floor.body.immovable = true;
    },
    
    initializePlayer: function () {
        player = game.add.sprite(0, 0, 'player_working');
        game.physics.arcade.enable(player);
        player.x = GlobalConstants.player.startX;
        player.y = game.world.height - GlobalConstants.floorHeight - player.body.height;
        player.body.collideWorldBounds = true;
    }
};

game.state.add('main', mainState);
game.state.start('main');
