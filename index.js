"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("./express");
var app_1 = require("./classes/app");
var socket_1 = require("./socket");
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || "3000";
Promise.resolve()
    .then(function () { return express_1.default.start(); })
    .then(function (server) { return socket_1.default.start(server); })
    .then(function (io) { return app_1.default.start(io); })
    .then(function (app) {
    console.log('Initialized');
})
    .catch(console.error);
