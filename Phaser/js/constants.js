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

/*global    game */


// If fps value changes, manual changes must be made wherever you have tl.cue.
var Constants = {
    blue: "#00CCFF",
    gray: "#666666",
    panelHeight: 236,
    playerSpeed: 200,
    playerStartX: 50,
    red: "#FF0000",
    seconds: 10,
    stageHeight: 480,
    stageWidth: 640,
    zoneHigh: "high",
    zoneLow: "low",
    zoneSafe: "safe"
};
if (Object.freeze) { Object.freeze(Constants); }