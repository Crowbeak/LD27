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
            player,
            game,
            cursors*/

(function (InputHandlers) {
    "use strict";
    
    InputHandlers.movePlayer = function () {
        if (cursors.left.isDown) {
            player.body.velocity.x = -150;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 150;
        }
    };
}(window.InputHandlers = window.InputHandlers || {}));