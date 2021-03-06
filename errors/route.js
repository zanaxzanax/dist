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
var RouteError = (function (_super) {
    __extends(RouteError, _super);
    function RouteError() {
        var _this = _super.call(this) || this;
        Error.captureStackTrace(_this, _this.constructor);
        _this.name = _this.constructor.name;
        _this.status = 404;
        return _this;
    }
    return RouteError;
}(Error));
exports.default = RouteError;
