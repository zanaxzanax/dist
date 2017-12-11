"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var body_point_1 = require("./points/body-point");
var enums_1 = require("./enums");
var Snake = (function () {
    function Snake(game, points) {
        var _this = this;
        this.game = game;
        /* static defaults: SnakeOptions = {
             playerUUID: '',
             length: 1,
             startX: 0,
             startY: 0,
             direction: PivotPointType.RIGHT,
         };
     */
        //    options: SnakeOptions;
        this.points = [];
        this.points = points.map(function (point) { return new body_point_1.default(_this.game, point); });
    }
    Object.defineProperty(Snake.prototype, "headPoint", {
        get: function () {
            return this.points[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Snake.prototype, "lastPoint", {
        get: function () {
            return this.points[this.points.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    Snake.prototype.length = function () {
        return this.points.length;
    };
    Snake.prototype.isSelfHit = function () {
        var _this = this;
        return !!this.points.find(function (point) {
            return !!_this.points.find(function (p) { return p !== point && p.x === point.x && p.y === point.y; });
        });
    };
    Snake.prototype.grow = function () {
        var x = this.lastPoint.x;
        var y = this.lastPoint.y;
        switch (this.lastPoint.direction) {
            case enums_1.PivotPointType.UP:
                y += 1;
                break;
            case enums_1.PivotPointType.DOWN:
                y -= 1;
                break;
            case enums_1.PivotPointType.LEFT:
                x += 1;
                break;
            case enums_1.PivotPointType.RIGHT:
                x -= 1;
                break;
            default:
                break;
        }
        this.points.push(new body_point_1.default(this.game, { x: x, y: y, direction: this.lastPoint.direction }));
    };
    Snake.prototype.move = function () {
        var _this = this;
        var pivots = this.game.pivots[this.game.getPlayerUUIDBySnake(this)];
        var good = this.game.goods[this.game.getPlayerUUIDBySnake(this)];
        var direction;
        this.points.forEach(function (point) {
            var pivot = pivots.find(function (pivotPoint) {
                return pivotPoint.x === point.x && pivotPoint.y === point.y;
            });
            direction = pivot ? pivot.direction : point.direction;
            point.direction = direction;
            switch (direction) {
                case enums_1.PivotPointType.UP:
                    point.y -= 1;
                    break;
                case enums_1.PivotPointType.DOWN:
                    point.y += 1;
                    break;
                case enums_1.PivotPointType.LEFT:
                    point.x -= 1;
                    break;
                case enums_1.PivotPointType.RIGHT:
                    point.x += 1;
                    break;
                default:
                    break;
            }
            if (_this.game.rule === enums_1.GameRule.WALL_THROW) {
                if (point.x > _this.game.maxX) {
                    point.x = 0;
                }
                if (point.x < 0) {
                    point.x = _this.game.maxX;
                }
                if (point.y > _this.game.maxY) {
                    point.y = 0;
                }
                if (point.y < 0) {
                    point.y = _this.game.maxY;
                }
            }
            if (_this.points.indexOf(point) === 0) {
                if (point.x === good.x && point.y === good.y) {
                    good.eat();
                }
            }
        });
        if (good.isEaten()) {
            this.grow();
        }
    };
    Snake.prototype.toJSON = function () {
        return {
            points: this.points
        };
    };
    return Snake;
}());
exports.default = Snake;
