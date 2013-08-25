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
    blue: "#00CCFF",
    fps: 20,
    gray: "#666666",
    playerSpeed: 8,
    red: "#FF0000",
    seconds: 10,
    stageHeight: 480,
    stageWidth: 640
};
if (Object.freeze) { Object.freeze(Constants); }

function bindKeys(game) {
    "use strict";
    console.info("Binding keys.");
    // Space as 'a' button.
    game.keybind(32, 'a');
    // Add WASD movement functionality (doesn't overwrite arrow key movement)
    game.keybind(65, 'left');
    game.keybind(68, 'right');
    game.keybind(87, 'up');
    game.keybind(83, 'down');
}


var Timer = {
    clock: Class.create(Label, {
        initialize: function (panel) {
            "use strict";
            Label.call(this);
            
            this.panel = panel;
            this.x = this.panel.x + 45;
            this.y = this.panel.y + 25;
            
            this.color = Constants.blue;
            this.font = "30px arial,sans-serif";
            
            this.canDecrement = false;
            this.canIncrement = false;
            this.makeDecrementable = function () {
                if ((this.panel.state === 1) && (this.panel.timeLeft > 0)) {
                    this.canDecrement = true;
                }
            };
            this.makeIncrementable = function () {
                if ((this.panel.state === 0) && (this.panel.timeLeft < 10)) {
                    this.canIncrement = true;
                }
            };
            this.decrement = function () {
                if (this.panel.timeLeft > 0) {
                    if (this.canDecrement === true) {
                        this.panel.timeLeft -= 1;
                        this.canDecrement = false;
                        this.tl.cue({ 20: this.makeDecrementable });
                    }
                } else {
                    this.panel.state = 0;
                    this.canDecrement = false;
                    this.tl.cue({ 20: this.makeIncrementable });
                }
            };
            this.increment = function addSeconds() {
                if (this.panel.timeLeft < 10) {
                    if (this.canIncrement === true) {
                        this.panel.timeLeft += 1;
                        this.canIncrement = false;
                        this.tl.cue({ 20: this.makeIncrementable });
                    }
                } else {
                    this.canIncrement = false;
                }
            };
        },
        
        onenterframe: function () {
            "use strict";
            this.text = this.panel.timeLeft;
        }
    })
};


var Switch = {
    onOff: Class.create(Label, {
        initialize: function (panel) {
            "use strict";
            Label.call(this, "ON");
            
            this.panel = panel;
            this.onColor = Constants.blue;
            this.onTextColor = "black";
            this.offColor = Constants.red;
            this.offTextColor = "white";
            this.height = 20;
            this.width = 60;
            this.x = this.panel.x + 30;
            this.y = this.panel.y + 100;
            
            this.text = "OFF";
            this.backgroundColor = this.offColor;
            this.color = this.offTextColor;
            this.font = "20px arial,sans-serif";
        },
        
        onenterframe: function update() {
            "use strict";
            if (this.panel.state === 0) {
                this.backgroundColor = this.offColor;
                this.text = "OFF";
                this.color = this.offTextColor;
            } else {
                this.backgroundColor = this.onColor;
                this.text = "ON";
                this.color = this.onTextColor;
            }
        }
    }),
    
    polystate: Class.create(Label, {
        initialize: function (megapanel) {
            "use strict";
            Label.call(this, "FRIMS DOWN");
            
            this.megapanel = megapanel;
            this.onColor = Constants.blue;
            this.onTextColor = "black";
            this.offColor = Constants.red;
            this.offTextColor = "white";
            this.height = 36;
            this.width = 120;
            this.x = this.megapanel.x + 20;
            this.y = this.megapanel.y + 130;
            
            this.text = "OFF";
            this.backgroundColor = this.offColor;
            this.color = this.offTextColor;
            this.font = "18px arial,sans-serif";
        },
        
        onenterframe: function update() {
            "use strict";
            if (this.megapanel.selection === 0) {
                this.backgroundColor = this.onColor;
                this.text = "FRIMS<br>DECREASING";
                this.color = this.onTextColor;
            } else if (this.megapanel.selection === 1) {
                this.backgroundColor = this.onColor;
                this.text = "PAZZLES<br>DECREASING";
                this.color = this.onTextColor;
            } else if (this.megapanel.selection === 2) {
                this.backgroundColor = this.onColor;
                this.text = "GONKS<br>DECREASING";
                this.color = this.onTextColor;
            }
        }
    })
};


var Warning = {
    danger: Class.create(Sprite, {
        initialize: function (img, dial) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            this.dial = dial;
            this.image = img;
            this.x = this.dial.x + (this.dial.width / 2) - (this.width / 2);
            this.y = this.dial.y - this.height - 16;
            this.visible = false;
        },
        
        onenterframe: function updateWarning() {
            "use strict";
            if ((this.dial.value < this.dial.minSafe) || (this.dial.value > this.dial.maxSafe)) {
                this.visible = true;
            } else {
                this.visible = false;
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
        initialize: function (name, images, xCoord, minSafe, maxSafe, upRate, downRate) {
            "use strict";
            Sprite.call(this, images.dial.width, images.dial.height);
            
            var barHeight = 10;
            
            this.image = images.dial;
            this.x = xCoord;
            this.y = 220 - this.height - 30;
            this.lost = false;
            
            this.minValue = 0;
            this.maxValue = 100;
            this.minSafe = minSafe;
            this.maxSafe = maxSafe;
            this.value = ((this.maxSafe - this.minSafe) / 2) + this.minSafe;
            this.upRate = upRate;
            this.downRate = downRate;
            
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
            
            this.danger = new Warning.danger(images.warning, this);
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
            var testNeedleX = this.lowZone.x + (this.value * this.barRatio) - 1;
            if ((this.needle.minX < testNeedleX) && (testNeedleX < this.needle.maxX)) {
                this.needle.x = testNeedleX;
            }
        }
    }),
    
    panel: Class.create(Sprite, {
        initialize: function (img, sound, xCoord, upDial, downDial) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            var makeUsable = function () {
                this.usable = true;
            };
            
            this.sound = sound;
            this.image = img;
            this.x = xCoord;
            this.y = 240;
            
            this.timeLeft = Constants.seconds;
            this.clock = new Timer.clock(this);
            
            // Two states
            //  - 0: Off.
            //  - 1: On.
            this.state = 0;
            
            this.actionPoint = this.x + (this.width / 2);
            this.onSwitch = new Switch.onOff(this);
            this.usable = true;
            this.use = function useFunction() {
                if (this.usable) {
                    if (this.state === 1) {
                        this.tl.clear();
                        this.state = 0;
                        this.sound.play();
                        this.clock.canDecrement = false;
                        this.clock.tl.cue({ 20: this.clock.makeIncrementable });
                    } else {
                        this.tl.clear();
                        this.state = 1;
                        this.sound.play();
                        this.clock.canDecrement = true;
                        this.clock.canIncrement = false;
                    }
                    this.usable = false;
                    // If FPS changes, change numerical value.
                    this.tl.cue({ 7: makeUsable });
                }
            };
            
            this.upDial = upDial;
            this.downDial = downDial;
        },
        
        onenterframe: function modifyDials() {
            "use strict";
            if (this.state === 1) {
                if ((this.upDial.value + this.upDial.upRate) <= this.upDial.maxValue) {
                    this.upDial.value += this.upDial.upRate;
                    if ((this.upDial.value > this.upDial.maxValue) || (this.upDial.value < this.upDial.minValue)) {
                        this.upDial.lost = true;
                        console.info("Loss due to a dial at maximum value.");
                    }
                }
                if ((this.downDial.value - this.downDial.downRate) >= this.downDial.minValue) {
                    this.downDial.value -= this.downDial.downRate;
                    if ((this.downDial.value < this.downDial.minValue) || (this.downDial.value > this.downDial.maxValue)) {
                        this.downDial.lost = true;
                        console.info("Loss due to a dial at minimum value.");
                    }
                }
            }
            this.clock.decrement();
            this.clock.increment();
        }
    }),
    
    megapanel: Class.create(Sprite, {
        initialize: function (img, sounds, xCoord, fDial, pDial, gDial) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            var makeSelectable = function () {
                this.selectable = true;
            };
            var makeUsable = function () {
                this.usable = true;
            };
            
            this.onOffSound = sounds.onOff;
            this.selectSound = sounds.polystate;
            this.image = img;
            this.x = xCoord;
            this.y = 240;
            this.selectable = true;
            this.usable = true;
            
            this.timeLeft = Constants.seconds;
            this.clock = new Timer.clock(this);
            
            // Two states
            //  - 0: Off.
            //  - 1: On.
            this.state = 0;
            
            // Three selections
            //  - 0: Frims decreasing, pazzles and gonks increasing.
            //  - 1: Pazzles decreasing, frims and gonks increasing.
            //  - 2: Gonks decreasing, frimz and pazzles increasing.
            this.selection = 0;
            
            this.actionPoint = this.x + (this.width / 2);
            this.onSwitch = new Switch.onOff(this);
            this.selector = new Switch.polystate(this);
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
                    this.tl.cue({ 7 : makeSelectable });
                    this.tl.cue({ 7: makeUsable });
                }
            };
            this.use = function useFunction() {
                if (this.usable) {
                    if (this.state === 1) {
                        this.state = 0;
                        this.onOffSound.play();
                        this.clock.canDecrement = false;
                    } else {
                        this.state = 1;
                        this.onOffSound.play();
                        this.clock.canDecrement = true;
                    }
                    this.usable = false;
                    this.tl.clear();
                    this.tl.cue({ 7: makeUsable });
                    this.tl.cue({ 7 : makeSelectable });
                }
            };
            
            this.fDial = fDial;
            this.pDial = pDial;
            this.gDial = gDial;
        },
        
        onenterframe: function modifyDials() {
            "use strict";
            if (this.state === 1) {
                if (this.selection === 0) {
                    if ((this.fDial.value - this.fDial.downRate) >= this.fDial.minValue) {
                        this.fDial.value -= this.fDial.downRate;
                    }
                    if ((this.pDial.value + this.pDial.upRate) <= this.pDial.maxValue) {
                        this.pDial.value += this.pDial.upRate;
                    }
                    if ((this.gDial.value + this.gDial.upRate) <= this.gDial.maxValue) {
                        this.gDial.value += this.gDial.upRate;
                    }
                }
                if (this.selection === 1) {
                    if ((this.pDial.value - this.pDial.downRate) >= this.pDial.minValue) {
                        this.pDial.value -= this.pDial.downRate;
                    }
                    if ((this.fDial.value + this.fDial.upRate) <= this.fDial.maxValue) {
                        this.fDial.value += this.fDial.upRate;
                    }
                    if ((this.gDial.value + this.gDial.upRate) <= this.gDial.maxValue) {
                        this.gDial.value += this.gDial.upRate;
                    }
                }
                if (this.selection === 2) {
                    if ((this.gDial.value - this.gDial.downRate) >= this.gDial.minValue) {
                        this.gDial.value -= this.gDial.downRate;
                    }
                    if ((this.fDial.value + this.fDial.upRate) <= this.fDial.maxValue) {
                        this.fDial.value += this.fDial.upRate;
                    }
                    if ((this.pDial.value + this.pDial.upRate) <= this.pDial.maxValue) {
                        this.pDial.value += this.pDial.upRate;
                    }
                }
                
                if ((this.fDial.value > this.fDial.maxValue) || (this.fDial.value < this.fDial.minValue)) {
                    this.fDial.lost = true;
                } else if ((this.pDial.value > this.pDial.maxValue) || (this.pDial.value < this.pDial.minValue)) {
                    this.pDial.lost = true;
                } else if ((this.gDial.value > this.gDial.maxValue) || (this.gDial.value < this.gDial.minValue)) {
                    this.gDial.lost = true;
                }
            }
            this.clock.decrement();
            this.clock.increment();
        }
    })
};


var Player = Class.create(Sprite, {
    initialize: function (img, game) {
        "use strict";
        Sprite.call(this, (img.width / 2), img.height);
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
                    }
                }
            } else if (this.game.input.down && !this.game.input.up) {
                console.info("Player input down.");
                for (i = 0; i < this.interactables.length; i++) {
                    if (this.intersect(this.interactables[i].selector)) {
                        this.interactables[i].select();
                    }
                }
            }
        });
    }
});


var Machine = Class.create(Label, {
    initialize: function (game, frimRate, pazzleRate, gonkRate) {
        "use strict";
        Label.call(this);
        this.game = game;
        
        this.visible = false;
        
        this.dials = {
            frimDial: {},
            pazzleDial: {},
            gonkDial: {}
        };
        
        this.frimRate = frimRate;
        this.pazzleRate = pazzleRate;
        this.gonkRate = gonkRate;
        
        this.exploding = false;
        this.explosion = new Label("KA-BOOM!");
        this.explosion.height = Constants.stageHeight;
        this.explosion.width = Constants.stageWidth;
        this.explosion.backgroundColor = Constants.red;
        this.explosion.font = "100px arial,sans-serif";
        this.explosion.color = "yellow";
        this.explosion.x = 0;
        this.explosion.y = 0;
        this.explosion.visible = false;
        this.explode = function () {
            this.explosion.visible = true;
        };
        
        this.addEventListener(Event.ENTER_FRAME, function () {
            if (this.exploding) {
                this.explode();
            } else {
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
            }
            
            if ((this.dials.frimDial.lost === true) || (this.dials.pazzleDial.lost === true) || (this.dials.gonkDial.lost === true)) {
                this.exploding = true;
            }
        });
    }
});


var Scenes = {
    title: Class.create(Scene, {
        initialize: function () {
            "use strict";
            Scene.call(this);
            
            this.height = Constants.stageHeight;
            this.width = Constants.stageWidth;
            this.backgroundColor = "#333333";
            
            var pressSpace = new Label("Press spacebar to start.");
            pressSpace.font = "50px arial,sans-serif";
            pressSpace.color = "white";
            pressSpace.x = 50;
            pressSpace.y = 125;
            pressSpace.width = Constants.stageWidth;
            
            this.addChild(pressSpace);
        }
    }),
    
    factory: Class.create(Scene, {
        initialize: function (images, sounds, game) {
            "use strict";
            console.info("Creating factory scene.");
            Scene.call(this);
            this.game = game;
            
            var frims   = new Indicator.dial("Frims", images.frims, 25, 10, 90, 0.1, 0.09);
            var pazzles = new Indicator.dial("Pazzles", images.pazzles, 230, 30, 85, 0.12, 0.1);
            var gonks   = new Indicator.dial("Gonks", images.gonks, 435, 5, 50, 0.08, 0.07);
            var frimurderer = new Indicator.panel(images.panel, sounds.panel, 0, pazzles, frims);
            var pazzlepaddler = new Indicator.panel(images.panel, sounds.panel, 160, gonks, pazzles);
            var gonkiller = new Indicator.panel(images.panel, sounds.panel, 320, frims, gonks);
            var fixitall = new Indicator.megapanel(images.megapanel, sounds.megapanel, 480, frims, pazzles, gonks);
            var children = [];
            var i;
            
            this.player = new Player(images.player, game);
            this.player.interactables.push(frimurderer);
            this.player.interactables.push(pazzlepaddler);
            this.player.interactables.push(gonkiller);
            this.player.interactables.push(fixitall);
            
            this.machine = new Machine(game, 0.05, 0.06, 0.04);
            this.machine.dials.frimDial = frims;
            this.machine.dials.pazzleDial = pazzles;
            this.machine.dials.gonkDial = gonks;
            
            children.push(frims);
            children.push(pazzles);
            children.push(gonks);
            children.push(frimurderer);
            children.push(pazzlepaddler);
            children.push(gonkiller);
            children.push(fixitall);
            children.push(this.player);
            children.push(this.machine);
            
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
                    this.addChild(children[i].nameLabel);
                }
                if (children[i].explosion) {
                    this.addChild(children[i].explosion);
                }
            }
        }
    })
};


$(document).ready(function () {
    "use strict";
    var game = new Core(Constants.stageWidth, Constants.stageHeight);
    game.preload('img/dial.png',
                 'img/panel.png',
                 'img/player.png',
                 'img/safe.png',
                 'img/warning.png',
                 'sound/bork.mp3',
                 'sound/gerk.mp3',
                 'sound/klaxon.mp3');
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
            danger: game.assets['sound/klaxon.mp3'],
            panel: game.assets['sound/gerk.mp3'],
            megapanel: {
                onOff: game.assets['sound/gerk.mp3'],
                polystate: game.assets['sound/bork.mp3']
            }
        };
        bindKeys(game);
        var factoryScene = new Scenes.factory(images, sounds, game);
        var titleScene = new Scenes.title();
        titleScene.addEventListener(Event.ENTER_FRAME, function () {
            if (game.input.a) {
                game.popScene(this);
            }
        });
        
        game.pushScene(factoryScene);
        game.pushScene(titleScene);
    };
    game.start();
});