// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.

// A PowerSwitch has the following members:
//  isOn (bool)


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
        var newSwitch = spriteGroup.create(panelX + relativeX, panelY + relativeY, 'power_switch', 0);
        newSwitch.isOn = false;
        return newSwitch;
    };
    
    PowerSwitch.toggleSwitch = function (powerSwitch) {
        if (powerSwitch.isOn) {
            powerSwitch.isOn = false;
            powerSwitch.frame = 0;
        } else {
            powerSwitch.isOn = true;
            powerSwitch.frame = 1;
        }
    };
}(window.PowerSwitch = window.PowerSwitch || {}));
