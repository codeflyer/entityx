var defineBookStruct = require('../structs/book.json');
var Builder = require('entityx').Builder;
var Book = Builder.buildEntity(defineBookStruct);
module.exports = Book;
