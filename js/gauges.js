// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.

// This file contains the Gauge namespace.

/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    Constants,
            enchant,
                Class,
                Label,
                Sprite */


/**
 * Namespace for Gauge instantiation.
 *
 */
(function (Gauges) {
    "use strict";
    var WarningLight = {};
}(window.Gauges = window.Gauges || {}));


var Warning = {
    danger: Class.create(Sprite, {
        initialize: function (img, gauge, sound) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            this.gauge = gauge;
            this.image = img;
            this.x = this.gauge.x + (this.gauge.width / 2) - (this.width / 2);
            this.y = this.gauge.y - this.height - 16;
            this.visible = false;
            this.sound = sound;
            this.canBuzz = true;
        },
        
        onenterframe: function updateWarning() {
            "use strict";
            if ((this.gauge.value < this.gauge.minSafe) || (this.gauge.value > this.gauge.maxSafe)) {
                this.visible = true;
                if (this.canBuzz) {
                    this.sound.play();
                    this.canBuzz = false;
                }
            } else {
                this.visible = false;
                if (!this.canBuzz) {
                    this.canBuzz = true;
                }
            }
        }
    }),
    
    safe: Class.create(Sprite, {
        initialize: function (img, gauge) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            this.gauge = gauge;
            this.image = img;
            this.x = this.gauge.x + (this.gauge.width / 2) - (this.width / 2);
            this.y = this.gauge.y - this.height - 16;
        }
    })
};


var Indicator = {
    gauge: Class.create(Sprite, {
        initialize: function (name, images, sound, xCoord, minSafe, maxSafe, machine) {
            "use strict";
            Sprite.call(this, images.gauge.width, images.gauge.height);
            
            var barHeight = 10;
            
            this.image = images.gauge;
            this.x = xCoord;
            this.y = 220 - this.height - 30;
            this.lost = false;
            this.machine = machine;
            
            this.minValue = 0;
            this.maxValue = 100;
            this.minSafe = minSafe;
            this.maxSafe = maxSafe;
            this.value = ((this.maxSafe - this.minSafe) / 2) + this.minSafe;
            this.upBase = Constants.baseRate;
            this.upRate = this.upBase;
            this.downBase = 2 * Constants.baseRate;
            this.downRate = this.downBase;
            
            this.barRatio = (this.width - 10) / this.maxValue;
            this.lowZone = new Label();
            this.lowZone.height = barHeight;
            this.lowZone.width = this.minSafe * this.barRatio;
            this.lowZone.backgroundColor = Constants.red;
            this.lowZone.x = this.x + 5;
            this.lowZone.y = this.y + 5;
            
            this.safeZone = new Label();
            this.safeZone.height = barHeight;
            this.safeZone.width = (this.maxSafe - this.minSafe) * this.barRatio;
            this.safeZone.backgroundColor = Constants.blue;
            this.safeZone.x = this.lowZone.x + this.lowZone.width;
            this.safeZone.y = this.y + 5;
            
            this.highZone = new Label();
            this.highZone.height = barHeight;
            this.highZone.width = (this.maxValue - this.maxSafe) * this.barRatio;
            this.highZone.backgroundColor = Constants.red;
            this.highZone.x = this.safeZone.x + this.safeZone.width;
            this.highZone.y = this.safeZone.y;
            
            this.needle = new Label();
            this.needle.height = this.height;
            this.needle.width = 3;
            this.needle.backgroundColor = "black";
            this.needle.x = this.lowZone.x + (this.value * this.barRatio) - 1;
            this.needle.y = this.y;
            this.needle.maxX = this.highZone.x + this.highZone.width - 2;
            this.needle.minX = this.lowZone.x;
            
            this.danger = new Warning.danger(images.warning, this, sound);
            this.safe = new Warning.safe(images.safe, this);
            
            this.nameLabel = new Label(name);
            this.nameLabel.width = 80;
            this.nameLabel.height = 20;
            this.nameLabel.backgroundColor = Constants.gray;
            this.nameLabel.font = "20px arial, sans-serif";
            this.nameLabel.color = "white";
            this.nameLabel.x = this.x + ((this.width - this.nameLabel.width) / 2);
            this.nameLabel.y = this.y + this.height + 10;
        },
        
        onenterframe: function () {
            "use strict";
            if ((this.value > this.maxValue) || (this.value < this.minValue)) {
                this.lost = true;
            } else {
                var testNeedleX = this.lowZone.x + (this.value * this.barRatio) - 1;
                if ((this.needle.minX < testNeedleX) && (testNeedleX < this.needle.maxX)) {
                    this.needle.x = testNeedleX;
                }
            }
        }
    })
};
