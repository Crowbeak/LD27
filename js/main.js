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


var Constants = {
    blue: "#00CCFF",
    fps: 20,
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
        initialize: function (images, xCoord, minSafe, maxSafe, upRate, downRate) {
            "use strict";
            Sprite.call(this, images.dial.width, images.dial.height);
            
            this.image = images.dial;
            this.x = xCoord;
            this.y = 240 - this.height - 30;
            
            this.minValue = 0;
            this.maxValue = 100;
            this.minSafe = minSafe;
            this.maxSafe = maxSafe;
            this.value = ((this.maxSafe - this.minSafe) / 2) + this.minSafe;
            this.upRate = upRate;
            this.downRate = downRate;
            
            // !!!
            this.tempDisplay = new Label(this.value);
            this.tempDisplay.x = this.x;
            this.tempDisplay.y = this.y;
            this.tempDisplay.color = "black";
            this.tempDisplay.font = "50px arial,sans-serif";
            this.addEventListener(Event.ENTER_FRAME, function () {
                this.tempDisplay.text = Math.floor(this.value);
            });
            
            this.danger = new Warning.danger(images.warning, this);
            this.safe = new Warning.safe(images.safe, this);
        }
    }),
    
    panel: Class.create(Sprite, {
        initialize: function (img, xCoord, upDial, downDial) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
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
                        this.state = 0;
                    } else {
                        this.state += 1;
                    }
                    this.usable = false;
                    setTimeout(useFunction, 1000);
                } else {
                    this.usable = true;
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
                }
                if ((this.downDial.value - this.downDial.downRate) >= this.downDial.minValue) {
                    this.downDial.value -= this.downDial.downRate;
                }
            }
        }
    }),
    
    megapanel: Class.create(Sprite, {
        initialize: function (img, xCoord, fDial, pDial, gDial) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            this.image = img;
            this.x = xCoord;
            this.y = 240;
            
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
            this.selectable = true;
            this.select = function selectFunction() {
                if (this.selectable) {
                    if (this.selection === 2) {
                        this.selection = 0;
                    } else {
                        this.selection += 1;
                    }
                    this.selectable = false;
                    setTimeout(selectFunction, 1000);
                } else {
                    this.selectable = true;
                }
            };
            this.usable = true;
            this.use = function useFunction() {
                if (this.usable) {
                    if (this.state === 1) {
                        this.state = 0;
                    } else {
                        this.state += 1;
                    }
                    this.usable = false;
                    setTimeout(useFunction, 1000);
                } else {
                    this.usable = true;
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
            }
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


var Scenes = {
    factory: Class.create(Scene, {
        initialize: function (images, game) {
            "use strict";
            console.info("Creating factory scene.");
            Scene.call(this);
            this.game = game;
            
            var frims = new Indicator.dial(images.frims, 25, 10, 90, 0.1, 0.09);
            var pazzles = new Indicator.dial(images.pazzles, 230, 30, 85, 0.12, 0.1);
            var gonks = new Indicator.dial(images.gonks, 435, 5, 50, 0.08, 0.07);
            var whatsit = new Indicator.panel(images.panel, 0, frims, pazzles);
            var thingymabob = new Indicator.panel(images.panel, 160, pazzles, gonks);
            var doodad = new Indicator.panel(images.panel, 320, gonks, frims);
            var fixitall = new Indicator.megapanel(images.megapanel, 480, frims, pazzles, gonks);
            var children = [];
            var i;
            
            this.player = new Player(images.player, game);
            this.player.interactables.push(whatsit);
            this.player.interactables.push(thingymabob);
            this.player.interactables.push(doodad);
            this.player.interactables.push(fixitall);
            
            children.push(frims);
            children.push(pazzles);
            children.push(gonks);
            children.push(whatsit);
            children.push(thingymabob);
            children.push(doodad);
            children.push(fixitall);
            children.push(this.player);
            
            this.backgroundColor = "black";
            for (i = 0; i < children.length; i++) {
                this.addChild(children[i]);
                if (children[i].clock) {
                    this.addChild(children[i].clock);
                }
                if (children[i].onSwitch) {
                    this.addChild(children[i].onSwitch);
                }
                if (children[i].selector) {
                    this.addChild(children[i].selector);
                }
                if (children[i].safe) {
                    this.addChild(children[i].safe);
                }
                if (children[i].danger) {
                    this.addChild(children[i].danger);
                }
                if (children[i].tempDisplay) {
                    this.addChild(children[i].tempDisplay);
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
                 'img/warning.png');
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
        bindKeys(game);
        var factoryScene = new Scenes.factory(images, game);
        
        game.pushScene(factoryScene);
    };
    game.start();
});