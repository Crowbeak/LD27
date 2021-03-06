// Gauge Juggling
// by Lena LeRay
//
// A game in which one must keep the machines from exploding by managing
// gauge outputs.


// This is the last file to load.
// Initializes and starts the game itself.

/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    $,
            Constants,
            enchant,
                Class,
                Core,
                Event,
                Label,
                Node,
                Scene,
                Sprite,
                Surface,
            Gauges,
            Observer */


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
        
        this.observers = [];
        this.addEventListener(Event.ENTER_FRAME, function () {
            var i;
            var updateData = {
                onOff: false,
                selector: false,
                player: this
            };
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
            if (this.game.input.up || this.game.input.down) {
                if (this.game.input.up) {
                    console.log("Player input up.");
                    updateData.onOff = true;
                } else if (this.game.input.down) {
                    console.info("Player input down.");
                    updateData.selector = true;
                }
                
                for (i = 0; i < this.observers.length; i++) {
                    this.observers[i].update(updateData);
                    this.frame = 2;
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
        
        this.gauges = {};
        
        this.baseRate = Constants.baseRate;
        this.gauge1Rate = this.baseRate;
        this.gauge2Rate = this.baseRate;
        this.gauge3Rate = this.baseRate;
        
        this.exploding = false;
        
        this.addEventListener(Event.ENTER_FRAME, function () {
            this.gauges.gauge1.value += this.gauge1Rate;
            this.gauges.gauge2.value += this.gauge2Rate;
            this.gauges.gauge3.value += this.gauge3Rate;
            
            if ((this.gauges.gauge1.value > this.gauges.gauge1.maxValue) || (this.gauges.gauge1.value < this.gauges.gauge1.minValue)) {
                this.gauges.gauge1.lost = true;
            } else if ((this.gauges.gauge2.value > this.gauges.gauge2.maxValue) || (this.gauges.gauge2.value < this.gauges.gauge2.minValue)) {
                this.gauges.gauge2.lost = true;
            } else if ((this.gauges.gauge3.value > this.gauges.gauge3.maxValue) || (this.gauges.gauge3.value < this.gauges.gauge3.minValue)) {
                this.gauges.gauge3.lost = true;
            }
            
            if ((this.gauges.gauge1.lost === true) || (this.gauges.gauge2.lost === true) || (this.gauges.gauge3.lost === true)) {
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
            
            var frims   = new Gauges.Gauge(images.frims, sounds.danger, 25,
                                           {name: "Frims", minSafe: 25,
                                            maxSafe : 85, machine: this.machine});
            var pazzles = new Gauges.Gauge(images.pazzles, sounds.danger, 230,
                                           {name: "Pazzles", minSafe: 10,
                                            maxSafe : 70, machine: this.machine});
            var gonks   = new Gauges.Gauge(images.gonks, sounds.danger, 435,
                                           {name: "Gonks", minSafe: 45,
                                            maxSafe : 90, machine: this.machine});
            var frimurderer   = new sp.panel("Frimurderer", images.panel, sounds.panel,
                                                  0, {downGauge: frims, upGauge: pazzles});
            var pazzlepaddler = new sp.panel("Pazzlepaddler", images.panel, sounds.panel,
                                                    160, {downGauge: pazzles, upGauge: gonks});
            var gonkiller     = new sp.panel("Gonkiller", images.panel, sounds.panel,
                                                320, {downGauge: gonks, upGauge: frims});
            var fixitall = new sp.megapanel("Fix-It-All", images.megapanel, sounds.megapanel, 480,
                                            {downGauge: frims, upGauge: pazzles, upGauge2: gonks});
            var seconds = new Label();
            var children = [];
            var i;
            
            this.player = new Player(images.player, game);
            this.player.observers.push(frimurderer);
            this.player.observers.push(pazzlepaddler);
            this.player.observers.push(gonkiller);
            this.player.observers.push(fixitall);
            
            this.machine = new Machine(game);
            this.machine.gauges.gauge1 = frims;
            this.machine.gauges.gauge2 = pazzles;
            this.machine.gauges.gauge3 = gonks;
            
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
                    this.addChild(children[i].nameLabel);
                    if (children[i].selector) {
                        this.addChild(children[i].selector);
                    }
                }
                if (children[i].safe) {
                    this.addChild(children[i].safe);
                    this.addChild(children[i].danger);
                    this.addChild(children[i].highZone);
                    this.addChild(children[i].safeZone);
                    this.addChild(children[i].lowZone);
                    this.addChild(children[i].needle);
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
$(document).ready(function () {
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
                gauge: game.assets['img/dial.png'],
                warning: game.assets['img/warning.png'],
                safe: game.assets['img/safe.png']
            },
            gonks: {
                gauge: game.assets['img/dial.png'],
                warning: game.assets['img/warning.png'],
                safe: game.assets['img/safe.png']
            },
            megapanel: game.assets['img/panel.png'],
            panel: game.assets['img/panel.png'],
            pazzles: {
                gauge: game.assets['img/dial.png'],
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
                selector: game.assets['sound/bork.wav']
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
});
