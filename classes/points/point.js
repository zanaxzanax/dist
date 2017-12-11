"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.toJSON = function () {
        return {
            x: this.x,
            y: this.y,
        };
    };
    return Point;
}());
exports.default = Point;
