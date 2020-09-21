"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
var express_validator_1 = require("express-validator");
var Connect_1 = __importDefault(require("../db/Connect"));
exports.registerValidator = [
    express_validator_1.body('email', 'Email не по формату').normalizeEmail().isEmail().bail()
        .custom(function (value) {
        return new Promise(function (resolve, reject) {
            Connect_1.default.query('select id from person where email = $1', value).then(function (d) {
                if (d.length === 0)
                    resolve();
                else
                    reject('Пользователь с таким email уже зарегистрирован');
            });
        });
    }),
    express_validator_1.body('password').trim()
        .isLength({ min: 6, max: 48 }).withMessage('Пароль не меньше 6 символов и не длиннее 48')
        .isAlphanumeric().withMessage('пароль должен содержать только цифры и буквы латинского алфавита')
        .matches(/\d/i).withMessage('Пароль должен иметь хотябы одну цифру')
        .matches(/[a-zA-Z]/i).withMessage('Пароль должен иметь хотябы одну букву'),
    express_validator_1.body('passwordr').trim().custom(function (value, _a) {
        var req = _a.req;
        if (value !== req.body.password)
            throw 'пароли должны совпадать';
        return true;
    }),
    express_validator_1.body('nickname').trim().isLength({ min: 3, max: 48 }).withMessage('Ник не короче 3 символов и не длиннее 48')
        .isAlphanumeric().withMessage('ник должен содержать только цифры и буквы латинского алфавита').bail()
        .custom(function (nick) {
        return new Promise(function (resolve, reject) {
            Connect_1.default.query('select id from person where nickname = $1', nick).then(function (d) {
                if (d.length === 0)
                    resolve();
                else
                    reject('Пользователь с таким ником уже зарегистрирован');
            });
        });
    })
];
exports.loginValidator = [
    express_validator_1.body('email').normalizeEmail().isEmail(),
    express_validator_1.body('password').trim()
        .isLength({ min: 6, max: 48 }).withMessage('Пароль не меньше 6 символов и не длиннее 48')
        .isAlphanumeric().withMessage('Пароль должен содержать только цифры и буквы латинского алфавита')
];
// ** NOTE ** \\
// В express-validator можно не только body валидировать, но и param и т.д
// sanitize - это функции которые позволяют подкорректировать пришедшие значения
// Есть метод для проверки check([field, message]).chains().sinitizes()
// Он проверяет отмеченное поле в 
// req.body
// req.cookies
// req.headers
// req.params
// req.query
// body, cookie, header, param, query, - тоже самое, но проверяет в определенном месте 
// checkSchema(schema) проверяет везде, по заданной схеме(объект с указанием полей и настроек к ним)
// oneOf - должна пройти хотябы одна из проверок
// buildCheckFunction - позволяет создать функцию как check, только с указанными местами для проверки
// Проверки проходят последовательно, тоесть, после sanitize(customSanitize) проверка будет проходить уже над 
// очищенным значением
// есть валидаторы isSome - они описаны в библиотеке validator.js
// .bail() - остановит дальнейшие операции если была ошибка перед этой командой
// .custom(validator(value, { req, location, path }))
// if(condition(value, { req, path, location })) - проверяет есть ли смысл дальше проверять поле
// body('oldPassword')
// if the new password is provided...
// .if((value, { req }) => req.body.newPassword)
// OR
// .if(body('newPassword').exists())
// .not() - инвертирует результат следующего валидатора
// .withMessage(message) - установка текста ошибки
// .customSanitizer(sanitizer(value, { req, location, path })) - возвращаем модифицировнанное значение
// check(['name', 'password'])
// validationResult(req) - для получения итогового списка ошибок
// const result = validationResult(req);
// const hasErrors = !result.isEmpty(); - есть ли вообще ошибки
// форматирование ошибок
// const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
// Build your resulting errors however you want! String, object, whatever - it works!
//   return `${location}[${param}]: ${msg}`;
// };
// const result = validationResult(req).formatWith(errorFormatter);
// получить все ошибки в виде массива, если указать { onlyFirstError: false }, то для каждого, поля будет отображена 
// только одна ошибка
// .array([options])
// ошибки в объекте, где свойство - это поле, а значение - это ошибка
// .mapped()
// выкинуть ошибки
// .throw()
// формат ошибки
// {
//   "msg": "The error message",
//   "param": "param.name.with.index[0]",
//   "value": "param value",
// Location of the param that generated this error.
// It's either body, query, params, cookies or headers.
//   "location": "body",
// nestedErrors only exist when using the oneOf function
//   "nestedErrors": [{ ... }]
// }
