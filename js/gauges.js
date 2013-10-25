// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.

//TODO: Add a sound for return to safe zone from danger zone.
//TODO: Different base rates built into details object.

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
     * @param {Object} [images] Preloaded images to be used for the
     * warning light. Has two fields, safe and danger, which refer to
     * preloaded images.
     * @param {Gauge} [gauge] The gauge over which this warning light
     * will exist.
     */
    var WarningLight = Class.create(Sprite, {
        initialize: function (images, sound, gauge) {
            Sprite.call(this, images.safe.width, images.safe.height);
            
            this.safeImage = images.safe;
            this.dangerImage = images.danger;
            this.sound = sound;
            
            this.image = this.safeImage;
            this.x = gauge.x + (gauge.width / 2) - (this.width / 2);
            this.y = gauge.y - this.height - 16;
            
            this.isOn = false;
        }
    });
    
    /**
     * Turns the warning light on and plays the warning sound.
     *
     * Only takes effect if the warning light is already turned off.
     *
     */
    WarningLight.prototype.on = function () {
        if (this.isOn === false) {
            this.image = this.dangerImage;
            this.sound.play();
            this.isOn = true;
        }
    };
    
    /**
     * Turns the warning light off.
     *
     * Only takes effect if the warning light is already turned on.
     *
     */
    WarningLight.prototype.off = function () {
        if (this.isOn === true) {
            this.image = this.safeImage;
            this.isOn = false;
        }
    };
    
    /**
     * Creates a nameplate for a gauge.
     *
     * @param {String} [name] The name to be displayed.
     * @param {Panel} [gauge] The panel on which to display the name.
     */
    function gaugeName(name, gauge) {
        var nameLabel = new Label(name);
        nameLabel.width = 80;
        nameLabel.height = 20;
        nameLabel.backgroundColor = Constants.gray;
        nameLabel.font = "20px arial, sans-serif";
        nameLabel.color = "white";
        nameLabel.x = gauge.x + ((gauge.width - nameLabel.width) / 2);
        nameLabel.y = gauge.y + gauge.height + 10;
        
        return nameLabel;
    }
    
    /**
     * Creates a needle for display on a Gauge.
     *
     * @param {Gauge} [gauge] The gauge to which the needle is attached.
     */
    function makeNeedle(gauge) {
        var needle = new Label();
        needle.height = gauge.height;
        needle.width = 3;
        needle.backgroundColor = "black";
        needle.x = gauge.lowZone.x + (gauge.value * gauge.barRatio) - 1;
        needle.y = gauge.y;
        
        return needle;
    }
    
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
     * @param {Object} [images] Contains references to preloaded images
     * for gauge and warning light.
     * @param [sound] Reference to a preloaded sound file to be used
     * as a klaxon when a gauge hits a red zone.
     * @param {Number} [xCoord] X-coordinate for the gauge.
     * @param {Object} [details] Has four fields. name is a {String}.
     * minSafe and maxSafe are {Number} values between 1 and 100.
     * machine is a {Machine} object.
     */
    Gauges.Gauge = Class.create(Sprite, {
        initialize: function (images, sound, xCoord, details) {
            Sprite.call(this, images.gauge.width, images.gauge.height);
            
            this.image = images.gauge;
            this.x = xCoord;
            this.y = 220 - this.height - 30;
            this.name = details.name;
            this.isLost = false;
            this.machine = details.machine;
            
            this.minValue = 0;
            this.maxValue = 100;
            this.minSafe = details.minSafe;
            this.maxSafe = details.maxSafe;
            this.barRatio = (this.width - 10) / this.maxValue;
            this.value = ((this.maxSafe - this.minSafe) / 2) + this.minSafe;
            
            this.changeRate = Constants.baseRate;
            
            this.highZone = makeZone(this, Constants.zoneHigh);
            this.safeZone = makeZone(this, Constants.zoneSafe);
            this.lowZone = makeZone(this, Constants.zoneLow);
            this.needle = makeNeedle(this);
            this.nameLabel = gaugeName(this.name, this);
            this.warningLight = new WarningLight(images.warningLights, sound, this);
        }
    });
    
    /**
     *
     *
     */
    Gauges.Gauge.prototype.getChangeRate = function () {
        return this.changeRate;
    };
    
    /**
     *
     *
     */
    Gauges.Gauge.prototype.getName = function getGaugeName() {
        return this.name;
    };
    
    /**
     *
     *
     */
    Gauges.Gauge.prototype.getValue = function () {
        return this.value;
    };
    
    /**
     * Increases gauge pressure.
     *
     * @ param {Number} [modifier] The amount by which to increase
     * pressure per tick in the gauge.
     */
    Gauges.Gauge.prototype.increase = function (modifier) {
        this.changeRate = this.changeRate + modifier;
    };
    
    /**
     * Decreases gauge pressure.
     *
     * @ param {Number} [modifier] The amount by which to decrease
     * pressure per tick in the gauge.
     */
    Gauges.Gauge.prototype.decrease = function (modifier) {
        this.changeRate = this.changeRate - modifier;
    };
    
    /**
     * Changes the gauge's value based on its upRate and downRate.
     *
     */
    Gauges.Gauge.prototype.update = function () {
        this.value = this.value + this.changeRate;
        
        if ((this.value < this.minSafe) || (this.value > this.maxSafe)) {
            if ((this.value > this.maxValue) || (this.value < this.minValue)) {
                this.isLost = true;
            } else {
                this.warningLight.on();
            }
        } else {
            this.warningLight.off();
        }
        
        this.needle.x = this.lowZone.x + (this.value * this.barRatio) - 1;
    };
}(window.Gauges = window.Gauges || {}));
