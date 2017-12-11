"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("./auth");
var bad_1 = require("./bad");
var route_1 = require("./route");
exports.default = {
    AuthError: auth_1.default,
    BadError: bad_1.default,
    RouteError: route_1.default
};
