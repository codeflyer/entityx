var defineBookStruct = require('../structs/author.json');

var Builder = require('entityx').Builder;
var AuthorDriver = Builder.buildRepository(defineBookStruct);

module.exports = AuthorDriver;
