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
var BodyPoint = (function (_super) {
    __extends(BodyPoint, _super);
    function BodyPoint(game, options) {
        var _this = _super.call(this, options.x, options.y) || this;
        _this.game = game;
        _this.x = options.x;
        _this.y = options.y;
        _this.direction = options.direction;
        return _this;
    }
    BodyPoint.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction
        };
    };
    return BodyPoint;
}(point_1.default));
exports.default = BodyPoint;
