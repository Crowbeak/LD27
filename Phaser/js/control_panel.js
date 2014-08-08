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
            game,
            PowerSwitch*/

(function (ControlPanel) {
    "use strict";
    
    ControlPanel.createPanels = function (number, spriteGroup) {
        var i, panel;
        for (i = 0; i < number; i++) {
            panel = spriteGroup.create(0, 0, 'control_panel');
            panel.y = game.world.height - Constants.floorHeight - panel.body.height;
            panel.x = Constants.panelStartX + (i * (panel.body.width + 5));
            
            panel.powerSwitch = PowerSwitch.createSwitch(panel.x + 30, panel.y + 90, spriteGroup);
            game.physics.arcade.enable(panel.powerSwitch);
        }
    };
}(window.ControlPanel = window.ControlPanel || {}));