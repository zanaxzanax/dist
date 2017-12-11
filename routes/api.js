"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../classes/app");
var errors_1 = require("./../errors");
var middlewares_1 = require("./middlewares");
var formidable = require("express-formidable");
var _ = require("lodash");
var config_1 = require("./../config");
var success = {
    ok: true
};
exports.default = {
    init: function (exp) {
        exp.get('/api/game/:uuid', middlewares_1.default.auth, function (req, res, next) {
            var game = app_1.default.getGame(req.params.uuid);
            if (game) {
                return res.json(game);
            }
            return next(new errors_1.default.RouteError());
        });
        exp.get('/api/game', middlewares_1.default.auth, function (req, res) {
            res.json(app_1.default.getGames());
        });
        exp.get('/api/user', middlewares_1.default.auth, function (req, res) {
            res.json(req.user);
        });
        exp.get('/api/config', middlewares_1.default.auth, function (req, res) {
            var forSend = _.extend({}, config_1.default);
            delete forSend['jwtSecret'];
            res.json(forSend);
        });
        exp.post('/api/game', middlewares_1.default.auth, formidable(), function (req, res) {
            var game = app_1.default.addGame(_.extend({}, req.fields, { user: req.user }));
            res.redirect("/game/" + game.uuid);
        });
        exp.delete('/api/game/:uuid', middlewares_1.default.auth, function (req, res, next) {
            if (app_1.default.removeGame(req.params.uuid, req.user)) {
                return res.json(success);
            }
            return next(new errors_1.default.BadError());
        });
    }
};
