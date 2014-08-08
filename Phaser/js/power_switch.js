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
            game*/

(function (PowerSwitch) {
    "use strict";
    
    PowerSwitch.createSwitch = function (x, y, spriteGroup) {
        return spriteGroup.create(x, y, 'switch_off');
    };
}(window.PowerSwitch = window.PowerSwitch || {}));