/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    $,
            enchant,
                Class,
                Core,
                Event,
                Label,
                Scene,
                Sprite */


enchant();


var Constants = {
    debug: true,
    stageHeight: 480,
    stageWidth: 640
};
if (Object.freeze) { Object.freeze(Constants); }


var Scenes = {
    factory: Class.create(Scene, {
        initialize: function (frimDial, pazzleDial, gonkDial, switchPanel, togglePanel) {
            "use strict";
            Scene.call(this);
            var frims, pazzles, gonks;
            var whatsit, thingymabob, doodad, fixitall;
            
            this.backgroundColor = "black";
        }
    })
};


$(document).ready(function () {
    "use strict";
    var game = new Core(Constants.stageWidth, Constants.stageHeight);
    game.preload('img/road.png',
                 'img/car.png');
    game.fps = 20;
    game.onload = function () {
        var factoryScene = new Scenes.factory();
        game.pushScene(factoryScene);
    };
    game.start();
});