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
                Node,
                Scene,
                Sprite,
                Surface */


enchant();

// If fps value changes, manual changes must be made wherever you have tl.cue.
var Constants = {
    baseRate: 0.12,
    blue: "#00CCFF",
    fps: 20,
    gray: "#666666",
    panelY: 240,
    playerSpeed: 10,
    red: "#FF0000",
    seconds: 10,
    stageHeight: 480,
    stageWidth: 640,
    
    bindKeys: function (game) {
        // Bind spacebar to 'a' and allow WASD input
        "use strict";
        console.info("Binding keys.");
        game.keybind(32, 'a');
        game.keybind(65, 'left');
        game.keybind(68, 'right');
        game.keybind(87, 'up');
        game.keybind(83, 'down');
    }
};
if (Object.freeze) { Object.freeze(Constants); }


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
            console.info("Creating polystate switch.");
            
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
    
    var panelName = function (name, panel) {
        var nameLabel = new Label(name);
        nameLabel.width = 120;
        nameLabel.height = 18;
        nameLabel.font = "18px arial, sans-serif";
        nameLabel.color = "black";
        nameLabel.x = panel.x + ((panel.width - nameLabel.width) / 2);
        nameLabel.y = panel.y + 70;
        return nameLabel;
    };
    
    /**
     * Class for display and management of switch panels.
     *
     * Derived from enchant.Sprite().
     *
     * @param {String} [name] Name of the panel to be displayed.
     * @param {Image} [img] Preloaded image asset to be used for the panel.
     * @param {Sound} [sound] Preloaded sound asset to be used for the on/off switch.
     * @param {Number} [xCoord] x-coordinate where the panel will be placed.
     * @param {Dial} [upDial] Dial to be increased when this panel is switched on.
     * @param {Dial} [downDial] Dial to be decreased when this panel is switched on.
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
            
            // !!! Create panel label function
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
    SwitchPanels.panel.prototype.use = function () {
        if (this.usable) {
            if (this.isOn === true) {
                this.tl.clear();
                this.isOn = false;
                this.onOffSound.play();
                this.clock.canDecrement = false;
                this.clock.tl.cue({ 20: this.clock.makeIncrementable });
            } else {
                this.tl.clear();
                this.isOn = true;
                this.onOffSound.play();
                this.clock.canDecrement = true;
                this.clock.canIncrement = false;
            }
            this.usable = false;
            this.tl.cue({ 7: this.makeUsable });
        }
    };
    
    SwitchPanels.megapanel = Class.create(SwitchPanels.panel, {
        initialize: function (name, img, sounds, xCoord, dials) {
            SwitchPanels.panel.call(this, name, img, sounds.onOff, xCoord, dials);
            
            var makeSelectable = function () {
                this.selectable = true;
            };
            
            this.selectSound = sounds.polystate;
            this.selectable = true;
            
            // Three selections
            //  - 0: Frims decreasing, pazzles and gonks increasing.
            //  - 1: Pazzles decreasing, frims and gonks increasing.
            //  - 2: Gonks decreasing, frimz and pazzles increasing.
            this.selection = 0;
            
            this.selector = new Selector(this);
            this.select = function selectFunction() {
                if (this.selectable) {
                    if (this.selection === 2) {
                        this.selection = 0;
                        this.selectSound.play();
                    } else {
                        this.selection += 1;
                        this.selectSound.play();
                    }
                    this.selectable = false;
                    this.tl.clear();
                    this.tl.cue({ 7: makeSelectable });
                    this.tl.cue({ 7: this.makeUsable });
                }
            };
            this.use = function useFunction() {
                if (this.usable) {
                    if (this.isOn === true) {
                        this.isOn = false;
                        this.onOffSound.play();
                        this.clock.canDecrement = false;
                    } else {
                        this.isOn = true;
                        this.onOffSound.play();
                        this.clock.canDecrement = true;
                    }
                    this.usable = false;
                    this.tl.clear();
                    this.tl.cue({ 7: this.makeUsable });
                    this.tl.cue({ 7 : makeSelectable });
                }
            };
            
            this.dial1 = dials.upDial;      //frims
            this.dial2 = dials.downDial;    //pazzles
            this.dial3 = dials.downDial2;   //gonks
            // !!! Modify onenterframe
            this.downDial2 = this.dial3;
        },
        
        onenterframe: function modifyDials() {
            if (this.state === 1) {
                if (this.selection === 0) {
                    if ((this.dial1.value - (1.5 * this.dial1.downRate)) >= this.dial1.minValue) {
                        this.dial1.value -= (1.5 * this.dial1.downRate);
                    }
                    if ((this.dial2.value + this.dial2.upRate) <= this.dial2.maxValue) {
                        this.dial2.value += this.dial2.upRate;
                    }
                    if ((this.dial3.value + this.dial3.upRate) <= this.dial3.maxValue) {
                        this.dial3.value += this.dial3.upRate;
                    }
                }
                if (this.selection === 1) {
                    if ((this.dial2.value - (1.5 * this.dial2.downRate)) >= this.dial2.minValue) {
                        this.dial2.value -= (1.5 * this.dial2.downRate);
                    }
                    if ((this.dial1.value + this.dial1.upRate) <= this.dial1.maxValue) {
                        this.dial1.value += this.dial1.upRate;
                    }
                    if ((this.dial3.value + this.dial3.upRate) <= this.dial3.maxValue) {
                        this.dial3.value += this.dial3.upRate;
                    }
                }
                if (this.selection === 2) {
                    if ((this.dial3.value - (1.5 * this.dial3.downRate)) >= this.dial3.minValue) {
                        this.dial3.value -= (1.5 * this.dial3.downRate);
                    }
                    if ((this.dial1.value + this.dial1.upRate) <= this.dial1.maxValue) {
                        this.dial1.value += this.dial1.upRate;
                    }
                    if ((this.dial2.value + this.dial2.upRate) <= this.dial2.maxValue) {
                        this.dial2.value += this.dial2.upRate;
                    }
                }
                
                if ((this.dial1.value > this.dial1.maxValue) || (this.dial1.value < this.dial1.minValue)) {
                    this.dial1.lost = true;
                } else if ((this.dial2.value > this.dial2.maxValue) || (this.dial2.value < this.dial2.minValue)) {
                    this.dial2.lost = true;
                } else if ((this.dial3.value > this.dial3.maxValue) || (this.dial3.value < this.dial3.minValue)) {
                    this.dial3.lost = true;
                }
            }
            this.clock.decrement();
            this.clock.increment();
        }
    });
}(window.SwitchPanels = window.SwitchPanels || {}));


var Warning = {
    danger: Class.create(Sprite, {
        initialize: function (img, dial, sound) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            this.dial = dial;
            this.image = img;
            this.x = this.dial.x + (this.dial.width / 2) - (this.width / 2);
            this.y = this.dial.y - this.height - 16;
            this.visible = false;
            this.sound = sound;
            this.canBuzz = true;
        },
        
        onenterframe: function updateWarning() {
            "use strict";
            if ((this.dial.value < this.dial.minSafe) || (this.dial.value > this.dial.maxSafe)) {
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
        initialize: function (img, dial) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            this.dial = dial;
            this.image = img;
            this.x = this.dial.x + (this.dial.width / 2) - (this.width / 2);
            this.y = this.dial.y - this.height - 16;
        }
    })
};


var Indicator = {
    dial: Class.create(Sprite, {
        initialize: function (name, images, sound, xCoord, minSafe, maxSafe, machine) {
            "use strict";
            Sprite.call(this, images.dial.width, images.dial.height);
            
            var barHeight = 10;
            
            this.image = images.dial;
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


var Player = Class.create(Sprite, {
    initialize: function (img, game) {
        "use strict";
        Sprite.call(this, (img.width / 3), img.height);
        this.game = game;
        
        this.image = img;
        this.frame = 0;
        this.x = (Constants.stageWidth / 2) - (this.width / 2);
        this.y = Constants.stageHeight - this.height;
        this.minX = 0;
        this.maxX = Constants.stageWidth - this.width;
        
        this.interactables = [];
        this.addEventListener(Event.ENTER_FRAME, function () {
            var i;
            if (this.game.input.left && !this.game.input.right) {
                console.info("Player moving left.");
                this.frame = 0;
                if ((this.x - Constants.playerSpeed) >= this.minX) {
                    this.x -= Constants.playerSpeed;
                }
            } else if (this.game.input.right && !this.game.input.left) {
                console.info("Player moving right.");
                this.frame = 1;
                if ((this.x + Constants.playerSpeed) <= this.maxX) {
                    this.x += Constants.playerSpeed;
                }
            }
            if (this.game.input.up && !this.game.input.down) {
                console.log("Player input up.");
                for (i = 0; i < this.interactables.length; i++) {
                    if (this.intersect(this.interactables[i].onSwitch)) {
                        this.interactables[i].use();
                        this.frame = 2;
                    }
                }
            } else if (this.game.input.down && !this.game.input.up) {
                console.info("Player input down.");
                for (i = 0; i < this.interactables.length; i++) {
                    if (this.intersect(this.interactables[i].selector)) {
                        this.interactables[i].select();
                        this.frame = 2;
                    }
                }
            }
        });
    }
});


var Machine = Class.create(Label, {
    initialize: function (game) {
        "use strict";
        Label.call(this);
        this.game = game;
        
        this.visible = false;
        
        this.dials = {
            frimDial: {},
            pazzleDial: {},
            gonkDial: {}
        };
        
        this.baseRate = Constants.baseRate;
        this.frimRate = this.baseRate;
        this.pazzleRate = this.baseRate;
        this.gonkRate = this.baseRate;
        
        this.exploding = false;
        
        this.addEventListener(Event.ENTER_FRAME, function () {
            this.dials.frimDial.value += this.frimRate;
            this.dials.pazzleDial.value += this.pazzleRate;
            this.dials.gonkDial.value += this.gonkRate;
            
            if ((this.dials.frimDial.value > this.dials.frimDial.maxValue) || (this.dials.frimDial.value < this.dials.frimDial.minValue)) {
                this.dials.frimDial.lost = true;
            } else if ((this.dials.pazzleDial.value > this.dials.pazzleDial.maxValue) || (this.dials.pazzleDial.value < this.dials.pazzleDial.minValue)) {
                this.dials.pazzleDial.lost = true;
            } else if ((this.dials.gonkDial.value > this.dials.gonkDial.maxValue) || (this.dials.gonkDial.value < this.dials.gonkDial.minValue)) {
                this.dials.gonkDial.lost = true;
            }
            
            if ((this.dials.frimDial.lost === true) || (this.dials.pazzleDial.lost === true) || (this.dials.gonkDial.lost === true)) {
                this.exploding = true;
                console.info("Kersplode!");
            }
        });
    }
});


var Scenes = {
    gameOver: Class.create(Scene, {
        initialize: function (images, game, sounds) {
            "use strict";
            Scene.call(this);
            
            var kaboom = new Label("KA-BOOM!");
            var songSays = new Label("The song says so, so it must be true!");
            var pressSpace = new Label("Press spacebar to restart.");
            var warning = new Label("If you press it too soon, a reminder of your failure<br>"
                                    + "will follow you into the next life.");
            
            this.game = game;
            this.images = images;
            this.sounds = sounds;
            this.height = Constants.stageHeight;
            this.width = Constants.stageWidth;
            this.backgroundColor = Constants.red;
            
            kaboom.width = Constants.stageWidth;
            kaboom.font = "100px arial,sans-serif";
            kaboom.color = "yellow";
            kaboom.x = 70;
            kaboom.y = 50;
            
            songSays.width = Constants.stageWidth;
            songSays.font = "20px arial,sans-serif";
            songSays.color = "yellow";
            songSays.x = 155;
            songSays.y = 160;
            
            pressSpace.width = Constants.stageWidth;
            pressSpace.font = "50px arial, sans-serif";
            pressSpace.color = "yellow";
            pressSpace.x = 30;
            pressSpace.y = Constants.stageHeight - 125;
            
            warning.width = Constants.stageWidth;
            warning.font = "15px arial, sans-serif";
            warning.color = "yellow";
            warning.x = 160;
            warning.y = Constants.stageHeight - 65;
            
            this.addChild(kaboom);
            this.addChild(songSays);
            this.addChild(pressSpace);
            this.addChild(warning);
            
            this.addEventListener(Event.ENTER_FRAME, function () {
                if (this.game.input.a) {
                    var factoryScene = new Scenes.factory(this.images, this.sounds, this.game);
                    this.game.pushScene(factoryScene);
                }
            });
        }
    }),
    
    title: Class.create(Scene, {
        initialize: function () {
            "use strict";
            Scene.call(this);
            
            var instructions1 = new Label("Objective: Keep the machine from blowing up by regulating gauge levels.");
            var instructions2 = new Label("The three normal regulators each decrease the pressure on one gauge,<br>"
                                         + "but increase the pressure on another.");
            var instructions3 = new Label("The Frimurderer decreases Frims, but increases Pazzles.<br>"
                                         + "The Pazzlepaddler decreases Pazzles, but increases Gonks.<br>"
                                         + "The Gonkiller is wanted in nine kingdoms.");
            var instructions4 = new Label("I'm kidding, of course. It decreases Gonks and increases Frims.");
            var instructions5 = new Label("The fourth regulator, the Fix-It-All, fixes everything. As its name implies.");
            var instructions6 = new Label("Controls:<br>"
                                         + "    Left or A: Move left.<br>"
                                         + "    Right or D: Move right.<br>"
                                         + "    Up or W: Turn on whichever regulator you are standing in front of.<br>"
                                         + "    Down or S: Select Fix-It-All operation.<br>");
            var instructions7 = new Label("The number in the upper left-hand corner is how long you have survived.");
            var pressSpace = new Label("Press spacebar to start.");
            
            function initInstructions(label, yCoord, numberOfLines) {
                label.font = "15px arial,sans-serif";
                label.color = "white";
                label.x = 30;
                label.y = yCoord;
                label.width = Constants.stageWidth - 60;
                label.height = 15 * numberOfLines;
            }
            
            this.height = Constants.stageHeight;
            this.width = Constants.stageWidth;
            this.backgroundColor = "#333333";
            
            initInstructions(instructions1, 30, 1);
            initInstructions(instructions2, 65, 2);
            initInstructions(instructions3, 105, 3);
            initInstructions(instructions4, 160, 1);
            initInstructions(instructions5, 185, 1);
            initInstructions(instructions6, 220, 5);
            initInstructions(instructions7, 315, 1);
            
            pressSpace.font = "50px arial,sans-serif";
            pressSpace.color = "white";
            pressSpace.x = 50;
            pressSpace.y = Constants.stageHeight - 100;
            pressSpace.width = Constants.stageWidth;
            
            this.addChild(pressSpace);
            this.addChild(instructions1);
            this.addChild(instructions2);
            this.addChild(instructions3);
            this.addChild(instructions4);
            this.addChild(instructions5);
            this.addChild(instructions6);
            this.addChild(instructions7);
        }
    }),
    
    factory: Class.create(Scene, {
        initialize: function (images, sounds, game) {
            "use strict";
            console.info("Creating factory scene.");
            Scene.call(this);
            var sp = window.SwitchPanels;
            this.game = game;
            this.gameOverSound = sounds.gameOver;
            
            var frims   = new Indicator.dial("Frims", images.frims, sounds.danger,
                                             25, 25, 85, this.machine);
            var pazzles = new Indicator.dial("Pazzles", images.pazzles, sounds.danger,
                                             230, 10, 70, this.machine);
            var gonks   = new Indicator.dial("Gonks", images.gonks, sounds.danger,
                                             435, 45, 90, this.machine);
            var frimurderer   = new sp.panel("Frimurderer", images.panel, sounds.panel,
                                                  0, {upDial: pazzles, downDial: frims});
            var pazzlepaddler = new sp.panel("Pazzlepaddler", images.panel, sounds.panel,
                                                    160, {upDial: gonks, downDial: pazzles});
            var gonkiller     = new sp.panel("Gonkiller", images.panel, sounds.panel,
                                                320, {upDial: frims, downDial: gonks});
            var fixitall = new sp.megapanel("Fix-It-All", images.megapanel, sounds.megapanel, 480, {upDial: frims, downDial: pazzles, downDial2: gonks});
            var seconds = new Label();
            var children = [];
            var i;
            
            this.player = new Player(images.player, game);
            this.player.interactables.push(frimurderer);
            this.player.interactables.push(pazzlepaddler);
            this.player.interactables.push(gonkiller);
            this.player.interactables.push(fixitall);
            
            this.machine = new Machine(game);
            this.machine.dials.frimDial = frims;
            this.machine.dials.pazzleDial = pazzles;
            this.machine.dials.gonkDial = gonks;
            
            seconds.x = 10;
            seconds.y = 10;
            seconds.color = "white";
            seconds.font = "25px arial,sens-serif";
            seconds.elapsed = 0;
            seconds.incrementable = false;
            seconds.makeIncrementable = function () {
                seconds.incrementable = true;
            };
            seconds.addEventListener(Event.ENTER_FRAME, function () {
                if (seconds.incrementable) {
                    seconds.elapsed += 1;
                    seconds.incrementable = false;
                    seconds.tl.cue({ 20: seconds.makeIncrementable });
                }
                seconds.text = seconds.elapsed;
            });
            seconds.tl.cue({ 20: seconds.makeIncrementable });
            
            children.push(frims);
            children.push(pazzles);
            children.push(gonks);
            children.push(frimurderer);
            children.push(pazzlepaddler);
            children.push(gonkiller);
            children.push(fixitall);
            children.push(this.player);
            children.push(this.machine);
            children.push(seconds);
            
            this.backgroundColor = "black";
            for (i = 0; i < children.length; i++) {
                this.addChild(children[i]);
                if (children[i].clock) {
                    this.addChild(children[i].clock);
                    this.addChild(children[i].onSwitch);
                }
                if (children[i].selector) {
                    this.addChild(children[i].selector);
                }
                if (children[i].safe) {
                    this.addChild(children[i].safe);
                    this.addChild(children[i].danger);
                    this.addChild(children[i].lowZone);
                    this.addChild(children[i].safeZone);
                    this.addChild(children[i].highZone);
                    this.addChild(children[i].needle);
                }
                if (children[i].nameLabel) {
                    this.addChild(children[i].nameLabel);
                }
                if (children[i].explosion) {
                    this.addChild(children[i].explosion);
                }
            }
            
            this.addEventListener(Event.ENTER_FRAME, function () {
                if (this.machine.exploding) {
                    this.gameOverSound.play();
                    this.game.popScene(this);
                }
            });
        }
    })
};


// Initialize and start the game.
//$(document).ready(function () {
window.onload = function () {
    "use strict";
    var game = new Core(Constants.stageWidth, Constants.stageHeight);
    game.preload('img/dial.png',
                 'img/panel.png',
                 'img/player.png',
                 'img/safe.png',
                 'img/warning.png',
                 'sound/bork.wav',
                 'sound/exploded.wav',
                 'sound/gerk.wav',
                 'sound/klaxon.wav');
    game.fps = Constants.fps;
    game.onload = function () {
        console.info("Game loaded.");
        var images = {
            frims: {
                dial: game.assets['img/dial.png'],
                warning: game.assets['img/warning.png'],
                safe: game.assets['img/safe.png']
            },
            gonks: {
                dial: game.assets['img/dial.png'],
                warning: game.assets['img/warning.png'],
                safe: game.assets['img/safe.png']
            },
            megapanel: game.assets['img/panel.png'],
            panel: game.assets['img/panel.png'],
            pazzles: {
                dial: game.assets['img/dial.png'],
                warning: game.assets['img/warning.png'],
                safe: game.assets['img/safe.png']
            },
            player: game.assets['img/player.png']
        };
        var sounds = {
            danger: game.assets['sound/klaxon.wav'],
            panel: game.assets['sound/gerk.wav'],
            megapanel: {
                onOff: game.assets['sound/gerk.wav'],
                polystate: game.assets['sound/bork.wav']
            },
            gameOver: game.assets['sound/exploded.wav']
        };
        
        Constants.bindKeys(game);
        
        var gameOverScene = new Scenes.gameOver(images, game, sounds);
        var factoryScene = new Scenes.factory(images, sounds, game);
        var titleScene = new Scenes.title();
        titleScene.addEventListener(Event.ENTER_FRAME, function () {
            if (game.input.a) {
                game.popScene(this);
            }
        });
        
        game.pushScene(gameOverScene);
        game.pushScene(factoryScene);
        game.pushScene(titleScene);
    };
    game.start();
//});
};
