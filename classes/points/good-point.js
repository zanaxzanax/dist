"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var point_1 = require("./point");
var GoodPoint = (function (_super) {
    __extends(GoodPoint, _super);
    function GoodPoint(game, options) {
        var _this = _super.call(this, options.x, options.y) || this;
        _this.game = game;
        _this.eaten = false;
        _this.x = options.x;
        _this.y = options.y;
        _this.playerUUID = options.playerUUID;
        return _this;
    }
    GoodPoint.prototype.isEaten = function () {
        return this.eaten;
    };
    GoodPoint.prototype.eat = function () {
        this.eaten = true;
    };
    GoodPoint.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y
        };
    };
    return GoodPoint;
}(point_1.default));
exports.default = GoodPoint;
