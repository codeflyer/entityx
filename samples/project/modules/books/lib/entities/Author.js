//var defineAuthorStruct = require('../structs/author.json');
//var Builder = require('entityx').Builder;
//
//var Author = Builder.buildEntity(defineAuthorStruct);
//module.exports = Author;


var util = require('util');
var defineAuthorStruct = require('../structs/author.json');
var Entity = require('entityx').Entity;
var Builder = require('entityx').Builder;

var Author = function() {
  Entity.call(this,
      {'useTimestamp': true, repositoryName: 'Books/Author'});
};
util.inherits(Author, Entity);
Builder.buildEntity(defineAuthorStruct, Author);

module.exports = Author;
