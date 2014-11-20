var defineBookStruct = require('../structs/book.json');

var Builder = require('entityx').Builder;
var BookDriver = Builder.buildRepository(defineBookStruct);

module.exports = BookDriver;
