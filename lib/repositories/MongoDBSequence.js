var util = require('util');
var MongoDBAbstractDriver = require('./MongoDBAbstractDriver');
var Promise = require('bluebird');
var sequenceManager = require('./MongoDbSequenceManager');
var ErrorX = require('codeflyer-errorx');

var MongoDBSequenceDriver = function(options, id) {
  MongoDBAbstractDriver.call(this, options);

  if (id > 0) {
    this._id = id;
  }
};
util.inherits(MongoDBSequenceDriver, MongoDBAbstractDriver);

MongoDBSequenceDriver.prototype.insert = Promise.method(function(data) {
  this.addTimestampInsertValue(data);
  var that = this;
  return sequenceManager.getNewId(this.collectionName).then(
      function(newId) {
        data._id = newId;
        return that.mongoDbInsert(data);
      }
  ).then(
      function(doc) {
        return doc[0];
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Error on insert new document', err);
      }
  );
});

module.exports = MongoDBSequenceDriver;
