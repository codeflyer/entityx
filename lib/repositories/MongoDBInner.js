var util = require('util');
var sequenceManager = require('./MongoDbSequenceManager');
var MongoDBSequenceDriver = require('./MongoDBSequence');
var Promise = require('bluebird');
var ErrorX = require('ErrorX');

var MongoDBInnerDriver = function(options, id) {
  MongoDBSequenceDriver.call(this, options);

  if (options.innerFieldName == null) {
    throw new Error('Inner field Name not defined');
  } else if (typeof options.innerFieldName !== 'string' ||
      options.innerFieldName.length === 0) {
    throw new Error('Inner field Name not valid');
  } else {
    this.innerFieldName = options.innerFieldName;
  }

  if (id > 0) {
    this._id = id;
  }
};
util.inherits(MongoDBInnerDriver, MongoDBSequenceDriver);

MongoDBInnerDriver.prototype.insert = Promise.method(function(parentId, data) {
  this.addTimestampInsertValue(data);

  var that = this;
  return sequenceManager.getNewId(
      this.collectionName + ':' + that.innerFieldName).then(
      function(newId) {
        data._id = newId;
        var newEntry = {};
        newEntry[that.innerFieldName] = data;
        return that.mongoDbUpdate(
            {'_id': parentId},
            {$push: newEntry}
        );
      }
  ).then(
      function() {
        return null;
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Error on insert new sub document', err);
      }
  );
});

/**
 * Set the modified field before the save operations
 * @param {Object} data
 */
MongoDBInnerDriver.prototype.addTimestampUpdateValue = function(data) {
  if (this.useTimestamp) {
    if (this.timestampFlat) {
      data[this.innerFieldName + '.$._modified'] = new Date();
    } else {
      data[this.innerFieldName + '.$._ts.modified'] = new Date();
    }
  }
};

MongoDBInnerDriver.prototype.update = Promise.method(function(data) {
  this._requireInit();

  var query = {};
  query[this.innerFieldName + '._id'] = this._id;
  var update = {};
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      update[this.innerFieldName + '.$.' + key] = data[key];
    }
  }
  this.addTimestampUpdateValue(update);

  return this.mongoDbUpdate(
      query,
      {$set: update}
  ).then(
      function(doc) {
        return doc;
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'Update error', err);
      }
  );
});

/**
 * Load the entity referred to ID
 * @return {*} promise
 */
MongoDBInnerDriver.prototype.loadEntity = Promise.method(function() {
  this._requireInit();

  var query = {};
  query[this.innerFieldName + '._id'] = this._id;

  var projection = {};
  projection[this.innerFieldName + '.$'] = 1;

  return this.mongoDbFindOne(
      query,
      projection
  ).then(
      function(doc) {
        return doc;
      }
  ).catch(
      function(err) {
        throw new ErrorX(err.code, 'loadEntity error', err);
      }
  );
});

module.exports = MongoDBInnerDriver;
