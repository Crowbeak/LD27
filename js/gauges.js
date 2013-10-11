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
    /**
     * Class for display and management of Gauge warning lights.
     *
     * Derived from enchant.Sprite().
     *
     * @param {Image} [img] Preloaded image to be used for Gauge background.
     */
    Gauges.Warning = {
        danger: Class.create(Sprite, {
            initialize: function (img, gauge, sound) {
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
                Sprite.call(this, img.width, img.height);
                
                this.gauge = gauge;
                this.image = img;
                this.x = this.gauge.x + (this.gauge.width / 2) - (this.width / 2);
                this.y = this.gauge.y - this.height - 16;
            }
        })
    };
    
    /**
     * Creates a zone indicator bar for a Gauge based on minimum and
     * maximum safe values.
     *
     * @param {Gauge} [gauge] The gauge for which the zone is being created.
     * @param {String} [zoneType] The zone type to be created.
     */
    function makeZone(gauge, zoneType) {
        var newZone = new Label();
        newZone.height = Constants.zoneBarHeight;
        newZone.x = gauge.x + 5;
        newZone.y = gauge.y + 5;
        if (zoneType === Constants.zoneHigh) {
            newZone.backgroundColor = Constants.red;
            newZone.width = gauge.maxValue * gauge.barRatio;
        } else if (zoneType === Constants.zoneSafe) {
            newZone.backgroundColor = Constants.blue;
            newZone.width = gauge.maxSafe * gauge.barRatio;
        } else if (zoneType === Constants.zoneLow) {
            newZone.backgroundColor = Constants.red;
            newZone.width = gauge.minSafe * gauge.barRatio;
        }
        
        return newZone;
    }
    
    /**
     * Class for display and management of Gauges.
     *
     * Derived from enchant.Sprite().
     *
     */
    Gauges.Gauge = Class.create(Sprite, {
        initialize: function (name, images, sound, xCoord, minSafe, maxSafe, machine) {
            Sprite.call(this, images.gauge.width, images.gauge.height);
            
            this.image = images.gauge;
            this.x = xCoord;
            this.y = 220 - this.height - 30;
            this.lost = false;
            this.machine = machine;
            
            this.minValue = 0;
            this.maxValue = 100;
            this.minSafe = minSafe;
            this.maxSafe = maxSafe;
            this.barRatio = (this.width - 10) / this.maxValue;
            this.value = ((this.maxSafe - this.minSafe) / 2) + this.minSafe;
            this.upBase = Constants.baseRate;
            this.upRate = this.upBase;
            this.downBase = 2 * Constants.baseRate;
            this.downRate = this.downBase;
            
            this.highZone = makeZone(this, Constants.zoneHigh);
            this.safeZone = makeZone(this, Constants.zoneSafe);
            this.lowZone = makeZone(this, Constants.zoneLow);
            
            this.needle = new Label();
            this.needle.height = this.height;
            this.needle.width = 3;
            this.needle.backgroundColor = "black";
            this.needle.x = this.lowZone.x + (this.value * this.barRatio) - 1;
            this.needle.y = this.y;
            this.needle.maxX = this.highZone.x + this.highZone.width - 2;
            this.needle.minX = this.lowZone.x;
            
            this.danger = new Gauges.Warning.danger(images.warning, this, sound);
            this.safe = new Gauges.Warning.safe(images.safe, this);
            
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
            if ((this.value > this.maxValue) || (this.value < this.minValue)) {
                this.lost = true;
            } else {
                var testNeedleX = this.lowZone.x + (this.value * this.barRatio) - 1;
                if ((this.needle.minX < testNeedleX) && (testNeedleX < this.needle.maxX)) {
                    this.needle.x = testNeedleX;
                }
            }
        }
    });
}(window.Gauges = window.Gauges || {}));
