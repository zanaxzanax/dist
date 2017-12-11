"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var errors_1 = require("./../errors");
var config_1 = require("./../config");
exports.default = {
    auth: function (req, res, next) {
        var token = req.cookies['token'];
        if (token) {
            jwt.verify(token, config_1.default.jwtSecret, function (err, user) {
                if (err) {
                    return next(new errors_1.default.AuthError());
                }
                else {
                    req.user = user;
                    return next();
                }
            });
        }
        else {
            return next(new errors_1.default.AuthError());
        }
    }
};
