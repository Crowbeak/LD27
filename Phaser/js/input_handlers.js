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
            ControlPanel,
            player,
            game,
            cursors,
            controlPanelGroup*/


(function (InputHandlers) {
    "use strict";
    
    InputHandlers.movePlayer = function () {
        if (cursors.left.isDown) {
            player.frame = 0;
            player.body.velocity.x = -(GlobalConstants.player.speed);
        } else if (cursors.right.isDown) {
            player.frame = 1;
            player.body.velocity.x = GlobalConstants.player.speed;
        }
    };
    
    InputHandlers.toggleSwitches = function () {
        if (cursors.up.isDown) {
            player.frame = 2;
            controlPanelGroup.forEach(ControlPanel.toggleSwitch, this);
        }
    };
}(window.InputHandlers = window.InputHandlers || {}));
