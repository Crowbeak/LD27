// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.


/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    game */


// If fps value changes, manual changes must be made wherever you have tl.cue.
var GlobalConstants = {
    colors: {
        blue: "#00CCFF",
        gray: "#666666",
        red: "#FF0000",
    },
    
    player: {
        speed: 200,
        startX: 50
    },
    
    floorHeight: 50,
    seconds: 10,
    stageHeight: 480,
    stageWidth: 640,
    zoneHigh: "high",
    zoneLow: "low",
    zoneSafe: "safe"
};
if (Object.freeze) { Object.freeze(GlobalConstants); }