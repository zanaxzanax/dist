"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var s = require("socket.io");
var app_1 = require("./classes/app");
var jwt = require("jsonwebtoken");
exports.default = {
    start: function (server) { return new Promise(function (resolve, reject) {
        var io = s.listen(server);
        io.on('connection', function (socket) {
            var token = socket.handshake.query.token;
            console.log('a user connected', token);
            jwt.verify(token, 'secret', function (err, decoded) {
                var user = decoded;
                if (err) {
                    socket.disconnect(true);
                }
                else {
                    console.log(decoded); // bar
                    user.socket = socket;
                    app_1.default.users.push(user);
                    socket.on('ready', function (uuid) {
                        console.log('READY', uuid);
                        app_1.default.readyGame(uuid, user);
                    });
                    socket.on('pivot', function (data) {
                        console.log('PIVOT', data);
                        app_1.default.pivotGame(data, user);
                    });
                    socket.on('join', function (uuid) {
                        console.log('join', uuid);
                        if (app_1.default.joinGame(uuid, user)) {
                            console.log('JOIN TO ROOM');
                            socket.join(uuid);
                        }
                    });
                    socket.on('disconnect', function (reason) {
                        console.log('user disconnected ' + user.name, ' ', reason);
                        app_1.default.users.splice(app_1.default.users.indexOf(user), 1);
                        app_1.default.leaveGamesByUser(user);
                    });
                }
            });
        });
        resolve(io);
    }); }
};
