var util = require('util');
var MongoDBObjectID = require('entityx').MongoDBObjectID;

var BookDriver = function(id) {
  MongoDBObjectID.call(this, {
    collectionName: 'books',
    useTimestamp: true
  }, id);
};
util.inherits(BookDriver, MongoDBObjectID);

module.exports = BookDriver;

//var defineBookStruct = require('../structs/book.json');
//
//var Builder = require('entityx').Builder;
//var BookDriver = Builder.buildRepository(defineBookStruct);
//
//module.exports = BookDriver;
