"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("./middlewares");
var jwt = require("jsonwebtoken");
var app_1 = require("../classes/app");
var errors_1 = require("./../errors");
var uuid = require("uuid");
var config_1 = require("./../config");
var _ = require("lodash");
exports.default = {
    init: function (exp) {
        exp.get('/', function (req, res) {
            res.render('main', {
                title: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F - " + config_1.default.clientName,
                clientName: config_1.default.clientName,
                name: 'main'
            });
        });
        exp.get('/switch', middlewares_1.default.auth, function (req, res) {
            res.render('switch', {
                title: "\u0422\u0438\u043F \u0438\u0433\u0440\u044B - " + config_1.default.clientName,
                clientName: config_1.default.clientName,
                name: 'switch'
            });
        });
        exp.get('/list', middlewares_1.default.auth, function (req, res) {
            res.render('list', {
                title: "\u0421\u043F\u0438\u0441\u043E\u043A \u0438\u0433\u0440 - " + config_1.default.clientName,
                clientName: config_1.default.clientName,
                name: 'list'
            });
        });
        exp.post('/switch', middlewares_1.default.auth, function (req, res, next) {
            switch (req.body.type) {
                case 'multiplayer':
                    return res.redirect('/list');
                case 'single':
                    return res.redirect('/game/create');
                default:
                    return next(new errors_1.default.RouteError());
            }
        });
        exp.get('/error/:status', function (req, res) {
            res.render('error', {
                status: req.params.status,
                title: "\u041E\u0448\u0438\u0431\u043A\u0430 - " + config_1.default.clientName,
                clientName: config_1.default.clientName,
                name: 'error'
            });
        });
        exp.post('/auth', function (req, res, next) {
            if (!app_1.default.getUserByName(req.body.name)) {
                jwt.sign(_.extend({}, req.body, { uuid: uuid() }), config_1.default.jwtSecret, function (err, token) {
                    if (err) {
                        return next(err);
                    }
                    else {
                        res.cookie('token', token, {
                            path: '/',
                            httpOnly: false
                        });
                        return res.redirect('/switch');
                    }
                });
            }
            else {
                return res.redirect('/');
            }
        });
        exp.get('/game/create', middlewares_1.default.auth, function (req, res, next) {
            return res.render('game', {
                title: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u0438\u0433\u0440\u044B - " + config_1.default.clientName,
                clientName: config_1.default.clientName,
                name: 'single',
                creation: true
            });
        });
        exp.post('/game', middlewares_1.default.auth, function (req, res, next) {
            return res.render('game', {
                title: "\u0418\u0433\u0440\u0430 - " + config_1.default.clientName,
                clientName: config_1.default.clientName,
                name: 'single',
                creation: false,
                query: req.body
            });
        });
        exp.get('/game/:uuid', middlewares_1.default.auth, function (req, res, next) {
            if (app_1.default.getGame(req.params.uuid)) {
                return res.render('multiplayer', {
                    title: "\u0418\u0433\u0440\u0430 - " + config_1.default.clientName,
                    clientName: config_1.default.clientName,
                    name: 'multiplayer',
                });
            }
            else {
                return next(new errors_1.default.RouteError());
            }
        });
    }
};
