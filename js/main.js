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
                Sprite */


enchant();


var Constants = {
    debug: true,
    blue: "#00CCFF",
    playerSpeed: 8,
    red: "#FF0000",
    seconds: 10,
    stageHeight: 480,
    stageWidth: 640
};
if (Object.freeze) { Object.freeze(Constants); }


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
            this.offColor = Constants.red;
            this.height = 20;
            this.width = 60;
            this.x = this.panel.x + 30;
            this.y = this.panel.y + 100;
            
            this.text = "OFF";
            this.backgroundColor = this.offColor;
            this.color = "white";
            this.font = "20px arial,sans-serif";
        },
        
        onenterframe: function update() {
            "use strict";
            if (this.panel.isOn) {
                this.backgroundColor = this.onColor;
                this.text = "ON";
                this.color = "black";
            } else {
                this.backgroundColor = this.offColor;
                this.text = "OFF";
                this.color = "white";
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
            this.y = this.megapanel.y + 100;
            
            this.text = "OFF";
            this.backgroundColor = this.offColor;
            this.color = this.offTextColor;
            this.font = "18px arial,sans-serif";
        },
        
        onenterframe: function update() {
            "use strict";
            if (this.megapanel.state === 0) {
                this.backgroundColor = this.offColor;
                this.text = "OFF";
                this.color = this.offTextColor;
            } else if (this.megapanel.state === 1) {
                this.backgroundColor = this.onColor;
                this.text = "FRIMS<br>DECREASING";
                this.color = this.onTextColor;
            } else if (this.megapanel.state === 2) {
                this.backgroundColor = this.onColor;
                this.text = "PAZZLES<br>DECREASING";
                this.color = this.onTextColor;
            } else if (this.megapanel.state === 3) {
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
        initialize: function (images, xCoord, minSafe, maxSafe) {
            "use strict";
            Sprite.call(this, images.dial.width, images.dial.height);
            
            this.image = images.dial;
            this.x = xCoord;
            this.y = 240 - this.height - 30;
            
            this.minSafe = minSafe;
            this.maxSafe = maxSafe;
            this.value = ((this.maxSafe - this.minSafe) / 2) + this.minSafe;
            this.danger = new Warning.danger(images.warning, this);
            this.safe = new Warning.safe(images.safe, this);
        }
    }),
    
    panel: Class.create(Sprite, {
        initialize: function (img, xCoord) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            this.image = img;
            this.x = xCoord;
            this.y = 240;
            
            this.timeLeft = Constants.seconds;
            this.usable = true;
            this.isOn = false;
            
            this.clock = new Timer.clock(this);
            this.onSwitch = new Switch.onOff(this);
        },
        
        onenterframe: function () {
            "use strict";
        }
    }),
    
    megapanel: Class.create(Sprite, {
        initialize: function (img, xCoord) {
            "use strict";
            Sprite.call(this, img.width, img.height);
            
            this.image = img;
            this.x = xCoord;
            this.y = 240;
            
            this.timeLeft = Constants.seconds;
            this.usable = true;
            
            // Four states
            //  - 0: Off.
            //  - 1: Frims decreasing, pazzles and gonks increasing.
            //  - 2: Pazzles decreasing, frims and gonks increasing.
            //  - 3: Gonks decreasing, frimz and pazzles increasing.
            this.state = 0;
            
            this.clock = new Timer.clock(this);
            this.onSwitch = new Switch.polystate(this);
        },
        
        onenterframe: function () {
            "use strict";
        }
    })
};


var Player = Class.create(Sprite, {
    initialize: function (img) {
        "use strict";
        Sprite.call(this, img.width, img.height);
        
        this.image = img;
        this.x = (Constants.stageWidth / 2) - (this.width / 2);
        this.y = Constants.stageHeight - this.height;
    }
});


var Scenes = {
    factory: Class.create(Scene, {
        initialize: function (images) {
            "use strict";
            Scene.call(this);
            var frims = new Indicator.dial(images.frims, 25, 10, 90);
            var pazzles = new Indicator.dial(images.pazzles, 230, 30, 85);
            var gonks = new Indicator.dial(images.gonks, 435, 5, 50);
            var whatsit = new Indicator.panel(images.panel, 0);
            var thingymabob = new Indicator.panel(images.panel, 160);
            var doodad = new Indicator.panel(images.panel, 320);
            var fixitall = new Indicator.megapanel(images.megapanel, 480);
            var player = new Player(images.player);
            var children = [];
            var i;
            
            children.push(frims);
            children.push(pazzles);
            children.push(gonks);
            children.push(whatsit);
            children.push(thingymabob);
            children.push(doodad);
            children.push(fixitall);
            children.push(player);
            
            this.backgroundColor = "black";
            for (i = 0; i < children.length; i++) {
                this.addChild(children[i]);
                if (children[i].clock) {
                    this.addChild(children[i].clock);
                }
                if (children[i].onSwitch) {
                    this.addChild(children[i].onSwitch);
                }
                if (children[i].safe) {
                    this.addChild(children[i].safe);
                }
                if (children[i].danger) {
                    this.addChild(children[i].danger);
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
    game.fps = 20;
    game.onload = function () {
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
        
        var factoryScene = new Scenes.factory(images);
        game.pushScene(factoryScene);
    };
    game.start();
});