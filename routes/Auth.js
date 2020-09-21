"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
var express_validator_1 = require("express-validator");
var Connect_1 = __importDefault(require("../db/Connect"));
var Validators_1 = require("../utils/Validators");
var Jwt_1 = require("../middlewares/Jwt");
var router = express.Router();
var secretKey = config_1.default.get('jwtSecret');
// login
router.post('/login', Validators_1.loginValidator, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, results, candidate, accessToken, refreshToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                results = express_validator_1.validationResult(req);
                if (!results.isEmpty()) {
                    return [2 /*return*/, res.status(403).json({
                            ok: false, message: results.array()[0].msg
                        })];
                }
                return [4 /*yield*/, Connect_1.default.oneOrNone('select * from person where email = $1', email)];
            case 1:
                candidate = _b.sent();
                if (!candidate || !bcryptjs_1.default.compareSync(password, candidate.password)) {
                    return [2 /*return*/, res.status(403).json({ ok: false, error: 'Неверные данные логин или пароль' })];
                }
                accessToken = jsonwebtoken_1.default.sign({
                    id: candidate.id,
                    type: 'ACCESS'
                }, secretKey, { expiresIn: config_1.default.get('jwtAccessTokenLife') });
                refreshToken = jsonwebtoken_1.default.sign({
                    id: candidate.id,
                    type: 'REFRESH'
                }, secretKey, { expiresIn: config_1.default.get('jwtRefreshTokenLife') });
                res.json({
                    refreshToken: refreshToken,
                    token: accessToken,
                    ok: true
                });
                return [2 /*return*/];
        }
    });
}); });
// register
router.post('/register', Validators_1.registerValidator, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, passwordr, nickname, results, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, passwordr = _a.passwordr, nickname = _a.nickname;
                results = express_validator_1.validationResult(req);
                if (!results.isEmpty()) {
                    return [2 /*return*/, res.status(403).json({
                            ok: false, message: results.array()[0].msg
                        })];
                }
                password = bcryptjs_1.default.hashSync(password, 12);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Connect_1.default.query('insert into person(nickname, email, password) values ($1, $3, $2)', [nickname, password, email])];
            case 2:
                _b.sent();
                res.json({ ok: true, register: true });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _b.sent();
                res.status(400).json({ ok: false, message: err_1.name });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// check token
router.post('/check', Jwt_1.JwtCheck, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json({ ok: true });
        return [2 /*return*/];
    });
}); });
// refresh token
router.post('/refresh', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshTokenClient, decoded, accessToken, refreshToken;
    return __generator(this, function (_a) {
        refreshTokenClient = req.body.refreshToken;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshTokenClient, config_1.default.get('jwtSecret'));
            if (decoded.type !== 'REFRESH')
                return [2 /*return*/, res.status(400).json({ ok: false, message: 'Invalid token!' })];
            accessToken = jsonwebtoken_1.default.sign({
                id: decoded.id,
                type: 'ACCESS'
            }, secretKey, { expiresIn: config_1.default.get('jwtAccessTokenLife') });
            refreshToken = jsonwebtoken_1.default.sign({
                id: decoded.id,
                type: 'REFRESH'
            }, secretKey, { expiresIn: config_1.default.get('jwtRefreshTokenLife') });
            return [2 /*return*/, res.json({
                    refreshToken: refreshToken,
                    token: accessToken,
                    ok: true
                })];
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return [2 /*return*/, res.status(401).json({ message: "Token expired!", ok: false, tokenEnd: true })];
            }
            else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return [2 /*return*/, res.status(401).json({ message: "Invalid token!", ok: false })];
            }
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
