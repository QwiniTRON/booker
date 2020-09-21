"use strict";
// Для форматировния и вставки есть такой формат
// await db.any('SELECT * FROM product WHERE price BETWEEN $1 AND $2', [1, 10])
// $1, $2 это указания на элемент из списка который нужно вставить
// await db.any('SELECT * FROM users WHERE name = $1', 'John') также возможно
// можно ссылаться на структуру объекта 
// await db.none('INSERT INTO users(first_name, last_name, age) VALUES(${name.first}, $<name.last>, $/age/)', {
//   name: {first: 'John', last: 'Dow'},
//   age: 30
// });
// вложить объект в формате json
// await db.none('INSERT INTO documents(id, doc) VALUES(${id}, ${this})', {
//   id: 123,
//   body: 'some text'    
// })
//=> INSERT INTO documents(id, doc) VALUES(123, '{"id":123,"body":"some text"}')
// можно превратить подстановку в различные указания, например: 
// await db.any('SELECT $1:name FROM $2:name', ['price', 'products'])
//=> SELECT "price" FROM "products"
// Получается что мы подставили значение как название
// await db.any('SELECT ${column:name} FROM ${table:name}', {
//   column: 'price',
//   table: 'products'    
// });
// ^name - коротко ~
// Можно указать так и массив раскроется
// await db.query('SELECT ${columns:name} FROM ${table:name}', {
//   columns: ['column1', 'column2'],
//   table: 'table'
// });
// const obj = {
//   one: 1,
//   two: 2
// };
// await db.query('SELECT $1:name FROM $2:name', [obj, 'table']);
//=> SELECT "one","two" FROM "table"
// await db.query('INSERT INTO table(${this:name}) VALUES(${this:csv})', obj);
//=> INSERT INTO table("one","two") VALUES(1, 2)
// Алиас
// await db.any('SELECT full_name as $1:alias FROM $2:name', ['name', 'table']);
//=> SELECT full_name as name FROM "table"
// Вставка как тескт
// const where = pgp.as.format('WHERE price BETWEEN $1 AND $2', [5, 10]); // pre-format WHERE condition
// await db.any('SELECT * FROM products $1:raw', where);
//=> SELECT * FROM products WHERE price BETWEEN 5 AND 10
// Желательно использовать экранирование для like and ilike
// SELECT * FROM table WHERE name LIKE '%$1:value%')
// some:json - форматирует значение как json
// Для раскрытия массива
// const ids = [1, 2, 3];
// await db.any('SELECT * FROM table WHERE id IN ($1:csv)', [ids])
//=> SELECT * FROM table WHERE id IN (1,2,3)
// const ids = [1, 2, 3];
// await db.any('SELECT * FROM table WHERE id IN ($1:list)', [ids])
//=> SELECT * FROM table WHERE id IN (1,2,3)
// const obj = {first: 123, second: 'text'};
// await db.none('INSERT INTO table($1:name) VALUES($1:csv)', [obj])
//=> INSERT INTO table("first","second") VALUES(123,'text')
// await db.none('INSERT INTO table(${this:name}) VALUES(${this:csv})', obj)
//=> INSERT INTO table("first","second") VALUES(123,'text')
