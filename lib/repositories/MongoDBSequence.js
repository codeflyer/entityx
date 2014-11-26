var util = require('util');
var MongoDB = require('./MongoDB');
var Promise = require('bluebird');
var sequenceManager = require('./MongoDbSequenceManager');
var ErrorX = require('ErrorX');

var MongoDBSequenceDriver = function(options, id) {
  MongoDB.call(this, options);

  if (id > 0) {
    this._id = id;
  }
};
util.inherits(MongoDBSequenceDriver, MongoDB);

MongoDBSequenceDriver.prototype.insert = Promise.method(function(data) {
  if (this.useTimestamp) {
    var creationDate = new Date();
    if (this.timestampFlat) {
      data._created = creationDate;
      data._modified = creationDate;
      data._deleted = null;
    } else {
      data._ts = {
        created: creationDate,
        modified: creationDate,
        deleted: null
      };
    }
  }

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
        throw new ErrorX(500, 'MongoDb error', err);
      }
  );
});

module.exports = MongoDBSequenceDriver;
