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
var express_1 = __importDefault(require("express"));
var Jwt_1 = require("../middlewares/Jwt");
var Connect_1 = __importDefault(require("../db/Connect"));
var router = express_1.default.Router();
var sortes = {
    likesd: ['likes', 'desc'],
    likesu: ['likes', 'asc'],
    dated: ['createdat', 'desc'],
    dateu: ['createdat', 'asc'],
    named: ['bq.name', 'desc'],
    nameu: ['bq.name', 'asc']
};
// запрос всех книг
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, sort, _c, search, limit, skip, sortOptions, searchOption, limitOption, skipOption, queryString, books, err_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, _b = _a.sort, sort = _b === void 0 ? 'likesd' : _b, _c = _a.search, search = _c === void 0 ? '' : _c, limit = _a.limit, skip = _a.skip;
                sortOptions = sortes[sort];
                if (!sortOptions)
                    sortOptions = sortes['likesd'];
                searchOption = search ? "where bq.name ilike '%$5:value%' or bq.name ilike '$5:value%' " : '';
                limitOption = limit ? limit : 15;
                skipOption = skip ? skip : 0;
                queryString = "\n  select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, cj.name as category_name,\n  (select count(id) from book_likes bj where bq.id = bj.book_id) as likes\n  from book as bq \n  join author as aj on bq.author_id = aj.id\n  join categories as cj on bq.category_id = cj.id\n  " + searchOption + "\n  order by $3:raw $4:raw, bq.name desc\n  limit $1 offset $2";
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Connect_1.default.any(queryString, [
                        limitOption,
                        skipOption,
                        sortOptions[0],
                        sortOptions[1],
                        search
                    ])];
            case 2:
                books = _d.sent();
                res.json({ ok: true, data: books });
                return [3 /*break*/, 4];
            case 3:
                err_1 = _d.sent();
                res.status(400).json({ ok: false, message: err_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/categories', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Connect_1.default.any('select * from categories')];
            case 1:
                categories = _a.sent();
                res.json({ ok: true, data: categories });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(400).json({ ok: false, message: err_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Запрос одной книги
router.get('/one/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, queryString, book, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!id)
                    return [2 /*return*/, res.status(400).json({ ok: false, message: 'Invalid request' })];
                queryString = "\n    select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, bq.author_id, cj.name as category_name,\n    (select count(id) from book_likes bj where bq.id = bj.book_id) as likes\n    from book as bq \n    join author as aj on bq.author_id = aj.id\n    join categories as cj on bq.category_id = cj.id\n    where bq.id = $1\n  ";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Connect_1.default.one(queryString, [id])];
            case 2:
                book = _a.sent();
                res.json({ ok: true, data: book });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(400).json({ ok: false, message: 'Invalid request' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Запрос информации по автору
router.get('/author/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, queryStringBooks, queryStringAuthor, request1, request2, resultObject, err_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                if (!id)
                    return [2 /*return*/, res.status(400).json({ ok: false, message: 'Invalid request' })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                queryStringBooks = "\n      select bq.id ,bq.name, createdat, bq.photo_path, bq.description, cj.name as category_name,\n      (select count(id) from book_likes bj where bq.id = bj.book_id) as likes\n      from book as bq\n      join categories as cj on bq.category_id = cj.id\n      where author_id = $1\n      order by likes desc, bq.name desc\n    ";
                queryStringAuthor = "\n      select * from author where id = $1\n    ";
                request1 = Connect_1.default.query(queryStringBooks, [id]);
                request2 = Connect_1.default.query(queryStringAuthor, [id]);
                _a = {};
                return [4 /*yield*/, request1];
            case 2:
                _a.books = _b.sent();
                return [4 /*yield*/, request2];
            case 3:
                resultObject = (_a.author = (_b.sent())[0],
                    _a);
                res.json({ ok: true, data: resultObject });
                return [3 /*break*/, 5];
            case 4:
                err_4 = _b.sent();
                res.status(400).json({ ok: false, message: err_4 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// запрос книг по категории
router.get('/:category', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, sort, search, limit, skip, category, sortOptions, searchOption, limitOption, skipOption, queryString, books, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, sort = _a.sort, search = _a.search, limit = _a.limit, skip = _a.skip;
                category = req.params.category;
                sortOptions = sortes[sort];
                if (!sortOptions)
                    sortOptions = sortes['likesd'];
                searchOption = search ? "and (bq.name ilike '%$5:value%' or bq.name ilike '$5:value%')" : '';
                limitOption = limit ? limit : 15;
                skipOption = skip ? skip : 0;
                queryString = "\n  select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, cj.name as category_name,\n  (select count(id) from book_likes bj where bq.id = bj.book_id) as likes\n  from book as bq \n  join author as aj on bq.author_id = aj.id\n  join categories as cj on bq.category_id = cj.id\n  where category_id = $6:value " + searchOption + "\n  order by $3:raw $4:raw\n  limit $1:raw offset $2:raw";
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Connect_1.default.any(queryString, [
                        limitOption,
                        skipOption,
                        sortOptions[0],
                        sortOptions[1],
                        search,
                        category
                    ])];
            case 2:
                books = _b.sent();
                res.json({ ok: true, data: books });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                res.status(400).json({ ok: false, message: err_5 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// поставить лайк
router.post('/like', Jwt_1.JwtCheck, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, book_id, exists, correctLikes, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = req.user.id;
                book_id = req.body.book_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!+user_id || !+book_id)
                    return [2 /*return*/, res.status(400).json({ ok: false, message: 'Invalid request' })];
                return [4 /*yield*/, Connect_1.default.oneOrNone('select * from book_likes where book_id = $1 and user_id = $2', [book_id, user_id])];
            case 2:
                exists = _a.sent();
                if (exists)
                    return [2 /*return*/, res.json({ ok: false, message: 'like has already chosen' })];
                return [4 /*yield*/, Connect_1.default.query('insert into book_likes(book_id, user_id) values ($1, $2)', [book_id, user_id])];
            case 3:
                _a.sent();
                return [4 /*yield*/, Connect_1.default.one('select count(id) from book_likes where book_id = $1 ', [book_id])];
            case 4:
                correctLikes = _a.sent();
                res.json({ ok: true, correctLikes: correctLikes.count });
                return [3 /*break*/, 6];
            case 5:
                err_6 = _a.sent();
                res.status(400).json({ ok: false, message: 'Error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// удалить лайк
router.post('/unlike', Jwt_1.JwtCheck, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, book_id, correctLikes, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = req.user.id;
                book_id = req.body.book_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Connect_1.default.query('delete from book_likes where book_id = $2 and user_id = $1', [user_id, book_id])];
            case 2:
                _a.sent();
                return [4 /*yield*/, Connect_1.default.one('select count(id) from book_likes where book_id = $1 ', [book_id])];
            case 3:
                correctLikes = _a.sent();
                res.json({ ok: true, correctLikes: correctLikes.count });
                return [3 /*break*/, 5];
            case 4:
                err_7 = _a.sent();
                res.status(400).json({ ok: false, message: 'Error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Запрос списка лайков для пользователя
router.post('/likes/user', Jwt_1.JwtCheck, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, queryString, likes, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.user.id;
                queryString = "\n    select book_id from book_likes where user_id = $1\n  ";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Connect_1.default.query(queryString, id)];
            case 2:
                likes = _a.sent();
                likes = likes.map(function (likeObject) { return likeObject.book_id; });
                res.json({ ok: true, data: likes });
                return [3 /*break*/, 4];
            case 3:
                err_8 = _a.sent();
                res.status(400).json({ ok: false, message: err_8 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Запрос списка книг пользователя
router.post('/user/books', Jwt_1.JwtCheck, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, skip, limit, limitOption, skipOption, queryString, books, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.user.id;
                _a = req.body, skip = _a.skip, limit = _a.limit;
                limitOption = limit ? limit : 15;
                skipOption = skip ? skip : 0;
                queryString = "\n    select bj.id , bj.name, createdat, bj.photo_path, bj.description, aj.name as author_name, cj.name as category_name,\n    (select count(id) as likes from book_likes bq where bj.id = bq.book_id) from book_likes lq\n    join book bj on bj.id = lq.book_id \n    join categories as cj on bj.category_id = cj.id\n    join author as aj on bj.author_id = aj.id\n    where user_id = $1\n    limit $2 offset $3 \n  ";
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Connect_1.default.query(queryString, [id, limitOption, skipOption])];
            case 2:
                books = _b.sent();
                res.json({ ok: true, data: books });
                return [3 /*break*/, 4];
            case 3:
                err_9 = _b.sent();
                res.status(400).json({ ok: false, message: err_9 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
// Выборка книги
// select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, cj.name as category_name,
// (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
// from book as bq 
// join author as aj on bq.author_id = aj.id
// join categories as cj on bq.category_id = cj.id
// -- where category_id = 1
// -- where bq.name ilike '%н%' or bq.name ilike 'н%'
// order by createdat desc
// limit 5 offset 0
// Загрузка книг по автору
// select bq.id ,bq.name, createdat, bq.photo_path, bq.description, cj.name as category_name,
// (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
// from book as bq
// join categories as cj on bq.category_id = cj.id
// where author_id = 1
// order by likes desc
// Добавление лайка
// insert into book_likes(book_id, user_id) values (5, 3)
// Запрос автора
// select * from author where id = 1
// запрос категорий
// select * from categories
// запрос инфо по книге
// select bq.id ,bq.name, createdat, bq.photo_path, bq.description, aj.name as author_name, cj.name as category_name,
// (select count(id) from book_likes bj where bq.id = bj.book_id) as likes
// from book as bq 
// join author as aj on bq.author_id = aj.id
// join categories as cj on bq.category_id = cj.id
// where bq.id = 1
// удаление лайка
// delete from book_likes where book_id = 1 and user_id = 1
// запрос книг пользователя
// select bj.id , bj.name, createdat, bj.photo_path, bj.description, aj.name as author_name, cj.name as category_name,
//   (select count(id) from book_likes bq where bj.id = bq.book_id) from book_likes lq
// join book bj on bj.id = lq.book_id 
// join categories as cj on bj.category_id = cj.id
// join author as aj on bj.author_id = aj.id
// where user_id = 1
// limit 15 offset 0 
