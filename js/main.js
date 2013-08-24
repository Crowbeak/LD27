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
    })
};


var Indicator = {
    panel: Class.create(Sprite, {
        initialize: function (img, xCoord) {
            "use strict";
            Sprite.call(this, 160, 240);
            
            this.image = img;
            this.x = xCoord;
            this.y = 240;
            
            this.timeLeft = Constants.seconds;
            this.usable = true;
            this.isOn = false;
            
            this.clock = new Timer.clock(this);
            this.onSwitch = new Switch.onOff(this);
        }
    })
};


var Scenes = {
    factory: Class.create(Scene, {
        initialize: function (images) {
            "use strict";
            Scene.call(this);
            var frims = new Sprite(180, 120);
            var pazzles = new Sprite(180, 120);
            var gonks = new Sprite(180, 120);
            var whatsit = new Indicator.panel(images.panel, 0);
            var thingymabob = new Indicator.panel(images.panel, 160);
            var doodad = new Indicator.panel(images.panel, 320);
            var fixitall = new Indicator.panel(images.panel, 480);
            var children = [];
            var i;
            
            frims.image = images.frims;
            frims.x = 25;
            frims.y = 60;
            
            children.push(frims);
            children.push(pazzles);
            children.push(gonks);
            children.push(whatsit);
            children.push(thingymabob);
            children.push(doodad);
            children.push(fixitall);
            
            this.backgroundColor = "black";
            for (i = 0; i < children.length; i++) {
                this.addChild(children[i]);
                if (children[i].clock) {
                    this.addChild(children[i].clock);
                }
                if (children[i].onSwitch) {
                    this.addChild(children[i].onSwitch);
                }
            }
        }
    })
};


$(document).ready(function () {
    "use strict";
    var game = new Core(Constants.stageWidth, Constants.stageHeight);
    game.preload('img/panel.png',
                 'img/dial.png');
    game.fps = 20;
    game.onload = function () {
        var images = {
            panel: game.assets['img/panel.png'],
            frims: game.assets['img/dial.png']
        };
        var factoryScene = new Scenes.factory(images);
        game.pushScene(factoryScene);
    };
    game.start();
});