"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
var Player = (function () {
    function Player(game, options) {
        this.game = game;
        this.uuid = options.uuid;
        this.name = options.name;
        this._state = 0; // NOT_READY;
    }
    Object.defineProperty(Player.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
            this.game.sendUpdateMessage();
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.setState = function (value) {
        this._state = value;
    };
    Player.prototype.isReady = function () {
        return this.state === enums_1.PlayerState.READY;
    };
    Player.prototype.isLoser = function () {
        return this.state === enums_1.PlayerState.LOSER;
    };
    Player.prototype.isWinner = function () {
        return this.state === enums_1.PlayerState.WINNER;
    };
    Player.prototype.toJSON = function () {
        return {
            name: this.name,
            uuid: this.uuid,
            state: this.state
        };
    };
    return Player;
}());
exports.default = Player;
