"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var errors_1 = require("./errors");
var routes_1 = require("./routes");
var config_1 = require("./config");
var path = require("path");
var exp = express();
exp.use(bodyParser.urlencoded({ extended: false }));
exp.use(bodyParser.json());
exp.use(cookieParser());
exp.set('view engine', 'ejs');
exp.set('views', path.resolve(__dirname, './routes/pages'));
routes_1.default.api.init(exp);
routes_1.default.pages.init(exp);
exp.use(express.static(__dirname + './public'));
exp.use(function (req, res, next) {
    next(new errors_1.default.RouteError());
});
var isXMLHttpRequest = function (req) {
    return req.headers && req.headers['X-Requested-With'] === 'XMLHttpRequest';
};
exp.use(function (err, req, res, next) {
    var isXML = isXMLHttpRequest(req);
    if (isXML) {
        res.status(err.status || 500);
        return res.json({
            errors: {
                message: err.message,
                error: {}
            }
        });
    }
    else {
        switch (err.status) {
            case 403:
                return res.redirect('/');
            default:
                return res.render('error', {
                    status: err.status,
                    title: "\u041E\u0448\u0438\u0431\u043A\u0430 - " + config_1.default.clientName,
                    clientName: config_1.default.clientName,
                    name: 'error'
                });
        }
    }
});
exports.default = {
    start: function () { return new Promise(function (resolve, reject) {
        var server = exp.listen(process.env.PORT);
        server.on('error', reject);
        server.on('listening', function () {
            resolve(server);
        });
    }); }
};
