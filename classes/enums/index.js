"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameState;
(function (GameState) {
    GameState[GameState["CREATED"] = 0] = "CREATED";
    GameState[GameState["PLAY"] = 1] = "PLAY";
    GameState[GameState["DONE"] = 2] = "DONE";
})(GameState = exports.GameState || (exports.GameState = {}));
var GameTypes;
(function (GameTypes) {
    GameTypes[GameTypes["SINGLE"] = 0] = "SINGLE";
    GameTypes[GameTypes["MULTIPLAYER"] = 1] = "MULTIPLAYER";
})(GameTypes = exports.GameTypes || (exports.GameTypes = {}));
var GameEventType;
(function (GameEventType) {
    GameEventType[GameEventType["PIVOT"] = 0] = "PIVOT";
    GameEventType[GameEventType["TICK"] = 1] = "TICK";
})(GameEventType = exports.GameEventType || (exports.GameEventType = {}));
var GameSide;
(function (GameSide) {
    GameSide[GameSide["LEFT"] = 0] = "LEFT";
    GameSide[GameSide["RIGHT"] = 1] = "RIGHT";
})(GameSide = exports.GameSide || (exports.GameSide = {}));
var GameRule;
(function (GameRule) {
    GameRule[GameRule["WALL_THROW"] = 0] = "WALL_THROW";
    GameRule[GameRule["SIMPLE"] = 1] = "SIMPLE";
})(GameRule = exports.GameRule || (exports.GameRule = {}));
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["NOT_READY"] = 0] = "NOT_READY";
    PlayerState[PlayerState["READY"] = 1] = "READY";
    PlayerState[PlayerState["WINNER"] = 2] = "WINNER";
    PlayerState[PlayerState["LOSER"] = 3] = "LOSER";
})(PlayerState = exports.PlayerState || (exports.PlayerState = {}));
var PivotPointType;
(function (PivotPointType) {
    PivotPointType[PivotPointType["UP"] = 0] = "UP";
    PivotPointType[PivotPointType["DOWN"] = 1] = "DOWN";
    PivotPointType[PivotPointType["LEFT"] = 2] = "LEFT";
    PivotPointType[PivotPointType["RIGHT"] = 3] = "RIGHT";
})(PivotPointType = exports.PivotPointType || (exports.PivotPointType = {}));
