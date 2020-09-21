"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var config = require("config");
var path_1 = __importDefault(require("path"));
var Auth_1 = __importDefault(require("./routes/Auth"));
var Books_1 = __importDefault(require("./routes/Books"));
var app = express();
var PORT = config.get('express.PORT');
// configure app
app.use(express.json());
app.use('/img', express.static(path_1.default.join(__dirname, 'img')));
// routes
app.use('/api/auth', Auth_1.default);
app.use('/api/book', Books_1.default);
app.use(function (req, res) {
    res.status(404).send({ ok: false, message: 'Invalid request' });
});
if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path_1.default.join(__dirname, 'client', 'build')));
    app.get("*", function (req, res) {
        res.sendFile(path_1.default.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
// to handle error
app.use(function (err, req, res, next) {
    // some error
});
app.listen(PORT, function () {
    console.log("Server has alredy started at port: " + PORT);
});
