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
            game*/


(function (PowerSwitch) {
    "use strict";
    var relativeX = 30;
    var relativeY = 90;
    
    PowerSwitch.createSwitch = function (panelX, panelY, spriteGroup) {
        return spriteGroup.create(panelX + relativeX, panelY + relativeY, 'switch_off');
    };
}(window.PowerSwitch = window.PowerSwitch || {}));
