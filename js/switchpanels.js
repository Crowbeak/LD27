// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.

//TODO: Check for clock cue clearing.
//TODO: Create wrapper for clock queuing/unqueueing.
//TODO: Store selector text on panel.
//TODO: Check if Selector really needs a this.megapanel.

// This file contains the SwitchPanels namespace.
// It must be loaded after constants.js and before main.js.

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
 * Namespace for switch panel instantiation.
 *
 */
(function (SwitchPanels) {
    "use strict";
    /**
     * On/off switch for a panel.
     *
     * Derived from enchant.Label().
     *
     * @private
     * @param {Panel} [panel] The Panel to which the timer is attached.
     */
    var Switch = Class.create(Label, {
        initialize: function (panel) {
            Label.call(this, "ON");
            console.info("Creating on/off switch.");
            
            this.panel = panel;
            this.onColor = Constants.blue;
            this.onTextColor = "black";
            this.offColor = Constants.red;
            this.offTextColor = "white";
            this.font = "20px arial,sans-serif";
            
            this.height = 20;
            this.width = 60;
            this.x = this.panel.x + 30;
            this.y = this.panel.y + 110;
        }
    });
    
    /**
     * Sets the on/off switch to its off state.
     *
     */
    Switch.prototype.turnOff = function turnSwitchOff() {
        this.backgroundColor = this.offColor;
        this.text = "OFF";
        this.color = this.offTextColor;
    };
    
    /**
     * Sets the on/off switch to its on state.
     *
     */
    Switch.prototype.turnOn = function turnSwitchOn() {
        this.backgroundColor = this.onColor;
        this.text = "ON";
        this.color = this.onTextColor;
    };
    
    /**
     * Selector switch for a megapanel.
     *
     * Derived from enchant.Label().
     *
     * @private
     * @param {Panel} [panel] The Panel to which the timer is attached.
     */
    var Selector = Class.create(Label, {
        initialize: function (megapanel, startText) {
            Label.call(this, startText);
            console.info("Creating selector.");
            
            this.megapanel = megapanel;
            this.height = 36;
            this.width = 120;
            this.x = this.megapanel.x + 20;
            this.y = this.megapanel.y + 140;
            this.backgroundColor = Constants.blue;
            this.color = "black";
            this.font = "18px arial,sans-serif";
        }
    });
    
    /**
     * Changes the text on the selector switch text.
     *
     * @param {String} [selectorText] The name of the gauge to decrease.
     */
    Selector.prototype.makeSelection = function (selectorText) {
        this.text = selectorText + "<br>DECREASING";
    };

    /**
     * Class for display and management of switch panel timers.
     *
     * Derived from enchant.Label().
     *
     * @private
     * @param {Panel} [panel] The Panel to which the timer is attached.
     *
     */
    var Timer = Class.create(Label, {
        initialize: function (panel) {
            Label.call(this);
            console.info("Creating timer.");
            
            this.panel = panel;
            this.x = this.panel.x + 45;
            this.y = this.panel.y + 25;
            this.canDecrement = false;
            this.canIncrement = false;
            
            this.color = Constants.blue;
            this.font = "30px arial,sans-serif";
        },
        
        onenterframe: function () {
            this.text = this.panel.timeLeft;
        }
    });
    
    /**
     * Enables timer decrementing.
     *
     * Makes the timer decrementable if it is both on and its time left
     * is greater than zero.
     *
     */
    Timer.prototype.makeDecrementable = function () {
        if ((this.panel.isOn === true) && (this.panel.timeLeft > 0)) {
            this.canDecrement = true;
            console.info("Timer is now decrementable.");
        }
    };
    
    /**
     * Enables time incrementing.
     * 
     * Makes the timer incrementable if it is both off and its time left
     * is less than 10.
     *
     */
    Timer.prototype.makeIncrementable = function () {
        if ((this.panel.isOn === false) && (this.panel.timeLeft < 10)) {
            this.canIncrement = true;
            console.info("Timer is now incrementable.");
        }
    };
    
    /**
     * Decrements time on clock.
     * 
     * Decrements the time on the clock once per second unless the
     * timer has reached 0, in which case it turns the panel off.
     * @private
     *
     * TODO: Create function to turn panel off/on
     *
     */
    Timer.prototype.decrement = function () {
        if (this.panel.timeLeft > 0) {
            if (this.canDecrement === true) {
                this.panel.timeLeft -= 1;
                this.canDecrement = false;
                this.tl.cue({ 20: this.makeDecrementable });
                console.info("Timer no longer decrementable.");
            }
        } else {
            this.panel.isOn = false;
            this.canDecrement = false;
            this.tl.cue({ 20: this.makeIncrementable });
            console.info("Timer turned off automagically.");
        }
    };
    
    /**
     * Increments time on clock.
     * 
     * Increments the time on the clock once per second unless the
     * timer has reached 10.
     * @private
     *
     */
    Timer.prototype.increment = function addSeconds() {
        if (this.panel.timeLeft < 10) {
            if (this.canIncrement === true) {
                this.panel.timeLeft += 1;
                this.canIncrement = false;
                this.tl.cue({ 20: this.makeIncrementable });
                console.log("Timer has been incremented.");
            }
        } else {
            this.canIncrement = false;
        }
    };
    
    /**
     * Creates a nameplate for a panel.
     *
     */
    function panelName(name, panel) {
        var nameLabel = new Label(name);
        nameLabel.width = 120;
        nameLabel.height = 18;
        nameLabel.font = "18px arial, sans-serif";
        nameLabel.color = "black";
        nameLabel.x = panel.x + ((panel.width - nameLabel.width) / 2);
        nameLabel.y = panel.y + 70;
        return nameLabel;
    }
    
    /**
     * Class for display and management of switch panels.
     *
     * A switch panel is used to modify the output of two gauges -- one
     * gauge goes up, one goes down.
     * Derived from enchant.Sprite.
     *
     * @param {String} [name] Name of the panel to be displayed.
     * @param {Image} [img] Preloaded image asset to be used for the panel.
     * @param {Sound} [sound] Preloaded sound asset to be used for the on/off switch.
     * @param {Number} [xCoord] x-coordinate where the panel will be placed.
     * @param {Object} [gauges] Object containing references to the gauges
     * to be modified when the panel is turned on.
     * [gauges] must have [downGauge] and [upGauge] fields.
     */
    SwitchPanels.panel = Class.create(Sprite, {
        initialize: function (name, img, sound, xCoord, gauges) {
            Sprite.call(this, img.width, img.height);
            
            this.onOffSound = sound;
            this.image = img;
            this.x = xCoord;
            this.y = Constants.panelY;
            
            this.timeLeft = Constants.seconds;
            this.clock = new Timer(this);
            
            this.isOn = false;
            this.onSwitch = new Switch(this);
            this.onSwitch.turnOff();
            this.isUsable = true;
            
            this.upGauge = gauges.upGauge;
            this.downGauge = gauges.downGauge;
            
            this.nameLabel = panelName(name, this);
        },
        
        onenterframe: function panelOEF() {
            if (this.isOn === true) {
                if ((this.upGauge.value + this.upGauge.upRate) <= this.upGauge.maxValue) {
                    this.upGauge.value += this.upGauge.upRate;
                } else {
                    this.upGauge.lost = true;
                    console.info("Loss due to a gauge at maximum value.");
                }
                if ((this.downGauge.value - this.downGauge.downRate) >= this.downGauge.minValue) {
                    this.downGauge.value -= this.downGauge.downRate;
                } else {
                    this.downGauge.lost = true;
                    console.info("Loss due to a gauge at minimum value.");
                }
            }
            this.clock.decrement();
            this.clock.increment();
        }
    });
    
    /**
     * Sets panel on/off switch to a usable state.
     *
     */
    SwitchPanels.panel.prototype.makeUsable = function makePanelUsable() {
        this.isUsable = true;
    };
    
    /**
     * Sets panel on/off switch to an unusuable state.
     *
     */
    SwitchPanels.panel.prototype.makeUnusable = function makePanelUnusable() {
        this.isUsable = false;
        this.tl.cue({ 7: this.makeUsable });
    };
    
    /**
     * Turns the panel off.
     *
     */
    SwitchPanels.panel.prototype.turnOff = function turnPanelOff() {
        this.isOn = false;
        this.onSwitch.turnOff();
        this.clock.canDecrement = false;
        this.clock.tl.cue({ 20: this.clock.makeIncrementable });
    };
    
    /**
     * Turns the panel onn.
     *
     */
    SwitchPanels.panel.prototype.turnOn = function turnPanelOn() {
        this.isOn = true;
        this.onSwitch.turnOn();
        this.clock.canDecrement = true;
        this.clock.canIncrement = false;
    };
    
    /**
     * Updates the panel state.
     *
     * If the panel is off, it will turn on, or vice-versa.
     *
     * @param {Object} [updateData] An object containing all the info
     * needed to update a panel or megapanel.
     */
    SwitchPanels.panel.prototype.update = function panelUpdate(updateData) {
        if (this.isUsable && (updateData.onOff === true) && updateData.player.intersect(this.onSwitch)) {
            this.tl.clear();
            this.onOffSound.play();
            if (this.isOn === true) {
                this.turnOff();
            } else {
                this.turnOn();
            }
            this.makeUnusable();
        }
    };
    
    /**
     * Class for display and management of megapanels.
     *
     * Derived from SwitchPanels.panel, this is a switch panel which
     * makes one gauge go up and two go down.
     *
     * @param {String} [name] Name of the panel to be displayed.
     * @param {Image} [img] Preloaded image asset to be used for the panel.
     * @param {Object} [sounds] Object containing references to preloaded
     * sound assets to be used for the on/off switch and selector.
     * [sounds] must have [onOff] and [selector] fields.
     * @param {Number} [xCoord] x-coordinate where the panel will be placed.
     * @param {Object} [gauges] Object containing references to the gauges
     * to be modified when the panel is turned on.
     * [gauges] must have [upGauge], [downGauge], and [upGauge2] fields.
     */
    SwitchPanels.megapanel = Class.create(SwitchPanels.panel, {
        initialize: function (name, img, sounds, xCoord, gauges) {
            SwitchPanels.panel.call(this, name, img, sounds.onOff, xCoord, gauges);
            
            this.gauge1 = gauges.downGauge;    //frims
            this.gauge2 = gauges.upGauge;      //pazzles
            this.gauge3 = gauges.upGauge2;     //gonks
            this.upGauge2 = this.gauge3;
            this.modifier = 1.5;
            
            this.selectSound = sounds.selector;
            
            // Three possible selections:
            //  - 0: gauge1 decreasing, gauge2 and gauge3 increasing.
            //  - 1: gauge2 decreasing, gauge1 and gauge3 increasing.
            //  - 2: gauge3 decreasing, gauge1 and gauge2 increasing.
            this.selection = 0;
            this.selector = new Selector(this, "FRIMS<br>DECREASING");
        },
        
        onenterframe: function megapanelOEF() {
            if (this.isOn === true) {
                if (this.selection === 0) {
                    this.downGauge = this.gauge1;
                    this.upGauge = this.gauge2;
                    this.upGauge2 = this.gauge3;
                } else if (this.selection === 1) {
                    this.downGauge = this.gauge2;
                    this.upGauge = this.gauge1;
                    this.upGauge2 = this.gauge3;
                } else if (this.selection === 2) {
                    this.downGauge = this.gauge3;
                    this.upGauge = this.gauge1;
                    this.upGauge2 = this.gauge2;
                }
                
                if ((this.downGauge.value - (this.modifier * this.downGauge.downRate)) >= this.downGauge.minValue) {
                    this.downGauge.value -= (this.modifier * this.downGauge.downRate);
                } else {
                    this.downGauge.lost = true;
                    console.info("Loss due to a gauge at minimum value.");
                }
                if ((this.upGauge.value + this.upGauge.upRate) <= this.upGauge.maxValue) {
                    this.upGauge.value += this.upGauge.upRate;
                } else {
                    this.upGauge.lost = true;
                    console.info("Loss due to a gauge at maximum value.");
                }
                if ((this.upGauge2.value + this.upGauge2.upRate) <= this.upGauge2.maxValue) {
                    this.upGauge2.value += this.upGauge2.upRate;
                } else {
                    this.upGauge2.lost = true;
                    console.info("Loss due to a gauge at maximum value.");
                }
            }
            this.clock.decrement();
            this.clock.increment();
        }
    });
    
    /**
    * Updates the megapanel state.
    * 
    * If the player pushed up, it will turn the megapanel on or off.
    * If the player pushed down, it will cycle to the next selection option.
    *
    * @param {Object} [updateData] An object containing all the info
    * needed to update a panel or megapanel.
    */
    SwitchPanels.megapanel.prototype.update = function megapanelUpdate(updateData) {
        if (this.isUsable) {
            if ((updateData.onOff === true) && updateData.player.intersect(this.onSwitch)) {
                this.tl.clear();
                this.onOffSound.play();
                if (this.isOn === true) {
                    this.turnOff();
                } else {
                    this.turnOn();
                }
                this.makeUnusable();
            } else if ((updateData.selector === true) && updateData.player.intersect(this.selector)) {
                this.tl.clear();
                this.selectSound.play();
                if (this.selection === 0) {
                    this.selection = 1;
                    this.selector.makeSelection("PAZZLES");
                } else if (this.selection === 1) {
                    this.selection = 2;
                    this.selector.makeSelection("GONKS");
                } else if (this.selection === 2) {
                    this.selection = 0;
                    this.selector.makeSelection("FRIMS");
                }
                this.makeUnusable();
            }
        }
    };
}(window.SwitchPanels = window.SwitchPanels || {}));