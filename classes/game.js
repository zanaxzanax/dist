"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var player_1 = require("./player");
var config_1 = require("../config");
var snake_1 = require("./snake");
var enums_1 = require("./enums");
var good_point_1 = require("./points/good-point");
var points_1 = require("./points");
var moment = require("moment");
var _ = require("lodash");
var Game = (function () {
    function Game(app, options) {
        this.app = app;
        this.fieldResolutionX = config_1.default.fieldResolutionX;
        this.fieldResolutionY = config_1.default.fieldResolutionY;
        this.uuid = uuid();
        this.type = enums_1.GameTypes.MULTIPLAYER;
        this.playersLimit = 2;
        this.slots = [];
        this.pivots = {};
        this.snakes = {};
        this.goods = {};
        this._state = enums_1.GameState.CREATED;
        this.uuid = uuid();
        this.name = options.name || "name" + Date.now();
        this.speed = parseInt(options.speed, 10) || 1;
        this.rule = parseInt(options.rule, 10) || enums_1.GameRule.WALL_THROW;
        this.creator = new player_1.default(this, options.user);
        this.playersLimit = 2;
    }
    Object.defineProperty(Game.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
            this.sendUpdateMessage();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "maxX", {
        get: function () {
            return this.fieldResolutionX - 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "maxY", {
        get: function () {
            return this.fieldResolutionY - 1;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.sendUpdateMessage = function () {
        this.app.io.to(this.uuid).emit('games:update', [this]);
    };
    Game.prototype.isFull = function () {
        return this.slots.length === this.playersLimit;
    };
    Game.prototype.isInPlay = function () {
        return this.state === enums_1.GameState.PLAY;
    };
    Game.prototype.isCreated = function () {
        return this.state === enums_1.GameState.CREATED;
    };
    Game.prototype.isDone = function () {
        return this.state === enums_1.GameState.DONE;
    };
    Game.prototype.join = function (user) {
        if (!this.isFull() && this.isCreated() && !this._getPlayerByUUID(user.uuid)) {
            this.slots.push(new player_1.default(this, user));
            return true;
        }
        else {
            return false;
        }
    };
    Game.prototype.ready = function (user) {
        var player = this._getPlayerByUUID(user.uuid);
        if (player) {
            player.state = enums_1.PlayerState.READY; // READY;
            if (this._allReady()) {
                this._start();
            }
        }
    };
    Game.prototype.pivot = function (data, user) {
        if (this._getPlayerByUUID(user.uuid) && this.isInPlay()) {
            this.pivots[user.uuid] = this.pivots[user.uuid] || [];
            this.pivots[user.uuid].push(new points_1.PivotPoint(this, {
                x: this.snakes[user.uuid].headPoint.x,
                y: this.snakes[user.uuid].headPoint.y,
                direction: data.direction
            }));
        }
    };
    Game.prototype.softStop = function () {
        this._state = enums_1.GameState.CREATED;
        this.endTime = Date.now();
        this._stopMovement();
    };
    Game.prototype.stop = function () {
        this.softStop();
        this._state = enums_1.GameState.DONE;
    };
    Game.prototype.toJSON = function () {
        return {
            name: this.name,
            playersLimit: this.playersLimit,
            speed: this.speed,
            slots: this.slots,
            startTime: this.startTime,
            now: this.now,
            endTime: this.endTime,
            state: this.state,
            goods: this.goods,
            creator: this.creator,
            snakes: this.snakes,
            uuid: this.uuid
        };
    };
    Game.prototype._allReady = function () {
        return this.isFull() && this.slots.every(function (player) { return player.state === 1; });
    };
    Game.prototype._getPlayerByUUID = function (uuid) {
        return this.slots.find(function (player) { return player.uuid === uuid; });
    };
    Game.prototype._checkGoods = function () {
        var _this = this;
        Object.keys(this.goods).forEach(function (playerUUID) {
            var good = _this.goods[playerUUID];
            if (!good || good.isEaten()) {
                _this.goods[playerUUID] = _this._createGood();
            }
        });
    };
    Game.prototype._cleanPivots = function () {
        var _this = this;
        Object.keys(this.pivots).forEach(function (playerUUID) {
            var pivots = _this.pivots[playerUUID].slice();
            var snakePoints = _this.snakes[playerUUID].points;
            _this.pivots[playerUUID].length = 0;
            pivots.forEach(function (pivot) {
                if (snakePoints.find(function (point) { return point.x === pivot.x && point.y === pivot.y; })) {
                    _this.pivots[playerUUID].push(pivot);
                }
            });
        });
    };
    Game.prototype._moveSnakes = function () {
        var _this = this;
        Object.keys(this.snakes).forEach(function (playerUUID) {
            _this.snakes[playerUUID].move(_this.pivots[playerUUID], _this.goods[playerUUID]);
        });
    };
    Game.prototype._start = function () {
        var _this = this;
        this.startTime = Date.now();
        this.endTime = Date.now();
        this.now = Date.now();
        this.slots.forEach(function (slot) {
            var playerUUID = slot.uuid;
            _this.snakes[playerUUID] = new snake_1.default(_this, [{
                    x: Math.round(_this.fieldResolutionX / 2),
                    y: Math.round(_this.fieldResolutionY / 2),
                    direction: enums_1.PivotPointType.RIGHT
                }]);
            _this.pivots[playerUUID] = [];
            _this.goods[slot.uuid] = _this._createGood();
        });
        this.state = enums_1.GameState.PLAY;
        this._startMovement();
    };
    Game.prototype._isGameOld = function (secCount) {
        return this.isInPlay() && moment.utc(this.now).diff(moment.utc(this.startTime), 'seconds') >= secCount;
    };
    Game.prototype._checkLosers = function () {
        var _this = this;
        var uuidArray = Object.keys(this.snakes).filter(function (playerUUID) {
            var snake = _this.snakes[playerUUID];
            return (_this.rule === enums_1.GameRule.SIMPLE && snake.headPoint.x > _this.maxX ||
                snake.headPoint.y > _this.maxY ||
                snake.headPoint.y < 0 || snake.headPoint.x < 0) ||
                snake.isSelfHit();
        });
        uuidArray.forEach(function (uuid) {
            _this._getPlayerByUUID(uuid).setState(enums_1.PlayerState.LOSER);
        });
    };
    Game.prototype._hasLosers = function () {
        return !!this.slots.find(function (player) { return player.isLoser(); });
    };
    Game.prototype._checkWinners = function () {
        var _this = this;
        var lenArray = Object.keys(this.snakes).map(function (playerUUID) { return ({
            playerUUID: playerUUID,
            len: _this.snakes[playerUUID].length()
        }); });
        var max = _.maxBy(lenArray, function (item) { return item.len; });
        lenArray = lenArray.filter(function (num) { return num === max; });
        lenArray.forEach(function (item) {
            _this._getPlayerByUUID(item.playerUUID).setState(enums_1.PlayerState.WINNER);
        });
    };
    Game.prototype._tick = function () {
        this.now = Date.now();
        this._checkGoods();
        this._moveSnakes();
        this._cleanPivots();
        this._checkLosers();
        if (this._hasLosers()) {
            this.stop();
        }
        else {
            if (this._isGameOld(Game.gameDuration)) {
                this._checkWinners();
                this.stop();
            }
        }
        this.sendUpdateMessage();
    };
    Game.prototype._randomInteger = function (min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand;
    };
    Game.prototype._getRandomX = function () {
        return this._randomInteger(0, this.maxX);
    };
    Game.prototype._getRandomY = function () {
        return this._randomInteger(0, this.maxY);
    };
    Game.prototype._startMovement = function () {
        var _this = this;
        this._interval = setInterval(function () {
            _this._tick();
        }, (config_1.default.relativeSpeed || 1000) / this.speed);
    };
    Game.prototype._createGood = function () {
        return new good_point_1.default(this, { x: this._getRandomX(), y: this._getRandomY() });
    };
    Game.prototype._stopMovement = function () {
        clearInterval(this._interval);
    };
    return Game;
}());
Game.gameDuration = config_1.default.gameDuration || 60;
exports.default = Game;
