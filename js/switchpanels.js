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
     * @param {Gauge} [gauge] The gauge to decrease.
     */
    Selector.prototype.makeSelection = function (gauge) {
        this.text = gauge.name + "<br>DECREASING";
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
     * @param {String} [name] The name to be displayed.
     * @param {Panel} [panel] The panel on which to display the name.
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
     */
    SwitchPanels.panel = Class.create(Sprite, {
        initialize: function (name, img, sound, xCoord) {
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
            
            this.downGauges = [];
            this.upGauges = [];
            this.downPressure = Constants.baseRate * 2;
            this.upPressure = Constants.baseRate;
            this.pressureRange = this.downPressure + this.upPressure;
            
            this.nameLabel = panelName(name, this);
        },
        
        onenterframe: function panelOEF() {
            this.clock.decrement();
            this.clock.increment();
        }
    });
    
    /**
     * Adds a new member to the downGauges list.
     *
     */
    SwitchPanels.panel.prototype.addDownGauge = function (gauge) {
        this.downGauges.push(gauge);
        console.info("Adding " + gauge.name + " to downGauges.");
    };
    
    /**
     * Adds a new member to the upGauges list.
     *
     */
    SwitchPanels.panel.prototype.addUpGauge = function (gauge) {
        this.upGauges.push(gauge);
        console.info("Adding " + gauge.name + " to upGauges.");
    };
    
    /**
     * Removes and returns the first member in the downGauges list.
     *
     */
    SwitchPanels.panel.prototype.removeDownGauge = function () {
        var gauge = (this.downGauges.splice(0, 1)).pop();
        console.log("Removing " + gauge.name + " from downGauges.");
        return gauge;
    };
    
    /**
     * Removes and returns the first member in the upGauges list.
     *
     */
    SwitchPanels.panel.prototype.removeUpGauge = function () {
        var gauge = (this.upGauges.splice(0, 1)).pop();
        console.log("Removing " + gauge.name + " from upGauges.");
        return gauge;
    };
    
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
        var i;
        
        for (i = 0; i < this.downGauges.length; i++) {
            this.downGauges[i].increase(this.downPressure);
        }
        for (i = 0; i < this.upGauges.length; i++) {
            this.upGauges[i].decrease(this.upPressure);
        }
        
        this.isOn = false;
        this.onSwitch.turnOff();
        this.clock.canDecrement = false;
        this.clock.tl.cue({ 20: this.clock.makeIncrementable });
    };
    
    /**
     * Turns the panel on.
     *
     */
    SwitchPanels.panel.prototype.turnOn = function turnPanelOn() {
        var i;
        
        for (i = 0; i < this.downGauges.length; i++) {
            this.downGauges[i].decrease(this.downPressure);
        }
        for (i = 0; i < this.upGauges.length; i++) {
            this.upGauges[i].increase(this.upPressure);
        }
        
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
        initialize: function (name, img, sounds, xCoord) {
            SwitchPanels.panel.call(this, name, img, sounds.onOff, xCoord);
            
            this.selectSound = sounds.selector;
            this.selector = new Selector(this, "Frims<br>DECREASING");
        }
    });
    
    SwitchPanels.megapanel.prototype.changeSelection = function megapanelSelect() {
        var tempGauge;
        
        tempGauge = this.removeUpGauge();
        tempGauge.decrease(this.pressureRange);
        this.addDownGauge(tempGauge);
        
        tempGauge = this.removeDownGauge();
        tempGauge.increase(this.pressureRange);
        this.addUpGauge(tempGauge);
        
        this.selector.makeSelection(this.downGauges[0]);
    };
    
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
                this.changeSelection();
                this.makeUnusable();
            }
        }
    };
}(window.SwitchPanels = window.SwitchPanels || {}));