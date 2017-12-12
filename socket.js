"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var s = require("socket.io");
var app_1 = require("./classes/app");
var jwt = require("jsonwebtoken");
exports.default = {
    start: function (server) { return new Promise(function (resolve, reject) {
        var io = s.listen(server);
        io.on('error', function (err) {
            console.log('error', err);
        });
        io.on('connection', function (socket) {
            var token = socket.handshake.query.token;
            jwt.verify(token, 'secret', function (err, decoded) {
                var user = decoded;
                if (err) {
                    socket.disconnect(true);
                }
                else {
                    // console.log(decoded);
                    user.socket = socket;
                    app_1.default.users.push(user);
                    socket.on('ready', function (uuid) {
                        app_1.default.readyGame(uuid, user);
                    });
                    socket.on('pivot', function (data) {
                        app_1.default.pivotGame(data, user);
                    });
                    socket.on('join', function (uuid) {
                        if (app_1.default.joinGame(uuid, user)) {
                            socket.join(uuid);
                        }
                    });
                    socket.on('disconnect', function (reason) {
                        app_1.default.users.splice(app_1.default.users.indexOf(user), 1);
                        app_1.default.leaveGamesByUser(user);
                    });
                }
            });
        });
        resolve(io);
    }); }
};
