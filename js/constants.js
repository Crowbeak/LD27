// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.


// constants.js must be the first file loaded.
// It starts enchant.js up in addition to specifying the Constants object.

/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    enchant */


enchant();

// If fps value changes, manual changes must be made wherever you have tl.cue.
var Constants = {
    baseRate: 0.12,
    blue: "#00CCFF",
    fps: 20,
    gray: "#666666",
    panelY: 240,
    playerSpeed: 10,
    red: "#FF0000",
    seconds: 10,
    stageHeight: 480,
    stageWidth: 640,
    
    bindKeys: function (game) {
        // Bind spacebar to 'a' and allow WASD input
        "use strict";
        console.info("Binding keys.");
        game.keybind(32, 'a');
        game.keybind(65, 'left');
        game.keybind(68, 'right');
        game.keybind(87, 'up');
        game.keybind(83, 'down');
    }
};
if (Object.freeze) { Object.freeze(Constants); }