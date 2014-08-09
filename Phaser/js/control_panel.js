// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.

// A ControlPanel object has the following members:
//  powerSwitch (PowerSwitch)


/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    Phaser,
            game,
            player,
            PowerSwitch*/

        
(function (ControlPanel) {
    "use strict";
    ControlPanel.height = 236;
    ControlPanel.width = 156;
    ControlPanel.startX = 120;
    ControlPanel.spacingY = 5;
    
    ControlPanel.createPanel = function (panelX, panelY, spriteGroup) {
        var newPanel = spriteGroup.create(panelX, panelY, 'control_panel');
        newPanel.powerSwitch = PowerSwitch.createSwitch(panelX, panelY, spriteGroup);
        return newPanel;
    };
    
    ControlPanel.toggleSwitch = function (controlPanel) {
        game.physics.arcade.overlap(player, controlPanel.powerSwitch,
                                    PowerSwitch.toggleSwitch(controlPanel.powerSwitch), null, this);
    };
}(window.ControlPanel = window.ControlPanel || {}));
