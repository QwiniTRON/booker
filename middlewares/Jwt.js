"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtCheck = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
function JwtCheck(req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        var token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Вы не авторизованы", ok: false });
        }
        var decoded = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtSecret'), {});
        req.user = decoded;
        return next();
    }
    catch (e) {
        if (e.name == 'TokenExpiredError') {
            return res.status(401).json({ message: "invalid token", ok: false, tokenEnd: true });
        }
        return res.status(401).json({ message: "no token", ok: false, notoken: true });
    }
}
exports.JwtCheck = JwtCheck;
