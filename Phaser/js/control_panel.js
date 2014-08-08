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
            game,
            PowerSwitch*/

        
(function (ControlPanel) {
    "use strict";
    ControlPanel.height = 236;
    ControlPanel.width = 156;
    ControlPanel.startX = 120;
    ControlPanel.spacingY = 5;
    
    ControlPanel.createPanel = function (panelX, panelY, spriteGroup) {
        var panel = spriteGroup.create(panelX, panelY, 'control_panel');
        panel.powerSwitch = PowerSwitch.createSwitch(panelX, panelY, spriteGroup);
        return panel;
    };
}(window.ControlPanel = window.ControlPanel || {}));
