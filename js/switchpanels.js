// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.


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
            this.height = 20;
            this.width = 60;
            this.x = this.panel.x + 30;
            this.y = this.panel.y + 110;
            
            this.text = "OFF";
            this.backgroundColor = this.offColor;
            this.color = this.offTextColor;
            this.font = "20px arial,sans-serif";
        },
        
        onenterframe: function update() {
            if (this.panel.isOn === false) {
                this.backgroundColor = this.offColor;
                this.text = "OFF";
                this.color = this.offTextColor;
            } else {
                this.backgroundColor = this.onColor;
                this.text = "ON";
                this.color = this.onTextColor;
            }
        }
    });
    
    /**
     * Selector switch for a megapanel.
     *
     * Derived from enchant.Label().
     *
     * @private
     * @param {Panel} [panel] The Panel to which the timer is attached.
     */
    var Selector = Class.create(Label, {
        initialize: function (megapanel) {
            Label.call(this, "FRIMS DOWN");
            console.info("Creating selector.");
            
            this.megapanel = megapanel;
            this.height = 36;
            this.width = 120;
            this.x = this.megapanel.x + 20;
            this.y = this.megapanel.y + 140;
            this.backgroundColor = Constants.blue;
            this.color = "black";
            this.font = "18px arial,sans-serif";
        },
        
        //TODO: store label text on panel.
        onenterframe: function update() {
            if (this.megapanel.selection === 0) {
                this.text = "FRIMS<br>DECREASING";
            } else if (this.megapanel.selection === 1) {
                this.text = "PAZZLES<br>DECREASING";
            } else if (this.megapanel.selection === 2) {
                this.text = "GONKS<br>DECREASING";
            }
        }
    });

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
            // !!! if ((this instanceof Timer) === false) {
            //    return new Timer();
            //}
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
     * A switch panel is used to modify the output of two dials -- one
     * dial goes up, one goes down.
     * Derived from enchant.Sprite.
     *
     * @param {String} [name] Name of the panel to be displayed.
     * @param {Image} [img] Preloaded image asset to be used for the panel.
     * @param {Sound} [sound] Preloaded sound asset to be used for the on/off switch.
     * @param {Number} [xCoord] x-coordinate where the panel will be placed.
     * @param {Object} [dials] Object containing references to the dials
     * to be modified when the panel is turned on.
     * [dials] must have [downDial] and [upDial] fields.
     */
    SwitchPanels.panel = Class.create(Sprite, {
        initialize: function (name, img, sound, xCoord, dials) {
            Sprite.call(this, img.width, img.height);
            
            this.onOffSound = sound;
            this.image = img;
            this.x = xCoord;
            this.y = Constants.panelY;
            
            this.timeLeft = Constants.seconds;
            this.clock = new Timer(this);
            
            this.isOn = false;
            this.onSwitch = new Switch(this);
            this.usable = true;
            
            this.upDial = dials.upDial;
            this.downDial = dials.downDial;
            
            this.nameLabel = panelName(name, this);
        },
        
        onenterframe: function () {
            if (this.isOn === true) {
                if ((this.upDial.value + this.upDial.upRate) <= this.upDial.maxValue) {
                    this.upDial.value += this.upDial.upRate;
                } else {
                    this.upDial.lost = true;
                    console.info("Loss due to a dial at maximum value.");
                }
                if ((this.downDial.value - this.downDial.downRate) >= this.downDial.minValue) {
                    this.downDial.value -= this.downDial.downRate;
                } else {
                    this.downDial.lost = true;
                    console.info("Loss due to a dial at minimum value.");
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
    SwitchPanels.panel.prototype.makeUsable = function () {
        this.usable = true;
    };
    
    /**
    * Uses the panel.
    * 
    * If the panel is off, it will turn on, or vice-versa.
    */
    SwitchPanels.panel.prototype.use = function panelUse() {
        if (this.usable) {
            this.tl.clear();
            this.onOffSound.play();
            if (this.isOn === true) {
                this.isOn = false;
                this.clock.canDecrement = false;
                this.clock.tl.cue({ 20: this.clock.makeIncrementable });
            } else {
                this.isOn = true;
                this.clock.canDecrement = true;
                this.clock.canIncrement = false;
            }
            this.usable = false;
            this.tl.cue({ 7: this.makeUsable });
        }
    };
    
    /**
     * Class for display and management of megapanels.
     *
     * Derived from SwitchPanels.panel, this is a switch panel which
     * makes one dial go up and two go down.
     *
     * @param {String} [name] Name of the panel to be displayed.
     * @param {Image} [img] Preloaded image asset to be used for the panel.
     * @param {Object} [sounds] Object containing references to preloaded
     * sound assets to be used for the on/off switch and selector.
     * [sounds] must have [onOff] and [selector] fields.
     * @param {Number} [xCoord] x-coordinate where the panel will be placed.
     * @param {Object} [dials] Object containing references to the dials
     * to be modified when the panel is turned on.
     * [dials] must have [upDial], [downDial], and [upDial2] fields.
     */
    SwitchPanels.megapanel = Class.create(SwitchPanels.panel, {
        initialize: function (name, img, sounds, xCoord, dials) {
            SwitchPanels.panel.call(this, name, img, sounds.onOff, xCoord, dials);
            
            this.dial1 = dials.downDial;    //frims
            this.dial2 = dials.upDial;      //pazzles
            this.dial3 = dials.upDial2;     //gonks
            this.upDial2 = this.dial3;
            this.modifier = 1.5;
            
            this.selectSound = sounds.selector;
            this.selectable = true;
            
            // Three possible selections:
            //  - 0: dial1 decreasing, dial2 and dial3 increasing.
            //  - 1: dial2 decreasing, dial1 and dial3 increasing.
            //  - 2: dial3 decreasing, dial1 and dial2 increasing.
            this.selection = 0;
            this.selector = new Selector(this);
        },
        
        onenterframe: function () {
            if (this.isOn === true) {
                if (this.selection === 0) {
                    this.downDial = this.dial1;
                    this.upDial = this.dial2;
                    this.upDial2 = this.dial3;
                } else if (this.selection === 1) {
                    this.downDial = this.dial2;
                    this.upDial = this.dial1;
                    this.upDial2 = this.dial3;
                } else if (this.selection === 2) {
                    this.downDial = this.dial3;
                    this.upDial = this.dial1;
                    this.upDial2 = this.dial2;
                }
                
                if ((this.downDial.value - (this.modifier * this.downDial.downRate)) >= this.downDial.minValue) {
                    this.downDial.value -= (this.modifier * this.downDial.downRate);
                } else {
                    this.downDial.lost = true;
                    console.info("Loss due to a dial at minimum value.");
                }
                if ((this.upDial.value + this.upDial.upRate) <= this.upDial.maxValue) {
                    this.upDial.value += this.upDial.upRate;
                } else {
                    this.upDial.lost = true;
                    console.info("Loss due to a dial at maximum value.");
                }
                if ((this.upDial2.value + this.upDial2.upRate) <= this.upDial2.maxValue) {
                    this.upDial2.value += this.upDial2.upRate;
                } else {
                    this.upDial2.lost = true;
                    console.info("Loss due to a dial at maximum value.");
                }
            }
            this.clock.decrement();
            this.clock.increment();
        }
    });
    
    /**
     * Sets the megapanel's selector switch to a usable state.
     *
     */
    SwitchPanels.megapanel.prototype.makeSelectable = function () {
        this.selectable = true;
    };
    
    /**
    * Uses the megapanel.
    * 
    * If the megapanel is off, it will turn on, or vice-versa.
    */
    SwitchPanels.megapanel.prototype.use = function megapanelUse() {
        if (this.usable) {
            this.tl.clear();
            this.onOffSound.play();
            if (this.isOn === true) {
                this.isOn = false;
                this.clock.canDecrement = false;
                this.clock.tl.cue({ 20: this.clock.makeIncrementable });
            } else {
                this.isOn = true;
                this.clock.canDecrement = true;
                this.clock.canIncrement = false;
            }
            this.usable = false;
            this.tl.cue({ 7: this.makeUsable });
            // tl.clear() clears all Timeline events. Next line necessary.
            this.tl.cue({ 7: this.makeSelectable });
        }
    };
    
    /**
    * Changes megapanel options via a selector.
    * 
    * If the panel is off, it will turn on, or vice-versa.
    */
    SwitchPanels.megapanel.prototype.select = function () {
        if (this.selectable) {
            this.tl.clear();
            this.selectSound.play();
            if (this.selection === 2) {
                this.selection = 0;
            } else {
                this.selection += 1;
            }
            this.selectable = false;
            this.tl.cue({ 7: this.makeSelectable });
            // tl.clear() clears all Timeline events. Next line necessary.
            this.tl.cue({ 7: this.makeUsable });
        }
    };
}(window.SwitchPanels = window.SwitchPanels || {}));