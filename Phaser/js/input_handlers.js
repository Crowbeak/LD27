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
            player,
            game,
            cursors*/

(function (InputHandlers) {
    "use strict";
    
    InputHandlers.movePlayer = function () {
        if (cursors.left.isDown) {
            player.body.velocity.x = -(GlobalConstants.player.speed);
        } else if (cursors.right.isDown) {
            player.body.velocity.x = GlobalConstants.player.speed;
        }
    };
}(window.InputHandlers = window.InputHandlers || {}));