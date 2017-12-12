"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var enums_1 = require("./enums");
var uuid = require("uuid");
var App = (function () {
    function App() {
        this.games = [];
        this.singles = [];
        this.users = [];
    }
    App.prototype.start = function (io) {
        this.io = io;
        return this;
    };
    App.prototype.getGames = function () {
        return this.games || [];
    };
    App.prototype.getGame = function (uuid) {
        return this.games.find(function (game) { return game.uuid === uuid; }) ||
            this.singles.find(function (game) { return game.uuid === uuid; }) || null;
    };
    App.prototype.joinGame = function (uuid, user) {
        var founded = this.getGame(uuid);
        if (founded && founded.join(user)) {
            this.io.emit('games:update', [founded]);
            return true;
        }
        return false;
    };
    App.prototype.readyGame = function (uuid, user) {
        var founded = this.getGame(uuid);
        if (founded) {
            founded.ready(user);
        }
    };
    App.prototype.pivotGame = function (data, user) {
        var founded = this.getGame(data.uuid);
        if (founded) {
            founded.pivot(data, user);
        }
    };
    App.prototype.leaveGamesByUser = function (user) {
        var games = this.games.filter(function (game) {
            return !game.isDone() && game.slots.find(function (player) { return player.uuid === user.uuid; });
        });
        games.forEach(function (game) {
            game.slots = game.slots.filter(function (player) { return player.uuid !== user.uuid; });
            game.slots.forEach(function (player) {
                player.setState(enums_1.PlayerState.NOT_READY);
            });
            game.softStop();
        });
        if (games.length) {
            this.io.emit('games:update', games);
        }
    };
    App.prototype.addGame = function (options) {
        if (options.type === enums_1.GameTypes[enums_1.GameTypes.SINGLE]) {
            var game = {
                name: options.name,
                rule: parseInt(options.rule, 10),
                speed: parseInt(options.speed, 10),
                type: enums_1.GameTypes.SINGLE,
                uuid: uuid()
            };
            this.singles.push(game);
            return game;
        }
        else {
            var game = new game_1.default(this, options);
            this.games.push(game);
            this.io.emit('games:add', game);
            return game;
        }
    };
    App.prototype.removeGame = function (uuid, user) {
        var founded = this.getGame(uuid);
        if (founded && founded.creator.uuid === user.uuid) {
            founded.stop();
            this.games.splice(this.games.indexOf(founded), 1);
            this.io.emit('games:remove', [founded.uuid]);
            return true;
        }
        else {
            return false;
        }
    };
    App.prototype.getUserByName = function (name) {
        return this.users.find(function (user) { return user.name === name; });
    };
    return App;
}());
exports.default = new App();
