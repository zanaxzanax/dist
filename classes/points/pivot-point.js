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
var enums_1 = require("../enums");
var PivotPoint = (function (_super) {
    __extends(PivotPoint, _super);
    function PivotPoint(game, options) {
        var _this = _super.call(this, options.x, options.y) || this;
        _this.game = game;
        _this.x = options.x;
        _this.y = options.y;
        _this.direction = options.direction;
        return _this;
    }
    PivotPoint.prototype.isUp = function () {
        return this.direction === enums_1.PivotPointType.UP;
    };
    PivotPoint.prototype.isDown = function () {
        return this.direction === enums_1.PivotPointType.DOWN;
    };
    PivotPoint.prototype.isLeft = function () {
        return this.direction === enums_1.PivotPointType.LEFT;
    };
    PivotPoint.prototype.isRight = function () {
        return this.direction === enums_1.PivotPointType.RIGHT;
    };
    PivotPoint.prototype.isOpposite = function (direction) {
        return this.isUp() && direction.isDown() || this.isDown() && direction.isUp() ||
            this.isLeft() && direction.isRight() || this.isRight() && direction.isLeft();
    };
    PivotPoint.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
            direction: this.direction
        };
    };
    return PivotPoint;
}(point_1.default));
exports.PivotPoint = PivotPoint;
